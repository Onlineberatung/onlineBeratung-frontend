import React, { useContext, useEffect } from 'react';
import { UserDataContext } from '../../globalState';
import { translate } from '../../utils/translate';
import { BUTTON_TYPES } from '../button/Button';
import { Overlay, OverlayWrapper, OVERLAY_FUNCTIONS } from '../overlay/Overlay';
import { history } from '../app/app';
import { apiPatchTwoFactorAuthEncourage } from '../../api';
import './twoFactorNag.styles';

interface TwoFactorNagProps {}

export const TwoFactorNag: React.FC<TwoFactorNagProps> = () => {
	const { userData, setUserData } = useContext(UserDataContext);

	const {
		twoFactorAuth: { isShown: isShownTwoFactorNag }
	} = userData;

	useEffect(() => {
		if (
			userData.twoFactorAuth?.isEnabled &&
			!userData.twoFactorAuth?.isActive &&
			userData.twoFactorAuth?.isToEncourage &&
			history.location.from !== 'registration'
		) {
			setIsTwoFactorNagShown(true);
		}
	}, [
		userData.twoFactorAuth.isEnabled,
		userData.twoFactorAuth.isActive,
		userData.twoFactorAuth.isToEncourage
	]);

	const setIsTwoFactorNagShown = (bool) => {
		setUserData({
			...userData,
			twoFactorAuth: {
				...userData.twoFactorAuth,
				isShown: bool
			}
		});
	};

	const closeTwoFactorNag = async () => {
		await apiPatchTwoFactorAuthEncourage(false)
			.then(() => {
				setUserData({
					...userData,
					twoFactorAuth: {
						...userData.twoFactorAuth,
						isToEncourage: false,
						isShown: false
					}
				});
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const handleOverlayAction = async (buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECT) {
			history.push({
				pathname: '/profile/sicherheit/2fa',
				openTwoFactor: true
			});
			await closeTwoFactorNag();
		}
		if (buttonFunction === OVERLAY_FUNCTIONS.CLOSE) {
			setIsTwoFactorNagShown(false);
		}
	};

	if (!isShownTwoFactorNag) return <></>;

	return (
		<OverlayWrapper>
			<Overlay
				className="twoFactorNag"
				handleOverlayClose={closeTwoFactorNag}
				handleOverlay={handleOverlayAction}
				item={{
					headline: translate('twoFactorAuth.nag.title'),
					copy: translate('twoFactorAuth.nag.copy'),
					buttonSet: [
						{
							label: translate('twoFactorAuth.nag.button.later'),
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
				}}
			/>
		</OverlayWrapper>
	);
};
