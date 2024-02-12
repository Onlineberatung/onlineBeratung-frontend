import * as React from 'react';
import { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { Overlay, OverlayItem, OVERLAY_FUNCTIONS } from '../overlay/Overlay';
import { BUTTON_TYPES } from '../button/Button';
import {
	apiGetAgencyConsultantList,
	apiSessionAssign,
	FETCH_ERRORS,
	apiDeleteUserFromRoom
} from '../../api';
import {
	UserDataContext,
	ConsultantListContext,
	E2EEContext,
	SessionTypeContext,
	ActiveSessionContext
} from '../../globalState';
import { SelectDropdown } from '../select/SelectDropdown';
import { ReactComponent as CheckIcon } from '../../resources/img/illustrations/check.svg';
import { useE2EE } from '../../hooks/useE2EE';
import { useSearchParam } from '../../hooks/useSearchParams';
import { SESSION_LIST_TAB } from '../session/sessionHelpers';
import {
	prepareConsultantDataForSelect,
	prepareSelectDropdown
} from './sessionAssignHelper';
import { useTranslation } from 'react-i18next';
import { useE2EEViewElements } from '../../hooks/useE2EEViewElements';
import { useTimeoutOverlay } from '../../hooks/useTimeoutOverlay';
import {
	OVERLAY_E2EE,
	OVERLAY_REQUEST
} from '../../globalState/interfaces/AppConfig/OverlaysConfigInterface';

export interface Consultant {
	consultantId: string;
	firstName: string;
	lastName: string;
}

export const SessionAssign = (props: { value?: string }) => {
	const { t: translate } = useTranslation();
	const history = useHistory();

	const { activeSession } = useContext(ActiveSessionContext);
	const { userData } = useContext(UserDataContext);
	const { path: listPath } = useContext(SessionTypeContext);
	const { consultantList, setConsultantList } = useContext(
		ConsultantListContext
	);
	const [overlayActive, setOverlayActive] = useState(false);
	const [overlayItem, setOverlayItem] = useState({});
	const [selectedOption, setSelectedOption] = useState();
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);

	const { isE2eeEnabled } = useContext(E2EEContext);

	const { addNewUsersToEncryptedRoom, encryptRoom } = useE2EE(
		activeSession.item.groupId
	);

	const {
		visible: e2eeOverlayVisible,
		setState: setE2EEState,
		overlay: e2eeOverlay
	} = useE2EEViewElements();

	const { visible: requestOverlayVisible, overlay: requestOverlay } =
		useTimeoutOverlay(
			isRequestInProgress,
			null,
			userData.userId === selectedOption
				? translate('session.assignSelf.inProgress')
				: translate('session.assignOther.inProgress'),
			null,
			0
		);

	const sessionListTab = useSearchParam<SESSION_LIST_TAB>('sessionListTab');
	const getSessionListTab = () =>
		`${sessionListTab ? `?sessionListTab=${sessionListTab}` : ''}`;

	const assignOtherOverlay: OverlayItem = useMemo(
		() => ({
			svg: CheckIcon,
			headline: translate('session.assignOther.overlay.headline.2'),
			buttonSet: [
				{
					label: translate('session.assignOther.button.label'),
					function: OVERLAY_FUNCTIONS.CLOSE,
					functionArgs: {
						gotoOverview: true
					},
					type: BUTTON_TYPES.AUTO_CLOSE
				}
			]
		}),
		[translate]
	);

	const assignSelfOverlay: OverlayItem = useMemo(
		() => ({
			svg: CheckIcon,
			headline: translate('session.assignSelf.overlay.headline1'),
			buttonSet: [
				{
					label: translate('session.assignSelf.button1.label'),
					function: OVERLAY_FUNCTIONS.REDIRECT,
					type: BUTTON_TYPES.PRIMARY
				},
				{
					label: translate('session.assignSelf.button2.label'),
					function: OVERLAY_FUNCTIONS.CLOSE,
					type: BUTTON_TYPES.SECONDARY
				}
			]
		}),
		[translate]
	);

	const assignSession: OverlayItem = useMemo(
		() => ({
			headline: translate('session.assignSelf.overlay.headline2'),
			copy: translate('session.assignSelf.overlay.subtitle'),
			buttonSet: [
				{
					label: translate(
						'session.assignSelf.overlay.button.cancel'
					),
					function: OVERLAY_FUNCTIONS.CLOSE,
					type: BUTTON_TYPES.SECONDARY
				},
				{
					label: translate(
						'session.assignSelf.overlay.button.assign'
					),
					function: 'ASSIGN',
					type: BUTTON_TYPES.PRIMARY
				}
			]
		}),
		[translate]
	);

	const alreadyAssignedSession: OverlayItem = useMemo(
		() => ({
			headline: translate('session.alreadyAssigned.overlay.headline'),
			buttonSet: [
				{
					label: translate(
						'session.alreadyAssigned.overlay.button.cancel'
					),
					function: OVERLAY_FUNCTIONS.CLOSE,
					type: BUTTON_TYPES.SECONDARY
				},
				{
					label: translate(
						'session.alreadyAssigned.overlay.button.redirect'
					),
					function: OVERLAY_FUNCTIONS.REDIRECT,
					type: BUTTON_TYPES.PRIMARY
				}
			]
		}),
		[translate]
	);

	useEffect(() => {
		const agencyId = activeSession.item.agencyId.toString();
		if (consultantList && consultantList.length <= 0) {
			apiGetAgencyConsultantList(agencyId)
				.then((response) => {
					const consultants =
						prepareConsultantDataForSelect(response);
					setConsultantList(consultants);
				})
				.catch((error) => {
					console.log(error);
				});
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const initOverlays = useCallback(() => {
		const overlay =
			userData.userId === selectedOption
				? assignSelfOverlay
				: assignOtherOverlay;
		setOverlayActive(true);
		setOverlayItem(overlay);
	}, [
		assignOtherOverlay,
		assignSelfOverlay,
		selectedOption,
		userData.userId
	]);

	const handleE2EEAssign = async (sessionId, userId) => {
		if (isE2eeEnabled) {
			try {
				// If already encrypted this will be skipped
				await encryptRoom(setE2EEState);
				// If room was already encrypted add new users
				await addNewUsersToEncryptedRoom();
				await apiDeleteUserFromRoom(sessionId, userId);
			} catch (e) {
				console.log('error encrypting new user key');
			}
		}
	};

	const handleDatalistSelect = (selectedOption) => {
		if (
			userData.userId === activeSession?.consultant?.id &&
			userData.userId === selectedOption.value
		) {
			setOverlayItem(alreadyAssignedSession);
		} else {
			setOverlayItem(assignSession);
		}
		setOverlayActive(true);
		setSelectedOption(selectedOption.value);
	};

	const handleOverlayAction = (
		buttonFunction: string,
		buttonArgs: { [key: string]: any }
	) => {
		switch (buttonFunction) {
			case 'ASSIGN':
				setIsRequestInProgress(true);
				apiSessionAssign(activeSession.item.id, selectedOption)
					.then(() =>
						handleE2EEAssign(activeSession.item.id, userData.userId)
					)
					.then(() => initOverlays())
					.catch((error) => {
						if (error === FETCH_ERRORS.CONFLICT) {
							return null;
						} else console.log(error);
					})
					.finally(() => setIsRequestInProgress(false));
				break;
			case OVERLAY_FUNCTIONS.REDIRECT:
				setOverlayItem(null);
				setOverlayActive(false);
				history.push(
					`/sessions/consultant/sessionView/${activeSession.item.groupId}/${activeSession.item.id}`
				);
				break;
			case OVERLAY_FUNCTIONS.CLOSE:
				if (buttonArgs?.gotoOverview) {
					history.push(listPath + getSessionListTab());
				}
				setOverlayItem(null);
				setOverlayActive(false);
				break;
		}
	};

	return (
		<div className="assign__wrapper">
			<SelectDropdown
				{...prepareSelectDropdown({
					consultantList,
					handleDatalistSelect,
					value: props.value
				})}
			/>
			{requestOverlayVisible && (
				<Overlay item={requestOverlay} name={OVERLAY_REQUEST} />
			)}
			{e2eeOverlayVisible && (
				<Overlay item={e2eeOverlay} name={OVERLAY_E2EE} />
			)}
			{overlayActive && (
				<Overlay
					item={overlayItem}
					handleOverlay={handleOverlayAction}
				/>
			)}
		</div>
	);
};
