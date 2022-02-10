import React, { useState } from 'react';
import { CheckmarkIcon } from '../../resources/img/icons';
import { translate } from '../../utils/translate';

interface TwoFactorAuthResendMailProps {
	resendHandler: (callback: Function) => void;
}

export const TwoFactorAuthResendMail: React.FC<TwoFactorAuthResendMailProps> =
	({ resendHandler }) => {
		const [isCodeSent, setIsCodeSent] = useState(false);
		return (
			<div>
				<p>{translate('twoFactorAuth.activate.email.resend.hint')}</p>
				{isCodeSent ? (
					<p>
						<CheckmarkIcon />{' '}
						{translate('twoFactorAuth.activate.email.resend.sent')}
					</p>
				) : (
					<p>
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
							{translate(
								'twoFactorAuth.activate.email.resend.new'
							)}
						</button>
					</p>
				)}
			</div>
		);
	};
