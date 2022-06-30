import React from 'react';
import { translate } from '../../utils/translate';

import './redirectRequestMessage.styles';
import { Button, BUTTON_TYPES } from '../button/Button';
import { OVERLAY_FUNCTIONS } from '../overlay/Overlay';

interface RedirectRequestMessageProps {
	oldConsultantName: string;
	newConsultantName: string;
	onClick: (accepted: boolean) => void;
}

export const RedirectRequestMessage: React.FC<RedirectRequestMessageProps> = (
	props
) => {
	const handleButtonClick = () => {
		console.log('click');
	};

	return (
		<div className="redirectRequestMessage">
			<div className="wrapper">
				<h5>
					{props.oldConsultantName +
						translate(
							'session.redirect.system.message.redirect.title_first'
						) +
						props.newConsultantName +
						translate(
							'session.redirect.system.message.redirect.title_second'
						)}
				</h5>

				<span className="description">
					{props.newConsultantName +
						translate(
							'session.redirect.system.message.redirect.description_first'
						)}
					{props.oldConsultantName +
						translate(
							'session.redirect.system.message.redirect.description_second'
						)}
				</span>
				<span className="description">
					{translate(
						'session.redirect.system.message.redirect.question'
					)}
				</span>
				<div className="buttons">
					<Button
						item={{
							label: translate(
								'session.redirect.system.message.redirect.accept'
							),
							type: BUTTON_TYPES.PRIMARY
						}}
						buttonHandle={handleButtonClick}
					/>
					<Button
						item={{
							label: translate(
								'session.redirect.system.message.redirect.decline'
							),
							type: BUTTON_TYPES.SECONDARY
						}}
						buttonHandle={handleButtonClick}
					/>
				</div>
			</div>
		</div>
	);
};
