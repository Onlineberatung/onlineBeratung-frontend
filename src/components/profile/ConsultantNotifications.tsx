import * as React from 'react';
import { useContext } from 'react';
import { Headline } from '../headline/Headline';
import Switch from '../Switch/SwitchSimple';
import { FormControlLabel, Box as MuiBox, Stack, Typography } from '@mui/material';
import { UserDataContext } from '../../globalState';
import { apiPatchUserData } from '../../api/apiPatchUserData';
import { useTranslation } from 'react-i18next';
import { useAppConfig } from '../../hooks/useAppConfig';

export const ConsultantNotifications = () => {
	const settings = useAppConfig();
	const { t: translate } = useTranslation();

	const { userData, reloadUserData } = useContext(UserDataContext);

	const toggleSwitch = (types) => {
		const emailToggles = [...(userData?.emailToggles ?? [])].map(
			(toggle) => ({
				...toggle,
				state: types.includes(toggle.name)
					? !toggle.state
					: toggle.state
			})
		);

		apiPatchUserData({
			emailToggles
		})
			.then(reloadUserData)
			.catch(console.log);
	};

	return (
		<MuiBox>
			<Stack spacing={2}>
				<Headline
					text={translate('profile.notifications.title')}
					semanticLevel="5"
				/>
				<Typography variant="body2" color="text.secondary">
					{translate('profile.notifications.subtitle')}
				</Typography>
				{settings.emails.notifications.map((notification, index) => (
					<FormControlLabel
						key={index}
						control={
							<Switch
								onChange={() => toggleSwitch(notification.types)}
								checked={
									userData.emailToggles.find(
										(toggle) =>
											toggle.name === notification.types[0]
									)?.state ?? false
								}
							/>
						}
						label={translate(notification.label)}
						labelPlacement="end"
					/>
				))}
			</Stack>
		</MuiBox>
	);
};
