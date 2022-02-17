import React, { useContext, useEffect, useState } from 'react';
import { UserDataContext } from '../../globalState';
import { translate } from '../../utils/translate';
import { BUTTON_TYPES } from '../button/Button';
import { Overlay, OverlayWrapper, OVERLAY_FUNCTIONS } from '../overlay/Overlay';
import { history } from '../app/app';
import { apiPatchTwoFactorAuthEncourage } from '../../api';
import './twoFactorNag.styles';

interface TwoFactorNagProps {}

export const TwoFactorNag: React.FC<TwoFactorNagProps> = () => {
	const { userData } = useContext(UserDataContext);
	const [isShownTwoFactorNag, setIsShownTwoFactorNag] = useState(false);

	useEffect(() => {
		if (
			userData.twoFactorAuth?.isEnabled &&
			!userData.twoFactorAuth?.isActive &&
			userData.twoFactorAuth?.isToEncourage &&
			history.location.from !== 'registration'
		) {
			setIsShownTwoFactorNag(true);
		}
	}, [userData]);

	const closeTwoFactorNag = async () => {
		await apiPatchTwoFactorAuthEncourage(false)
			.then(() => {
				setIsShownTwoFactorNag(false);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const handleOverlayAction = (buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECT) {
			history.push({
				pathname: '/profile/sicherheit/2fa',
				openTwoFactor: true
			});
			setIsShownTwoFactorNag(false);
		}
		if (buttonFunction === OVERLAY_FUNCTIONS.CLOSE) {
			setIsShownTwoFactorNag(false);
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
