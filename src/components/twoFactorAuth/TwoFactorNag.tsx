import React, { useContext, useEffect, useState } from 'react';
import { UserDataContext } from '../../globalState';
import { translate } from '../../utils/translate';
import { BUTTON_TYPES } from '../button/Button';
import { Overlay, OverlayWrapper, OVERLAY_FUNCTIONS } from '../overlay/Overlay';
import { history } from '../app/app';
import './twoFactorNag.styles';
import { config } from '../../resources/scripts/config';

interface TwoFactorNagProps {}

export const TwoFactorNag: React.FC<TwoFactorNagProps> = () => {
	const { userData } = useContext(UserDataContext);
	const [isShownTwoFactorNag, setIsShownTwoFactorNag] = useState(false);
	const [forceHideTwoFactorNag, setForceHideTwoFactorNag] = useState(false);
	const [message, setMessage] = useState({
		title: 'twoFactorAuth.nag.obligatory.moment.title',
		copy: 'twoFactorAuth.nag.obligatory.moment.copy',
		showClose: true
	});

	useEffect(() => {
		if (
			userData.twoFactorAuth?.isEnabled &&
			!userData.twoFactorAuth?.isActive &&
			!forceHideTwoFactorNag
		) {
			setIsShownTwoFactorNag(true);

			let todaysDate = new Date(Date.now()).toLocaleDateString('de-DE');

			todaysDate >= config.twofactor.dateTwoFactorObligatory
				? setMessage(config.twofactor.messages[1])
				: setMessage(config.twofactor.messages[0]);
		}
	}, [userData, forceHideTwoFactorNag]);

	const closeTwoFactorNag = async () => {
		setForceHideTwoFactorNag(true);
		setIsShownTwoFactorNag(false);
	};

	const handleOverlayAction = (buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECT) {
			history.push({
				pathname: '/profile/sicherheit/2fa',
				openTwoFactor: true
			});
			setForceHideTwoFactorNag(true);
			setIsShownTwoFactorNag(false);
		}
		if (buttonFunction === OVERLAY_FUNCTIONS.CLOSE) {
			setForceHideTwoFactorNag(true);
			setIsShownTwoFactorNag(false);
		}
	};

	if (!isShownTwoFactorNag) return <></>;

	return (
		<OverlayWrapper>
			<Overlay
				className="twoFactorNag"
				handleOverlayClose={
					message.showClose ? closeTwoFactorNag : null
				}
				handleOverlay={handleOverlayAction}
				item={{
					headline: translate(message.title, {
						date: config.twofactor.dateTwoFactorObligatory
					}),
					copy: translate(message.copy, {
						date1: config.twofactor.dateTwoFactorObligatory,
						date2: config.twofactor.dateTwoFactorObligatory
					}),
					buttonSet: message.showClose
						? [
								{
									label: translate(
										'twoFactorAuth.nag.button.later'
									),
									function: OVERLAY_FUNCTIONS.CLOSE,
									type: BUTTON_TYPES.SECONDARY
								},
								{
									label: translate(
										'twoFactorAuth.nag.button.protect'
									),
									function: OVERLAY_FUNCTIONS.REDIRECT,
									type: BUTTON_TYPES.PRIMARY
								}
						  ]
						: [
								{
									label: translate(
										'twoFactorAuth.nag.button.protect'
									),
									function: OVERLAY_FUNCTIONS.REDIRECT,
									type: BUTTON_TYPES.PRIMARY
								}
						  ]
				}}
			/>
		</OverlayWrapper>
	);
};
