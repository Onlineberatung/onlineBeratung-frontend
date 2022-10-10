import React, { useContext, useEffect, useState } from 'react';
import { UserDataContext } from '../../globalState';
import { translate } from '../../utils/translate';
import { BUTTON_TYPES } from '../button/Button';
import { Overlay, OverlayWrapper, OVERLAY_FUNCTIONS } from '../overlay/Overlay';
import { history } from '../app/app';
import './twoFactorNag.styles';
import { useAppConfig } from '../../hooks/useAppConfig';
import {
	STORAGE_KEY_2FA,
	STORAGE_KEY_2FA_DUTY,
	useDevToolbar
} from '../devToolbar/DevToolbar';

interface TwoFactorNagProps {}

export const TwoFactorNag: React.FC<TwoFactorNagProps> = () => {
	const settings = useAppConfig();
	const { userData } = useContext(UserDataContext);
	const { getDevToolbarOption } = useDevToolbar();
	const [isShownTwoFactorNag, setIsShownTwoFactorNag] = useState(false);
	const [forceHideTwoFactorNag, setForceHideTwoFactorNag] = useState(false);
	const [message, setMessage] = useState({
		title: 'twoFactorAuth.nag.obligatory.moment.title',
		copy: 'twoFactorAuth.nag.obligatory.moment.copy',
		showClose: true
	});

	useEffect(() => {
		let todaysDate = new Date(Date.now());

		if (
			userData.twoFactorAuth?.isEnabled &&
			!userData.twoFactorAuth?.isActive &&
			!forceHideTwoFactorNag &&
			todaysDate >= settings.twofactor.startObligatoryHint &&
			getDevToolbarOption(STORAGE_KEY_2FA) === '1'
		) {
			setIsShownTwoFactorNag(true);

			todaysDate >= settings.twofactor.dateTwoFactorObligatory &&
			getDevToolbarOption(STORAGE_KEY_2FA_DUTY) === '1'
				? setMessage(settings.twofactor.messages[1])
				: setMessage(settings.twofactor.messages[0]);
		} else {
			setIsShownTwoFactorNag(false);
		}
	}, [
		userData,
		forceHideTwoFactorNag,
		settings.twofactor.startObligatoryHint,
		settings.twofactor.dateTwoFactorObligatory,
		settings.twofactor.messages,
		getDevToolbarOption
	]);

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
						date: settings.twofactor.dateTwoFactorObligatory.toLocaleDateString(
							'de-DE'
						)
					}),
					copy: translate(message.copy, {
						date1: settings.twofactor.dateTwoFactorObligatory.toLocaleDateString(
							'de-DE'
						),
						date2: settings.twofactor.dateTwoFactorObligatory.toLocaleDateString(
							'de-DE'
						)
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
