import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { UserDataContext } from '../../globalState';
import { BUTTON_TYPES } from '../button/Button';
import { Overlay, OVERLAY_FUNCTIONS } from '../overlay/Overlay';
import './twoFactorNag.styles';
import { useTranslation } from 'react-i18next';
import { useAppConfig } from '../../hooks/useAppConfig';
import {
	STORAGE_KEY_2FA,
	STORAGE_KEY_DISABLE_2FA_DUTY,
	useDevToolbar
} from '../devToolbar/DevToolbar';
import { OVERLAY_TWO_FACTOR_NAG } from '../../globalState/interfaces/AppConfig/OverlaysConfigInterface';

interface TwoFactorNagProps {}

export const TwoFactorNag: React.FC<TwoFactorNagProps> = () => {
	const { t: translate } = useTranslation();
	const history = useHistory();
	const location = useLocation<{ openTwoFactor?: boolean }>();

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
			!location.state?.openTwoFactor &&
			!forceHideTwoFactorNag &&
			todaysDate >= settings.twofactor.startObligatoryHint &&
			getDevToolbarOption(STORAGE_KEY_2FA) === '1'
		) {
			setIsShownTwoFactorNag(true);
			todaysDate >= settings.twofactor.dateTwoFactorObligatory &&
			getDevToolbarOption(STORAGE_KEY_DISABLE_2FA_DUTY) === '0'
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
		getDevToolbarOption,
		location
	]);

	// Prevent hiding 2fa nag if it has a duty
	const handleTwoFactorNag = useCallback(
		(val) => {
			let todaysDate = new Date(Date.now());
			if (
				todaysDate >= settings.twofactor.dateTwoFactorObligatory &&
				getDevToolbarOption(STORAGE_KEY_DISABLE_2FA_DUTY) === '0'
			) {
				setForceHideTwoFactorNag(false);
				return;
			}
			setForceHideTwoFactorNag(val);
		},
		[getDevToolbarOption, settings.twofactor.dateTwoFactorObligatory]
	);

	const closeTwoFactorNag = async () => {
		handleTwoFactorNag(true);
		setIsShownTwoFactorNag(false);
	};

	const handleOverlayAction = (buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECT) {
			history.push({
				pathname: '/profile/einstellungen/sicherheit',
				state: {
					openTwoFactor: true
				}
			});
			handleTwoFactorNag(true);
			setIsShownTwoFactorNag(false);
		}
		if (buttonFunction === OVERLAY_FUNCTIONS.CLOSE) {
			handleTwoFactorNag(true);
			setIsShownTwoFactorNag(false);
		}
	};

	if (!isShownTwoFactorNag) return <></>;

	return (
		<Overlay
			name={OVERLAY_TWO_FACTOR_NAG}
			className="twoFactorNag"
			handleOverlayClose={message.showClose ? closeTwoFactorNag : null}
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
	);
};
