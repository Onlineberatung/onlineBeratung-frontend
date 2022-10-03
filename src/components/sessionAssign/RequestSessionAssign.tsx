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
	SessionTypeContext,
	UserDataContext,
	UserDataInterface
} from '../../globalState';
import { SelectDropdown } from '../select/SelectDropdown';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';
import { useE2EE } from '../../hooks/useE2EE';
import {
	ALIAS_MESSAGE_TYPES,
	apiSendAliasMessage,
	ConsultantReassignment,
	ReassignStatus
} from '../../api/apiSendAliasMessage';
import { history } from '../app/app';
import {
	prepareConsultantDataForSelect,
	prepareSelectDropdown
} from './sessionAssignHelper';

export const ACCEPTED_GROUP_CLOSE = 'CLOSE';

export const RequestSessionAssign = (props: { value?: string }) => {
	const { activeSession } = useContext(ActiveSessionContext);
	const { path: listPath } = useContext(SessionTypeContext);
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

	const initOverlays = (selected, profileData) => {
		if (selected?.value === activeSession?.consultant?.id) return;
		const selectedConsultant = consultantList.filter(
			(consultant) => consultant.value === activeSession?.consultant?.id
		)[0];
		const isTeamSession = activeSession?.item?.isTeamSession;
		const isMyOwnSession = selected?.value === profileData.userId;

		const client = activeSession.user.username;
		const newConsultant = selected.label;
		const toAskerName = client;
		setReassignmentParams({
			toConsultantId: selected.value,
			toConsultantName: selected.consultantDisplayName,
			toAskerName,
			fromConsultantId: selectedConsultant.value,
			fromConsultantName: selectedConsultant.consultantDisplayName,
			status: ReassignStatus.REQUESTED
		});

		let overlayText = translate(
			'session.assignOther.overlay.subtitle.noTeam',
			{
				newConsultant
			}
		);

		if (isTeamSession && isMyOwnSession) {
			overlayText = translate(
				'session.assignOther.overlay.subtitle.team.self',
				{
					newConsultant,
					toAskerName
				}
			);
		}

		if (isTeamSession && !isMyOwnSession) {
			overlayText = translate(
				'session.assignOther.overlay.subtitle.team.other',
				{
					newConsultant,
					toAskerName
				}
			);
		}

		const reassignSession: OverlayItem = {
			headline: translate('session.assignOther.overlay.headline', {
				client,
				newConsultant
			}),
			copy: overlayText,
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
		initOverlays(selectedOption, userData);
	};

	const handleOverlayAction = (buttonFunction: string) => {
		switch (buttonFunction) {
			case OVERLAY_FUNCTIONS.ASSIGN:
				apiSessionAssign(activeSession.item.id, selectedOption.value)
					.then(() => {
						if (userData) {
							initOverlays(selectedOption, userData);
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
				break;
			case OVERLAY_FUNCTIONS.REASSIGN:
				apiSendAliasMessage({
					rcGroupId: activeSession.rid,
					type: ALIAS_MESSAGE_TYPES.REASSIGN_CONSULTANT,
					args: reassignmentParams
				});
				setOverlayItem(null);
				setOverlayActive(false);

				history.push(
					`${listPath}/${activeSession.item.groupId}/${activeSession.item.id}`
				);
				break;
			case OVERLAY_FUNCTIONS.CLOSE:
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
