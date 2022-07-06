import React, { useEffect, useState } from 'react';
import { translate } from '../../utils/translate';

import './reassignRequestMessage.styles';
import { Button, BUTTON_TYPES } from '../button/Button';

export const ReassignRequestMessage: React.FC<{
	oldConsultantName: string;
	newConsultantName: string;
	onClick: (accepted: boolean) => void;
}> = (props) => {
	// const [];
	// const init = (async () => {
	// 	return await props.newConsultantName;
	// })();
	// const [newConsultantNameG, setNewConsultantNameG] = useState()
	// const getName = async () => {
	// 	if(typeof newConsultantNameG === "string"){
	// 		setNewConsultantNameG(newConsultantNameG)
	// 		return
	// 	}else{
	// 	const name = await props.newConsultantName?.()
	// 	}
	//
	// }
	// useEffect(() => {
	// 	getName()
	// }, [newConsultantNameG])

	return (
		<div className="reassignRequestMessage">
			<div className="wrapper">
				<h5>
					{translate(
						'session.reassign.system.message.reassign.title',
						{
							oldConsultant: props.oldConsultantName,
							newConsultant: props.newConsultantName
						}
					)}
				</h5>

				<span className="description">
					{translate(
						'session.reassign.system.message.reassign.description',
						{
							oldConsultant: props.oldConsultantName,
							newConsultant: props.newConsultantName
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
	clientName: string;
	oldConsultantName: string;
	newConsultantName: string;
}> = (props) => {
	return (
		<div className="reassignRequestMessage">
			<div className="wrapper">
				<h5>
					{translate(
						'session.reassign.system.message.reassign.sent.title',
						{
							newConsultant: props.newConsultantName,
							oldConsultant: props.oldConsultantName
						}
					)}
				</h5>
				<span className="description">
					{translate(
						'session.reassign.system.message.reassign.sent.description',
						{
							client1: props.clientName,
							client2: props.clientName,
							newConsultant: props.newConsultantName
						}
					)}
				</span>
			</div>
		</div>
	);
};

export const ReassignRequestAcceptedMessage: React.FC<{
	clientName: string;
	newConsultantName: string;
	isAsker: boolean;
}> = (props) => {
	return (
		<div className="reassignRequestMessage">
			<div className="wrapper">
				{props.isAsker ? (
					<>
						<h5>
							{translate(
								'session.reassign.system.message.reassign.accepted.consultant.title',
								{
									newConsultant: props.newConsultantName
								}
							)}
						</h5>
						<span className="description">
							{translate(
								'session.reassign.system.message.reassign.accepted.new.consultant.description',
								{
									newConsultant1: props.newConsultantName,
									newConsultant2: props.newConsultantName
								}
							)}
						</span>
					</>
				) : (
					<>
						<h5>
							{translate(
								'session.reassign.system.message.reassign.accepted.title',
								{
									client: props.clientName
								}
							)}
						</h5>
						<span className="description">
							{translate(
								'session.reassign.system.message.reassign.accepted.description',
								{
									client: props.clientName,
									newConsultant: props.newConsultantName
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
	clientName: string;
	oldConsultantName: string;
}> = (props) => {
	return (
		<div className="reassignRequestMessage">
			<div className="wrapper">
				{props.isAsker ? (
					<>
						<h5>
							{translate(
								'session.reassign.system.message.reassign.declined.old.consultant.title',
								{
									oldConsultant: props.oldConsultantName
								}
							)}
						</h5>
					</>
				) : (
					<>
						<h5>
							{translate(
								'session.reassign.system.message.reassign.declined.title',
								{
									client: props.clientName
								}
							)}
						</h5>
						<span className="description">
							{translate(
								'session.reassign.system.message.reassign.declined.description',
								{
									client: props.clientName
								}
							)}
						</span>
					</>
				)}
			</div>
		</div>
	);
};
