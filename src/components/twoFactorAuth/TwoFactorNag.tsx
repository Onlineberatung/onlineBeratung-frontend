import React, { useContext, useEffect, useState } from 'react';
import { UserDataContext } from '../../globalState';
import { translate } from '../../utils/translate';
import { BUTTON_TYPES } from '../button/Button';
import { Overlay, OverlayWrapper, OVERLAY_FUNCTIONS } from '../overlay/Overlay';
import { history } from '../app/app';
import { apiPutTwoFactorAuthHint } from '../../api';

interface TwoFactorNagProps {}

export const TwoFactorNag: React.FC<TwoFactorNagProps> = () => {
	const { userData } = useContext(UserDataContext);
	const [isShownTwoFactorNag, setIsShownTwoFactorNag] = useState(true);

	useEffect(() => {
		if (userData.twoFactorAuth.hint2fa) {
			setIsShownTwoFactorNag(true);
		}
	}, [userData]);

	const closeTwoFactorNag = async () => {
		await apiPutTwoFactorAuthHint(false).then(() => {
			setIsShownTwoFactorNag(false);
		});
	};

	const handleOverlayAction = (buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECT) {
			history.push({
				pathname: '/profile'
			});
			setIsShownTwoFactorNag(false);
			// TODO Trigger 2FA Overlay ???
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
