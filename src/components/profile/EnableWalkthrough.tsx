import * as React from 'react';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import Switch from 'react-switch';
import { useContext } from 'react';
import { UserDataContext } from '../../globalState';

import { apiPatchConsultantData } from '../../api';
import { useTranslation } from 'react-i18next';

export const EnableWalkthrough = () => {
	const { t: translate } = useTranslation();
	const { userData, setUserData } = useContext(UserDataContext);
	const { isWalkThroughEnabled } = userData;
	return (
		<div className="twoFactorAuth">
			<div className="profile__content__title">
				<Headline
					text={translate('walkthrough.title')}
					semanticLevel="5"
				/>
				<Text
					text={translate('walkthrough.subtitle')}
					type="infoLargeAlternative"
				/>
			</div>
			<label className="twoFactorAuth__switch">
				<Switch
					onChange={() => {
						apiPatchConsultantData({
							walkThroughEnabled: !isWalkThroughEnabled
						})
							.then(() => {
								setUserData({
									...userData,
									isWalkThroughEnabled: !isWalkThroughEnabled
								});
							})
							.catch((err) => {
								console.log(err);
							});
					}}
					checked={userData.isWalkThroughEnabled}
					uncheckedIcon={false}
					checkedIcon={false}
					width={48}
					height={26}
					onColor="#0dcd21"
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
