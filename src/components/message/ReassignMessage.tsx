import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, BUTTON_TYPES } from '../button/Button';
import './reassignRequestMessage.styles';
import {
	AUTHORITIES,
	ConsultantListContext,
	hasUserAuthority,
	UserDataContext
} from '../../globalState';
import {
	ALIAS_MESSAGE_TYPES,
	apiSendAliasMessage,
	ConsultantReassignment,
	ReassignStatus
} from '../../api/apiSendAliasMessage';
import { apiSessionAssign } from '../../api';
import { apiPatchMessage } from '../../api/apiPatchMessage';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';

export const ReassignMessage = ({ id, message }) => {
	const { activeSession, reloadActiveSession } =
		useContext(ActiveSessionContext);
	const { userData } = useContext(UserDataContext);

	const clickReassignRequestMessage = (accepted, toConsultantId) => {
		if (accepted) {
			apiSessionAssign(activeSession.item.id, toConsultantId)
				.then(() => {
					apiPatchMessage(
						toConsultantId,
						ReassignStatus.CONFIRMED,
						id
					)
						.then(() => {
							// WORKAROUND for an issue with reassignment and old users breaking the lastMessage for this session
							apiSendAliasMessage({
								rcGroupId: activeSession.rid,
								type: ALIAS_MESSAGE_TYPES.REASSIGN_CONSULTANT_RESET_LAST_MESSAGE
							});
							reloadActiveSession();
						})
						.catch((error) => console.log(error));
				})
				.catch((error) => console.log(error));
		} else {
			apiPatchMessage(toConsultantId, ReassignStatus.REJECTED, id).catch(
				(error) => console.log(error)
			);
		}
	};

	const isTeamSession = activeSession?.item?.isTeamSession;
	const isMySession = activeSession?.consultant?.id === userData?.userId;
	const isAsker = hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData);

	const reassignmentParams: ConsultantReassignment = JSON.parse(message);
	switch (reassignmentParams.status) {
		case ReassignStatus.REQUESTED:
			return isAsker ? (
				<ReassignRequestMessage
					{...reassignmentParams}
					isTeamSession={isTeamSession}
					onClick={(accepted) =>
						clickReassignRequestMessage(
							accepted,
							reassignmentParams.toConsultantId
						)
					}
				/>
			) : (
				<ReassignRequestSentMessage
					{...reassignmentParams}
					isTeamSession={isTeamSession}
					isMySession={isMySession}
				/>
			);
		case ReassignStatus.CONFIRMED:
			return (
				<ReassignRequestAcceptedMessage
					isAsker={isAsker}
					isMySession={isMySession}
					{...reassignmentParams}
				/>
			);
		case ReassignStatus.REJECTED:
			return (
				<ReassignRequestDeclinedMessage
					isAsker={isAsker}
					isMySession={isMySession}
					{...reassignmentParams}
				/>
			);
	}
};

const ReassignRequestMessage: React.FC<{
	fromConsultantName: string;
	toConsultantName: string;
	isTeamSession: boolean;
	onClick: (accepted: boolean) => void;
}> = (props) => {
	const { t: translate } = useTranslation();

	return (
		<div className="reassignRequestMessage">
			<div className="wrapper">
				<h5>
					{translate(
						'session.reassign.system.message.reassign.title',
						{
							oldConsultant: props.fromConsultantName,
							newConsultant: props.toConsultantName
						}
					)}
				</h5>

				<span className="description">
					{translate(
						`session.reassign.system.message.reassign.description.${
							props.isTeamSession ? 'team' : 'noTeam'
						}`,
						{
							oldConsultant: props.fromConsultantName,
							newConsultant: props.toConsultantName
						}
					)}
				</span>
				<span className="description">
					{translate(
						'session.reassign.system.message.reassign.question'
					)}
				</span>
				<div className="buttons">
					<Button
						item={{
							label: translate(
								'session.reassign.system.message.reassign.accept'
							),
							type: BUTTON_TYPES.PRIMARY
						}}
						buttonHandle={() => props.onClick(true)}
					/>
					<Button
						item={{
							label: translate(
								'session.reassign.system.message.reassign.decline'
							),
							type: BUTTON_TYPES.SECONDARY
						}}
						buttonHandle={() => props.onClick(false)}
					/>
				</div>
			</div>
		</div>
	);
};

const ReassignRequestSentMessage: React.FC<{
	toAskerName: string;
	fromConsultantId: string;
	toConsultantId: string;
	isTeamSession: boolean;
	isMySession: boolean;
}> = (props) => {
	const { t: translate } = useTranslation();
	const { consultantList } = useContext(ConsultantListContext);

	const toConsultantName = useMemo(() => {
		if (props.toConsultantId && consultantList.length > 0) {
			const toConsultant = consultantList.find(
				(consultant) => consultant.value === props.toConsultantId
			);
			if (toConsultant) {
				return toConsultant.label;
			}
		}

		return '';
	}, [consultantList, props.toConsultantId]);

	let descriptionToTranslate =
		'session.reassign.system.message.reassign.sent.description.noTeam';
	if (props.isTeamSession && props.isMySession)
		descriptionToTranslate =
			'session.reassign.system.message.reassign.sent.description.team.self';
	if (props.isTeamSession && !props.isMySession)
		descriptionToTranslate =
			'session.reassign.system.message.reassign.sent.description.team.other';

	return (
		<div className="reassignRequestMessage">
			<div className="wrapper">
				<h5>
					{translate(
						'session.reassign.system.message.reassign.sent.title'
					)}
				</h5>
				<span className="description">
					{translate(descriptionToTranslate, {
						client1: props.toAskerName,
						client2: props.toAskerName,
						newConsultant: toConsultantName
					})}
				</span>
			</div>
		</div>
	);
};

const ReassignRequestAcceptedMessage: React.FC<{
	toAskerName: string;
	toConsultantName: string;
	toConsultantId: string;
	isAsker: boolean;
	fromConsultantId: string;
	isMySession: boolean;
}> = (props) => {
	const { t: translate } = useTranslation();
	const { consultantList } = useContext(ConsultantListContext);
	const fromConsultantName = useMemo(() => {
		if (
			props.fromConsultantId &&
			!props.isAsker &&
			consultantList.length > 0
		) {
			const fromConsultant = consultantList.find(
				(consultant) => consultant.value === props.fromConsultantId
			);
			if (fromConsultant) {
				return fromConsultant.label;
			}
		}

		return '';
	}, [consultantList, props.fromConsultantId, props.isAsker]);

	const toConsultantName = useMemo(() => {
		if (
			props.toConsultantId &&
			!props.isAsker &&
			consultantList.length > 0
		) {
			const toConsultant = consultantList.find(
				(consultant) => consultant.value === props.toConsultantId
			);
			if (toConsultant) {
				return toConsultant.label;
			}
		}

		return '';
	}, [consultantList, props.isAsker, props.toConsultantId]);

	const forWhichConsultant = props.isMySession ? 'self' : 'other';

	return (
		<div className="reassignRequestMessage">
			<div className="wrapper">
				{props.isAsker ? (
					<>
						<h5>
							{translate(
								'session.reassign.system.message.reassign.accepted.consultant.title',
								{
									newConsultant: props.toConsultantName
								}
							)}
						</h5>
						<span className="description">
							{translate(
								'session.reassign.system.message.reassign.accepted.new.consultant.description',
								{
									newConsultant1: props.toConsultantName,
									newConsultant2: props.toConsultantName
								}
							)}
						</span>
					</>
				) : (
					<>
						<h5>
							{translate(
								`session.reassign.system.message.reassign.accepted.title.${forWhichConsultant}`,
								{
									oldConsultant: fromConsultantName,
									newConsultant: toConsultantName,
									client: props.toAskerName
								}
							)}
						</h5>
						<span className="description">
							{translate(
								`session.reassign.system.message.reassign.accepted.description.${forWhichConsultant}`,
								{
									client: props.toAskerName,
									consultant: toConsultantName
								}
							)}
						</span>
					</>
				)}
			</div>
		</div>
	);
};

const ReassignRequestDeclinedMessage: React.FC<{
	isAsker: boolean;
	isMySession: boolean;
	toAskerName: string;
	fromConsultantName: string;
	fromConsultantId: string;
}> = (props) => {
	const { t: translate } = useTranslation();
	const { consultantList } = useContext(ConsultantListContext);
	const fromConsultantName = useMemo(() => {
		if (
			props.fromConsultantId &&
			!props.isAsker &&
			consultantList.length > 0
		) {
			const fromConsultant = consultantList.find(
				(consultant) => consultant.value === props.fromConsultantId
			);
			if (fromConsultant) {
				return fromConsultant.label;
			}
		}

		return '';
	}, [consultantList, props.fromConsultantId, props.isAsker]);

	const forWhichConsultant = props.isMySession ? 'self' : 'other';

	return (
		<div className="reassignRequestMessage">
			<div className="wrapper">
				{props.isAsker ? (
					<h5>
						{translate(
							'session.reassign.system.message.reassign.declined.old.consultant.title',
							{
								oldConsultant: props.fromConsultantName
							}
						)}
					</h5>
				) : (
					<>
						<h5>
							{translate(
								'session.reassign.system.message.reassign.declined.title',
								{
									client: props.toAskerName
								}
							)}
						</h5>
						<span className="description">
							{translate(
								`session.reassign.system.message.reassign.declined.description.${forWhichConsultant}`,
								{
									client: props.toAskerName,
									consultant: fromConsultantName
								}
							)}
						</span>
					</>
				)}
			</div>
		</div>
	);
};
