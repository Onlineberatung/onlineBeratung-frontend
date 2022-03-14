import React, { useState } from 'react';
import { CheckmarkIcon } from '../../resources/img/icons';
import { translate } from '../../utils/translate';
import { Text } from '../text/Text';
import './twoFactorAuthResendMail.styles';

interface TwoFactorAuthResendMailProps {
	resendHandler: (callback: Function) => void;
}

export const TwoFactorAuthResendMail: React.FC<TwoFactorAuthResendMailProps> =
	({ resendHandler }) => {
		const [isCodeSent, setIsCodeSent] = useState(false);
		return (
			<div className="twoFactorAuthResendMail">
				<Text
					className="bold"
					text={translate(
						'twoFactorAuth.activate.email.resend.headline'
					)}
					type="infoLargeStandard"
				/>
				{isCodeSent ? (
					<p className="text text__infoLargeStandard">
						<CheckmarkIcon />{' '}
						{translate('twoFactorAuth.activate.email.resend.sent')}
					</p>
				) : (
					<button
						onClick={() => {
							resendHandler(() => {
								setIsCodeSent(true);
								window.setTimeout(() => {
									setIsCodeSent(false);
								}, 2000);
							});
						}}
					>
						{translate('twoFactorAuth.activate.email.resend.new')}
					</button>
				)}
			</div>
		);
	};
