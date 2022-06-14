import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { translate } from '../../utils/translate';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import Switch from 'react-switch';
import { UserDataContext } from '../../globalState';
import { apiPatchUserData } from '../../api/apiPatchUserData';

export const ConsultantNotifications = () => {
	const { userData, setUserData } = useContext(UserDataContext);
	const [isActivated, setIsActivated] = useState(false);

	useEffect(() => {
		userData.emailToggles.forEach((toggle) => {
			if (toggle.name === 'NEW_CHAT_MESSAGE_FROM_ADVICE_SEEKER') {
				setIsActivated(toggle.state);
			}
		});
	}, [userData.emailToggles]);

	const toogleSwitch = () => {
		const updatedUserData = { ...userData };
		updatedUserData.emailToggles.forEach((toggle) => {
			if (
				toggle.name === 'NEW_CHAT_MESSAGE_FROM_ADVICE_SEEKER' ||
				toggle.name === 'NEW_FEEDBACK_MESSAGE_FROM_ADVICE_SEEKER'
			) {
				toggle.state = !toggle.state;
			}
		});
		setIsActivated(!isActivated);
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
			{userData.emailToggles.length > 0 && (
				<div className="flex">
					<Switch
						className="mr--1"
						onChange={() => toogleSwitch()}
						checked={isActivated}
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
			)}
		</div>
	);
};
