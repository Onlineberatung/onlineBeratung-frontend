import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, BUTTON_TYPES } from '../button/Button';
import './reassignRequestMessage.styles';
import { ConsultantListContext } from '../../globalState';

export const ReassignRequestMessage: React.FC<{
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

export const ReassignRequestSentMessage: React.FC<{
	toAskerName: string;
	fromConsultantId: string;
	toConsultantId: string;
	isTeamSession: boolean;
	isMySession: boolean;
}> = (props) => {
	const { t: translate } = useTranslation();
	const [toConsultantName, setToConultantName] = useState('');
	const { consultantList } = useContext(ConsultantListContext);

	let descriptionToTranslate =
		'session.reassign.system.message.reassign.sent.description.noTeam';
	if (props.isTeamSession && props.isMySession)
		descriptionToTranslate =
			'session.reassign.system.message.reassign.sent.description.team.self';
	if (props.isTeamSession && !props.isMySession)
		descriptionToTranslate =
			'session.reassign.system.message.reassign.sent.description.team.other';

	if (
		props.toConsultantId &&
		!toConsultantName &&
		consultantList.length > 0
	) {
		const toConsultant = consultantList.find(
			(consultant) => consultant.value === props.toConsultantId
		);
		setToConultantName(toConsultant.label);
	}

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

export const ReassignRequestAcceptedMessage: React.FC<{
	toAskerName: string;
	toConsultantName: string;
	toConsultantId: string;
	isAsker: boolean;
	fromConsultantId: string;
	isMySession: boolean;
}> = (props) => {
	const { t: translate } = useTranslation();
	const [fromConsultantName, setFromConultantName] = useState('');
	const [toConsultantName, setToConultantName] = useState('');
	const { consultantList } = useContext(ConsultantListContext);

	const forWhichConsultant = props.isMySession ? 'self' : 'other';

	if (
		props.fromConsultantId &&
		props.toConsultantId &&
		!fromConsultantName &&
		!toConsultantName &&
		!props.isAsker &&
		consultantList.length > 0
	) {
		const fromConsultant = consultantList.find(
			(consultant) => consultant.value === props.fromConsultantId
		);
		setFromConultantName(fromConsultant.label);
		const toConsultant = consultantList.find(
			(consultant) => consultant.value === props.toConsultantId
		);
		setToConultantName(toConsultant.label);
	}

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

export const ReassignRequestDeclinedMessage: React.FC<{
	isAsker: boolean;
	isMySession: boolean;
	toAskerName: string;
	fromConsultantName: string;
	fromConsultantId: string;
}> = (props) => {
	const { t: translate } = useTranslation();
	const [fromConsultantName, setFromConultantName] = useState('');
	const { consultantList } = useContext(ConsultantListContext);

	const forWhichConsultant = props.isMySession ? 'self' : 'other';

	if (
		props.fromConsultantId &&
		!fromConsultantName &&
		!props.isAsker &&
		consultantList.length > 0
	) {
		const fromConsultant = consultantList.find(
			(consultant) => consultant.value === props.fromConsultantId
		);
		setFromConultantName(fromConsultant.label);
	}

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
