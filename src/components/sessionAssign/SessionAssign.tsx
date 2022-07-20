import * as React from 'react';
import { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import {
	OverlayWrapper,
	Overlay,
	OverlayItem,
	OVERLAY_FUNCTIONS
} from '../overlay/Overlay';
import { BUTTON_TYPES } from '../button/Button';
import { translate } from '../../utils/translate';
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
	SessionTypeContext
} from '../../globalState';
import {
	SelectDropdownItem,
	SelectDropdown,
	SelectOption
} from '../select/SelectDropdown';
import { ReactComponent as CheckIcon } from '../../resources/img/illustrations/check.svg';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';
import { useE2EE } from '../../hooks/useE2EE';
import { history } from '../app/app';
import { useSearchParam } from '../../hooks/useSearchParams';
import { SESSION_LIST_TAB } from '../session/sessionHelpers';

export interface Consultant {
	consultantId: string;
	firstName: string;
	lastName: string;
}

export const SessionAssign = (props: { value?: string }) => {
	const { activeSession } = useContext(ActiveSessionContext);
	const { userData } = useContext(UserDataContext);
	const { path: listPath } = useContext(SessionTypeContext);
	const { consultantList, setConsultantList } = useContext(
		ConsultantListContext
	);
	const [overlayActive, setOverlayActive] = useState(false);
	const [overlayItem, setOverlayItem] = useState({});
	const [selectedOption, setSelectedOption] = useState();

	const { isE2eeEnabled } = useContext(E2EEContext);

	const { addNewUsersToEncryptedRoom } = useE2EE(activeSession.item.groupId);

	const sessionListTab = useSearchParam<SESSION_LIST_TAB>('sessionListTab');
	const getSessionListTab = () =>
		`${sessionListTab ? `?sessionListTab=${sessionListTab}` : ''}`;

	const assignOtherOverlay: OverlayItem = useMemo(
		() => ({
			svg: CheckIcon,
			headline: translate('session.assignOther.overlayHeadline'),
			buttonSet: [
				{
					label: translate('session.assignOther.buttonLabel'),
					function: OVERLAY_FUNCTIONS.CLOSE,
					functionArgs: {
						gotoOverview: true
					},
					type: BUTTON_TYPES.AUTO_CLOSE
				}
			]
		}),
		[]
	);

	const assignSelfOverlay: OverlayItem = useMemo(
		() => ({
			svg: CheckIcon,
			headline: translate('session.assignSelf.overlayHeadline'),
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
		[]
	);

	const assignSession: OverlayItem = useMemo(
		() => ({
			headline: translate('session.assignSelf.overlay.headline'),
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
		[]
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
		[]
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

	const prepareConsultantDataForSelect = (consultants: Consultant[]) => {
		let availableConsultants = [];
		consultants.forEach((item) => {
			const consultant: SelectOption = {
				value: item.consultantId,
				label: item.firstName + ` ` + item.lastName,
				iconLabel: item.firstName.charAt(0) + item.lastName.charAt(0)
			};
			availableConsultants.push(consultant);
		});
		return availableConsultants;
	};

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
				apiSessionAssign(activeSession.item.id, selectedOption)
					.then(() => {
						handleE2EEAssign(
							activeSession.item.id,
							userData.userId
						).then(() => {
							initOverlays();
						});
					})
					.catch((error) => {
						if (error === FETCH_ERRORS.CONFLICT) {
							return null;
						} else console.log(error);
					});
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

	const prepareSelectDropdown = () => {
		const selectDropdown: SelectDropdownItem = {
			id: 'assignSelect',
			selectedOptions: consultantList,
			handleDropdownSelect: handleDatalistSelect,
			selectInputLabel: translate('session.u25.assignment.placeholder'),
			useIconOption: true,
			isSearchable: true,
			menuPlacement: 'top'
		};
		if (props.value) {
			selectDropdown['defaultValue'] = consultantList.filter(
				(option) => option.value === props.value
			)[0];
		}
		return selectDropdown;
	};

	return (
		<div className="assign__wrapper">
			<SelectDropdown {...prepareSelectDropdown()} />
			{overlayActive && (
				<OverlayWrapper>
					<Overlay
						item={overlayItem}
						handleOverlay={handleOverlayAction}
					/>
				</OverlayWrapper>
			)}
		</div>
	);
};
