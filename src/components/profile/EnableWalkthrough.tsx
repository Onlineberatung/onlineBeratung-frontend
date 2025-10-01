import * as React from 'react';
import { useContext } from 'react';

import { useTranslation } from 'react-i18next';
import Switch from 'react-switch';

import { apiPatchAdviceSeekerData, apiPatchConsultantData } from '../../api';
import {
	AUTHORITIES,
	hasUserAuthority,
	UserDataContext
} from '../../globalState';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';

export const EnableWalkthrough = () => {
	const { t: translate } = useTranslation();
	const { userData, reloadUserData } = useContext(UserDataContext);
	const { isWalkThroughEnabled } = userData;

	const handleSwitchChange = () => {
		if (hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData)) {
			apiPatchConsultantData({
				walkThroughEnabled: !isWalkThroughEnabled
			})
				.then(reloadUserData)
				.catch(console.log);
		}
		if (hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData)) {
			sessionStorage.removeItem('currentLoginSession');
			apiPatchAdviceSeekerData({
				walkThroughEnabled: !isWalkThroughEnabled
			})
				.then(reloadUserData)
				.catch(console.log);
		}
	};

	return (
		<div className="twoFactorAuth">
			<div className="profile__content__title">
				<Headline
					text={translate('walkthrough.title')}
					semanticLevel="5"
				/>
				<Text
					text={translate('walkthrough.subtitle')}
					type="standard"
					className="tertiary"
				/>
			</div>
			<label className="twoFactorAuth__switch">
				<Switch
					onChange={handleSwitchChange}
					checked={userData.isWalkThroughEnabled}
					uncheckedIcon={false}
					checkedIcon={false}
					width={48}
					height={26}
					onColor="#0A882F"
					offColor="#8C878C"
					boxShadow="0px 1px 4px rgba(0, 0, 0, 0.6)"
					handleDiameter={27}
					activeBoxShadow="none"
				/>
				<Text
					text={
						isWalkThroughEnabled
							? translate('walkthrough.switch.active.label')
							: translate('walkthrough.switch.deactive.label')
					}
					type="standard"
				/>
			</label>
		</div>
	);
};
