import * as React from 'react';
import { useContext } from 'react';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import Switch from 'react-switch';
import { UserDataContext } from '../../globalState';
import { apiPatchUserData } from '../../api/apiPatchUserData';
import { useTranslation } from 'react-i18next';
import { useAppConfig } from '../../hooks/useAppConfig';

export const ConsultantNotifications = () => {
	const settings = useAppConfig();
	const { t: translate } = useTranslation();

	const { userData, setUserData } = useContext(UserDataContext);

	const toogleSwitch = (types) => {
		const updatedUserData = { ...userData };
		types.forEach((type) => {
			updatedUserData.emailToggles.forEach((toggle) => {
				if (toggle.name === type) {
					toggle.state = !toggle.state;
				}
			});
		});
		apiPatchUserData(updatedUserData)
			.then(() => {
				setUserData(updatedUserData);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	return (
		<div className="notifications__content">
			<div className="profile__content__title">
				<Headline
					text={translate('profile.notifications.title')}
					semanticLevel="5"
				/>
				<Text
					text={translate('profile.notifications.subtitle')}
					type="standard"
					className="tertiary"
				/>
			</div>
			{settings.emails.notifications.map((notification, index) => {
				return (
					<div className="flex" key={index}>
						<Switch
							className="mr--1"
							onChange={() => toogleSwitch(notification.types)}
							checked={
								userData.emailToggles.find(
									(toggle) =>
										toggle.name === notification.types[0]
								)?.state ?? false
							}
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
							text={translate(notification.label)}
							type="standard"
						/>
					</div>
				);
			})}
		</div>
	);
};
