import * as React from 'react';
import { Headline } from '../headline/Headline';
import Switch from '../Switch/SwitchSimple';
import { FormControlLabel, Stack, Typography, Box as MuiBox } from '@mui/material';
import { useContext } from 'react';
import { UserDataContext } from '../../globalState';

import { apiPatchConsultantData } from '../../api';
import { useTranslation } from 'react-i18next';

export const EnableWalkthrough = () => {
	const { t: translate } = useTranslation();
	const { userData, reloadUserData } = useContext(UserDataContext);
	const { isWalkThroughEnabled } = userData;
	return (
		<MuiBox>
			<Stack spacing={2}>
				<Headline
					text={translate('walkthrough.title')}
					semanticLevel="5"
				/>
				<Typography variant="body2" color="text.secondary">
					{translate('walkthrough.subtitle')}
				</Typography>
				<FormControlLabel
					control={
						<Switch
							onChange={() => {
								apiPatchConsultantData({
									walkThroughEnabled: !isWalkThroughEnabled
								})
									.then(reloadUserData)
									.catch(console.log);
							}}
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
					}
					label={
						isWalkThroughEnabled
							? translate('walkthrough.switch.active.label')
							: translate('walkthrough.switch.deactive.label')
					}
					labelPlacement="end"
				/>
			</Stack>
		</MuiBox>
	);
};
