import * as React from 'react';
import { useContext } from 'react';
import { translate } from '../../utils/translate';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import Switch from 'react-switch';
import { UserDataContext } from '../../globalState';
import { apiPatchUserData } from '../../api/apiPatchUserData';

export const ConsultantNotifications = () => {
	const { userData, setUserData } = useContext(UserDataContext);

	const toogleSwitch = (name) => {
		const updatedUserData = { ...userData };
		updatedUserData.emailToggles.forEach((toggle) => {
			if (toggle.name === name) {
				toggle.state = !toggle.state;
			}
		});
		setUserData(updatedUserData);
		apiPatchUserData(updatedUserData);
	};

	return (
		<div className="notifivations">
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
			{userData.emailToggles.length > 0 &&
				userData.emailToggles.map((toggle) => (
					<div className="flex">
						<Switch
							className="mr--1"
							onChange={() => toogleSwitch(toggle.name)}
							checked={toggle.state}
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
							text={translate('profile.notifications.label')}
							type="standard"
						/>
					</div>
				))}
		</div>
	);
};
