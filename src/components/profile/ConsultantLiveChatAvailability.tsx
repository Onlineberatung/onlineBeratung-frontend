import * as React from 'react';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import Switch from 'react-switch';
import { useTranslation } from 'react-i18next';
import { apiPatchUserData } from '../../api/apiPatchUserData';
import { UserDataContext } from '../../globalState';

export const ConsultantLiveChatAvailability = () => {
	const { t: translate } = useTranslation();

	const { userData, setUserData } = React.useContext(UserDataContext);

	const toggleSwitch = () => {
		const updatedUserData = {
			...userData,
			available: !userData.available ?? true
		};
		apiPatchUserData(updatedUserData)
			.then(() => {
				setUserData(updatedUserData);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	return (
		<div className="liveChatAvailability__content">
			<div className="profile__content__title">
				<Headline
					text={translate('profile.liveChat.title')}
					semanticLevel="5"
				/>
				<Text
					text={translate('profile.liveChat.subtitle')}
					type="standard"
					className="tertiary"
				/>
			</div>
			<div className="flex">
				<Switch
					className="mr--1"
					onChange={toggleSwitch}
					checked={userData.available ?? false}
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
					text={translate('profile.liveChat.toggleLabel')}
					type="standard"
				/>
			</div>
		</div>
	);
};
