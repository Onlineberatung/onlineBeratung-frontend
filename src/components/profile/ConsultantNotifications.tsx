import * as React from 'react';
import { useState } from 'react';
import { translate } from '../../utils/translate';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import Switch from 'react-switch';

export const ConsultantNotifications = () => {
	const [isOff, setIsOff] = useState(true);

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
			<div className="flex">
				<Switch
					className="mr--1"
					onChange={() => setIsOff(!isOff)}
					checked={isOff}
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
		</div>
	);
};
