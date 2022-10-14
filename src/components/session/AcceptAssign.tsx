import * as React from 'react';
import {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState
} from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { E2EEContext } from '../../globalState';
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
import { createGroupKey } from '../../utils/encryptionHelpers';
import { encryptRoom } from '../../utils/e2eeHelper';
import { apiEnquiryAcceptance, FETCH_ERRORS } from '../../api';
import { Button, BUTTON_TYPES, ButtonItem } from '../button/Button';
import { useWatcher } from '../../hooks/useWatcher';
import { apiGetSessionRoomBySessionId } from '../../api/apiGetSessionRooms';
import { SessionAssign } from '../sessionAssign/SessionAssign';
import { ReactComponent as CheckIcon } from '../../resources/img/illustrations/check.svg';
import { ReactComponent as XIcon } from '../../resources/img/illustrations/x.svg';
import { useTranslation } from 'react-i18next';

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
	const { t: translate } = useTranslation();
	const { rcGroupId: groupIdFromParam } = useParams<{ rcGroupId: string }>();
	const history = useHistory();

	const { activeSession } = useContext(ActiveSessionContext);
	const abortController = useRef<AbortController>(null);

	const [overlayItem, setOverlayItem] = useState<OverlayItem>(null);
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);
	const sessionListTab = useSearchParam<SESSION_LIST_TAB>('sessionListTab');
	const getSessionListTab = () =>
		`${sessionListTab ? `?sessionListTab=${sessionListTab}` : ''}`;

	/* E2EE */
	const { encrypted, keyID, sessionKeyExportedString, ready } =
		useE2EE(groupIdFromParam);
	const { isE2eeEnabled } = useContext(E2EEContext);
	const [groupKeyID, setGroupKeyID] = useState(null);
	const [sessionGroupKeyExportedString, setSessionGroupKeyExportedString] =
		useState(null);

	const enquirySuccessfullyAcceptedOverlayItem: OverlayItem = useMemo(
		() => ({
			svg: CheckIcon,
			headline: translate('session.acceptance.overlay.headline'),
			buttonSet: [
				{
					label: translate('session.acceptance.button.label'),
					function: OVERLAY_FUNCTIONS.REDIRECT,
					type: BUTTON_TYPES.PRIMARY
				}
			]
		}),
		[translate]
	);

	const enquiryTakenByOtherConsultantOverlayItem: OverlayItem = useMemo(
		() => ({
			svg: XIcon,
			headline: translate(
				'session.anonymous.takenByOtherConsultant.overlay.headline'
			),
			illustrationBackground: 'error',
			buttonSet: [
				{
					label: translate(
						'session.anonymous.takenByOtherConsultant.button.label'
					),
					function: OVERLAY_FUNCTIONS.CLOSE,
					type: BUTTON_TYPES.PRIMARY
				}
			]
		}),
		[translate]
	);

	useEffect(() => {
		setOverlayItem(
			assigned ? enquiryTakenByOtherConsultantOverlayItem : null
		);
	}, [assigned, enquiryTakenByOtherConsultantOverlayItem]);

	// group Key generation if needed
	useEffect(() => {
		if (!isE2eeEnabled || !ready) {
			return;
		}
		if (!activeSession) {
			return;
		}

		if (encrypted) {
			setGroupKeyID(keyID);
			setSessionGroupKeyExportedString(sessionKeyExportedString);
		} else {
			createGroupKey().then(
				({ keyID, key, sessionKeyExportedString }) => {
					setGroupKeyID(keyID);
					setSessionGroupKeyExportedString(sessionKeyExportedString);
				}
			);
		}
	}, [
		encrypted,
		activeSession,
		keyID,
		sessionKeyExportedString,
		isE2eeEnabled,
		ready
	]);

	const handleEncryptRoom = useCallback(async () => {
		return encryptRoom({
			keyId: groupKeyID,
			isE2eeEnabled,
			isRoomAlreadyEncrypted: encrypted,
			rcGroupId: groupIdFromParam,
			sessionKeyExportedString: sessionGroupKeyExportedString
		});
	}, [
		encrypted,
		groupIdFromParam,
		groupKeyID,
		sessionGroupKeyExportedString,
		isE2eeEnabled
	]);

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
			.then(async () => {
				await handleEncryptRoom();
				setOverlayItem(enquirySuccessfullyAcceptedOverlayItem);
			})
			.catch((error) => {
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
				setIsRequestInProgress(false);
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

			{overlayItem && (
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
