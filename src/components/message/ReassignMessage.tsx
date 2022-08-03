import React from 'react';
import { translate } from '../../utils/translate';

import './reassignRequestMessage.styles';
import { Button, BUTTON_TYPES } from '../button/Button';

export const ReassignRequestMessage: React.FC<{
	fromConsultantName: string;
	toConsultantName: string;
	isTeamSession: boolean;
	onClick: (accepted: boolean) => void;
}> = (props) => {
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
	fromConsultantName: string;
	toConsultantName: string;
	isTeamSession: boolean;
	isMySession: boolean;
}> = (props) => {
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
						'session.reassign.system.message.reassign.sent.title',
						{
							newConsultant: props.toConsultantName,
							oldConsultant: props.fromConsultantName
						}
					)}
				</h5>
				<span className="description">
					{translate(descriptionToTranslate, {
						client1: props.toAskerName,
						client2: props.toAskerName,
						newConsultant: props.toConsultantName
					})}
				</span>
			</div>
		</div>
	);
};

export const ReassignRequestAcceptedMessage: React.FC<{
	toAskerName: string;
	toConsultantName: string;
	isAsker: boolean;
	fromConsultantName: string;
	isMySession: boolean;
}> = (props) => {
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
									oldConsultant: props.fromConsultantName,
									newConsultant: props.toConsultantName,
									client: props.toAskerName
								}
							)}
						</h5>
						<span className="description">
							{translate(
								`session.reassign.system.message.reassign.accepted.description.${forWhichConsultant}`,
								{
									client: props.toAskerName,
									consultant: props.toConsultantName
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
}> = (props) => {
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
									consultant: props.fromConsultantName
								}
							)}
						</span>
					</>
				)}
			</div>
		</div>
	);
};
