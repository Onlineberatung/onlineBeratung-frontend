import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import {
	OverlayWrapper,
	Overlay,
	OverlayItem,
	OVERLAY_FUNCTIONS
} from '../overlay/Overlay';
import { BUTTON_TYPES } from '../button/Button';
import { translate } from '../../utils/translate';
import { history } from '../app/app';
import {
	apiGetUserData,
	apiGetAgencyConsultantList,
	apiSessionAssign,
	FETCH_ERRORS
} from '../../api';
import {
	UserDataInterface,
	UserDataContext,
	ConsultantListContext,
	AcceptedGroupIdContext
} from '../../globalState';
import {
	SelectDropdownItem,
	SelectDropdown,
	SelectOption
} from '../select/SelectDropdown';
import { getSessionListPathForLocation } from '../session/sessionHelpers';
import { ReactComponent as CheckIcon } from '../../resources/img/illustrations/check.svg';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';

export const ACCEPTED_GROUP_CLOSE = 'CLOSE';
export interface Consultant {
	consultantId: string;
	firstName: string;
	lastName: string;
}

export const SessionAssign = (props: { value?: string }) => {
	const activeSession = useContext(ActiveSessionContext);
	const { userData, setUserData } = useContext(UserDataContext);
	const { setAcceptedGroupId } = useContext(AcceptedGroupIdContext);

	const { consultantList, setConsultantList } = useContext(
		ConsultantListContext
	);
	const [overlayActive, setOverlayActive] = useState(false);
	const [overlayItem, setOverlayItem] = useState({});
	const [sessionListTab] = useState(
		new URLSearchParams(useLocation().search).get('sessionListTab')
	);
	const getSessionListTab = () =>
		`${sessionListTab ? `?sessionListTab=${sessionListTab}` : ''}`;

	useEffect(() => {
		const agencyId = activeSession.session.agencyId.toString();
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

	const initOverlays = (selectedOption, profileData) => {
		const currentUserId = profileData.userId;

		const assignOtherOverlay: OverlayItem = {
			svg: CheckIcon,
			headline: translate('session.assignOther.overlayHeadline'),
			buttonSet: [
				{
					label: translate('session.assignOther.buttonLabel'),
					function: OVERLAY_FUNCTIONS.CLOSE,
					type: BUTTON_TYPES.AUTO_CLOSE
				}
			]
		};

		const assignSelfOverlay: OverlayItem = {
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
		};

		const overlay =
			currentUserId === selectedOption.value
				? assignSelfOverlay
				: assignOtherOverlay;
		setOverlayActive(true);
		setOverlayItem(overlay);
	};

	const handleDatalistSelect = (selectedOption) => {
		apiSessionAssign(activeSession.session.id, selectedOption.value)
			.then(() => {
				if (userData) {
					initOverlays(selectedOption, userData);
				} else {
					apiGetUserData()
						.then((profileData: UserDataInterface) => {
							setUserData(profileData);
							initOverlays(selectedOption, profileData);
						})
						.catch((error) => console.log(error));
				}
			})
			.catch((error) => {
				if (error === FETCH_ERRORS.CONFLICT) {
					return null;
				} else console.log(error);
			});
	};

	const handleOverlayAction = (buttonFunction: string) => {
		setOverlayActive(false);
		if (buttonFunction === OVERLAY_FUNCTIONS.CLOSE) {
			setAcceptedGroupId(ACCEPTED_GROUP_CLOSE);
			history.push(getSessionListPathForLocation() + getSessionListTab());
		} else {
			setAcceptedGroupId(activeSession.session.groupId);
			history.push(
				`/sessions/consultant/sessionView${getSessionListTab()}`
			);
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
			{overlayActive ? (
				<OverlayWrapper>
					<Overlay
						item={overlayItem}
						handleOverlay={handleOverlayAction}
					/>
				</OverlayWrapper>
			) : null}
		</div>
	);
};
