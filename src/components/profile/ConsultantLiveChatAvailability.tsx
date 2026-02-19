import * as React from 'react';
import { Headline } from '../headline/Headline';
import Switch from '../Switch/SwitchSimple';
import { FormControlLabel, Box as MuiBox, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { apiPatchUserData } from '../../api/apiPatchUserData';
import { useContext } from 'react';
import { RocketChatUserStatusContext } from '../../globalState/provider/RocketChatUserStatusProvider';
import { UserDataContext } from '../../globalState';
import { STATUS_ONLINE } from '../app/RocketChat';

export const ConsultantLiveChatAvailability = () => {
	const { t: translate } = useTranslation();

	const { status } = useContext(RocketChatUserStatusContext);
	const { reloadUserData } = useContext(UserDataContext);

	const toggleSwitch = () => {
		apiPatchUserData({
			available: status !== STATUS_ONLINE
		})
			.then(reloadUserData)
			.catch(console.error);
	};

	return (
		<MuiBox>
			<Stack spacing={2}>
				<Headline
					text={translate('profile.liveChat.title')}
					semanticLevel="5"
				/>
				<Typography variant="body2" color="text.secondary">
					{translate('profile.liveChat.subtitle')}
				</Typography>
				<FormControlLabel
					control={
						<Switch
							onChange={toggleSwitch}
							checked={status === STATUS_ONLINE}
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
					}
					label={translate('profile.liveChat.toggleLabel')}
					labelPlacement="end"
				/>
			</Stack>
		</MuiBox>
	);
};
