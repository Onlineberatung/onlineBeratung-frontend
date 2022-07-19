import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import {
	Overlay,
	OVERLAY_FUNCTIONS,
	OverlayItem,
	OverlayWrapper
} from '../overlay/Overlay';
import { BUTTON_TYPES } from '../button/Button';
import { translate } from '../../utils/translate';
import {
	apiDeleteUserFromRoom,
	apiGetAgencyConsultantList,
	apiGetUserData,
	apiSessionAssign,
	FETCH_ERRORS
} from '../../api';
import {
	ConsultantListContext,
	E2EEContext,
	UserDataContext,
	UserDataInterface
} from '../../globalState';
import {
	SelectDropdown,
	SelectDropdownItem,
	SelectOption
} from '../select/SelectDropdown';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';
import { useE2EE } from '../../hooks/useE2EE';
import {
	ALIAS_MESSAGE_TYPES,
	apiSendAliasMessage,
	ConsultantReassignment,
	ReassignStatus
} from '../../api/apiSendAliasMessage';

export const ACCEPTED_GROUP_CLOSE = 'CLOSE';

export interface Consultant {
	consultantId: string;
	firstName: string;
	lastName: string;
}

export const RequestSessionAssign = (props: { value?: string }) => {
	const { activeSession } = useContext(ActiveSessionContext);
	const { userData, setUserData } = useContext(UserDataContext);
	const { consultantList, setConsultantList } = useContext(
		ConsultantListContext
	);
	const [overlayActive, setOverlayActive] = useState(false);
	const [overlayItem, setOverlayItem] = useState({});
	const [selectedOption, setSelectedOption] = useState(null);
	const [reassignmentParams, setReassignmentParams] =
		useState<ConsultantReassignment | null>(null);

	const { isE2eeEnabled } = useContext(E2EEContext);

	const { addNewUsersToEncryptedRoom } = useE2EE(activeSession.item.groupId);

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
				label: item.firstName + ` ` + item.lastName, // TODO ALEX: use displayName if available, else use userName
				iconLabel: item.firstName.charAt(0) + item.lastName.charAt(0)
			};
			availableConsultants.push(consultant);
		});
		return availableConsultants;
	};

	const initOverlays = (profileData, selected) => {
		apiGetUserData()
			.then((profileData: UserDataInterface) => {
				console.log('XXX', profileData);
			})
			.catch((error) => console.log(error));

		const currentUserId = profileData.userId;
		if (selected?.value === currentUserId) return;

		const client = activeSession.user.username;
		const newConsultant = selected.label;
		setReassignmentParams({
			toConsultantId: selected.value,
			toConsultantName: selected.label,
			toAskerName: client,
			fromConsultantName: profileData.displayName || profileData.userName,
			status: ReassignStatus.REQUESTED
		});

		console.log('selected', selected);
		console.log('init', client, newConsultant);

		const reassignSession: OverlayItem = {
			headline: translate('session.assignOther.overlay.headline', {
				client,
				newConsultant
			}),
			copy: translate('session.assignOther.overlay.subtitle', {
				newConsultant
			}),
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
					function: OVERLAY_FUNCTIONS.REASSIGN,
					type: BUTTON_TYPES.PRIMARY
				}
			]
		};

		const overlay = reassignSession;
		setOverlayActive(true);
		setOverlayItem(overlay);
	};

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
		setSelectedOption(selectedOption);
		initOverlays(userData, selectedOption);
	};

	const handleOverlayAction = (buttonFunction: string) => {
		switch (buttonFunction) {
			case OVERLAY_FUNCTIONS.ASSIGN:
				apiSessionAssign(activeSession.item.id, selectedOption.value)
					.then(() => {
						if (userData) {
							initOverlays(userData, selectedOption);
							handleE2EEAssign(
								activeSession.item.id,
								userData.userId
							);
						} else {
							apiGetUserData()
								.then((profileData: UserDataInterface) => {
									handleE2EEAssign(
										activeSession.item.id,
										profileData.userId
									);
									setUserData(profileData);
									initOverlays(profileData, selectedOption);
								})
								.catch((error) => console.log(error));
						}
					})
					.catch((error) => {
						if (error === FETCH_ERRORS.CONFLICT) {
							return null;
						} else console.log(error);
					});
				break;
			case OVERLAY_FUNCTIONS.REASSIGN:
				console.log('call reassign');
				apiSendAliasMessage({
					rcGroupId: activeSession.rid,
					type: ALIAS_MESSAGE_TYPES.REASSIGN_CONSULTANT,
					args: reassignmentParams
				});
				setOverlayItem(null);
				setOverlayActive(false);
				// TODO ALEX: back to session view
				break;
			case OVERLAY_FUNCTIONS.CLOSE:
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
