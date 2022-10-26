import * as React from 'react';
import {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState
} from 'react';
import { useParams } from 'react-router-dom';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';
import './session.styles';
import {
	Overlay,
	OVERLAY_FUNCTIONS,
	OverlayItem,
	OverlayWrapper
} from '../overlay/Overlay';
import { useSearchParam } from '../../hooks/useSearchParams';
import { SESSION_LIST_TAB } from './sessionHelpers';
import { useE2EE } from '../../hooks/useE2EE';
import { translate } from '../../utils/translate';
import { apiEnquiryAcceptance, FETCH_ERRORS } from '../../api';
import { history } from '../app/app';
import { Button, BUTTON_TYPES, ButtonItem } from '../button/Button';
import { useWatcher } from '../../hooks/useWatcher';
import { apiGetSessionRoomBySessionId } from '../../api/apiGetSessionRooms';
import { SessionAssign } from '../sessionAssign/SessionAssign';
import { ReactComponent as CheckIcon } from '../../resources/img/illustrations/check.svg';
import { ReactComponent as XIcon } from '../../resources/img/illustrations/x.svg';
import { useE2EEViewElements } from '../../hooks/useE2EEViewElements';
import { useTimeoutOverlay } from '../../hooks/useTimeoutOverlay';

interface AcceptAssignProps {
	assignable: boolean;
	assigned?: boolean;
	isAnonymous: boolean;
	btnLabel: string;
}

export const AcceptAssign = ({
	assignable,
	assigned,
	btnLabel,
	isAnonymous
}: AcceptAssignProps) => {
	const { activeSession } = useContext(ActiveSessionContext);

	const { rcGroupId: groupIdFromParam } = useParams();
	const abortController = useRef<AbortController>(null);

	const [overlayItem, setOverlayItem] = useState<OverlayItem>(null);
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);
	const sessionListTab = useSearchParam<SESSION_LIST_TAB>('sessionListTab');
	const getSessionListTab = () =>
		`${sessionListTab ? `?sessionListTab=${sessionListTab}` : ''}`;

	/* E2EE */
	const { encryptRoom } = useE2EE(groupIdFromParam);
	const {
		visible: e2eeOverlayVisible,
		setState: setE2EEState,
		overlay: e2eeOverlay
	} = useE2EEViewElements();

	const { visible: requestOverlayVisible, overlay: requestOverlay } =
		useTimeoutOverlay(
			isRequestInProgress,
			null,
			translate('session.assignSelf.inProgress')
		);

	const enquirySuccessfullyAcceptedOverlayItem: OverlayItem = useMemo(
		() => ({
			svg: CheckIcon,
			headline: translate('session.acceptance.overlayHeadline'),
			buttonSet: [
				{
					label: translate('session.acceptance.buttonLabel'),
					function: OVERLAY_FUNCTIONS.REDIRECT,
					type: BUTTON_TYPES.PRIMARY
				}
			]
		}),
		[]
	);

	const enquiryTakenByOtherConsultantOverlayItem: OverlayItem = useMemo(
		() => ({
			svg: XIcon,
			headline: translate(
				'session.anonymous.takenByOtherConsultant.overlayHeadline'
			),
			illustrationBackground: 'error',
			buttonSet: [
				{
					label: translate(
						'session.anonymous.takenByOtherConsultant.buttonLabel'
					),
					function: OVERLAY_FUNCTIONS.CLOSE,
					type: BUTTON_TYPES.PRIMARY
				}
			]
		}),
		[]
	);

	useEffect(() => {
		setOverlayItem(
			assigned ? enquiryTakenByOtherConsultantOverlayItem : null
		);
	}, [assigned, enquiryTakenByOtherConsultantOverlayItem]);

	/** END E2EE */

	const updateActiveSession = useCallback(() => {
		if (abortController.current) {
			abortController.current.abort();
		}

		abortController.current = new AbortController();

		return apiGetSessionRoomBySessionId(
			activeSession.item.id,
			abortController.current.signal
		).catch((e) => {
			if (e.message === FETCH_ERRORS.ABORT) {
				return;
			} else if (e.message === FETCH_ERRORS.FORBIDDEN) {
				setOverlayItem(enquiryTakenByOtherConsultantOverlayItem);
			}
		});
	}, [activeSession.item.id, enquiryTakenByOtherConsultantOverlayItem]);

	const [startWatcher, stopWatcher, isWatcherRunning] = useWatcher(
		updateActiveSession,
		3000
	);

	useEffect(() => {
		if (!isWatcherRunning && !overlayItem) {
			startWatcher();
		}

		return () => {
			if (isWatcherRunning) {
				stopWatcher();
			}
			if (abortController.current) {
				abortController.current.abort();
				abortController.current = null;
			}
		};
	}, [isWatcherRunning, overlayItem, startWatcher, stopWatcher]);

	const handleButtonClick = (sessionId: any) => {
		if (isRequestInProgress) {
			return null;
		}
		setIsRequestInProgress(true);

		apiEnquiryAcceptance(sessionId, isAnonymous)
			.then(() => encryptRoom(setE2EEState))
			.then(() => setIsRequestInProgress(false))
			.then(() => setOverlayItem(enquirySuccessfullyAcceptedOverlayItem))
			.catch((error) => {
				setIsRequestInProgress(false);
				if (error.message === FETCH_ERRORS.CONFLICT) {
					setOverlayItem(enquiryTakenByOtherConsultantOverlayItem);
				} else {
					console.log(error);
				}
			});
	};

	const handleOverlayAction = (buttonFunction: string) => {
		switch (buttonFunction) {
			case OVERLAY_FUNCTIONS.REDIRECT:
				setOverlayItem(null);
				if (activeSession.item.id && activeSession.item.groupId) {
					history.push(
						`/sessions/consultant/sessionView/${activeSession.item.groupId}/${activeSession.item.id}`
					);
					return;
				}
				history.push(`/sessions/consultant/sessionView/`);
				break;
			case OVERLAY_FUNCTIONS.CLOSE:
				setOverlayItem(null);
				history.push(
					`/sessions/consultant/sessionPreview${getSessionListTab()}`
				);
				break;
			default:
			// Should never be executed as `handleOverlayAction` is only called
			// with a non-null `overlayItem`
		}
	};

	const buttonItem: ButtonItem = {
		label: translate(btnLabel),
		type: BUTTON_TYPES.PRIMARY
	};

	return (
		<>
			<div className="session__acceptance messageItem">
				{assignable ? (
					<SessionAssign />
				) : (
					<Button
						item={buttonItem}
						buttonHandle={() =>
							handleButtonClick(activeSession.item.id)
						}
					/>
				)}
			</div>

			{e2eeOverlayVisible && (
				<OverlayWrapper>
					<Overlay item={e2eeOverlay} />
				</OverlayWrapper>
			)}

			{requestOverlayVisible && !e2eeOverlayVisible && (
				<OverlayWrapper>
					<Overlay item={requestOverlay} />
				</OverlayWrapper>
			)}

			{overlayItem && !requestOverlayVisible && !e2eeOverlayVisible && (
				<OverlayWrapper>
					<Overlay
						item={overlayItem}
						handleOverlay={handleOverlayAction}
					/>
				</OverlayWrapper>
			)}
		</>
	);
};
