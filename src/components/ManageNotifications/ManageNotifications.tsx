import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import Switch from 'react-switch';
import './manageNotifications.styles';

export const ManageNotifications = () => {
	const { t: translate } = useTranslation();

	const [isSwitchChecked, setIsSwitchChecked] = useState<boolean>(false);

	const handleSwitchChange = () => {
		if (!isSwitchChecked) {
			setIsSwitchChecked(true);
		} else {
			setIsSwitchChecked(false);
		}
	};

	return (
		<div className="manageNotifications">
			<div className="manageNotifications__content__title">
				<Headline
					text={translate('manageNotifications.title')}
					semanticLevel="5"
				/>
				<Text
					className="tertiary"
					text={translate('manageNotifications.subtitle')}
					type="standard"
				/>
			</div>
			<label className="manageNotifications__switch">
				<Switch
					onChange={handleSwitchChange}
					checked={isSwitchChecked}
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
					text={translate('manageNotifications.switch.label')}
					type="standard"
				/>
			</label>
		</div>
	);
};
