import { TextField, InputAdornment, Typography } from '@mui/material';
import * as React from 'react';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const ZipcodeInput = () => {
	const { t: translate } = useTranslation();
	const [shrink, setShrink] = useState<boolean>(false);
	const [value, setValue] = useState<string>('');
	const [inputError, setInputError] = useState<boolean>(false);
	return (
		<>
			<Typography variant="h3">
				{translate('registration.zipcode.headline')}
			</Typography>
			<Typography sx={{ mt: '16px' }}>
				{translate('registration.zipcode.subline')}
			</Typography>
			<Typography>{translate('registration.zipcode.bullet1')}</Typography>
			<Typography>{translate('registration.zipcode.bullet2')}</Typography>
			<TextField
				type="number"
				fullWidth
				label={translate('registration.zipcode.label')}
				sx={{
					'&[type=number]': {
						'-moz-appearance': 'textfield'
					},
					'&::-webkit-outer-spin-button': {
						'-webkit-appearance': 'none',
						'margin': 0
					},
					'&::-webkit-inner-spin-button': {
						'-webkit-appearance': 'none',
						'margin': 0
					},
					'mt': '24px',
					'& legend': {
						display: 'none'
					},
					'& label': {
						ml: 4,
						color: 'info.light'
					},
					'& label.MuiInputLabel-shrink': {
						top: '10px'
					}
				}}
				InputLabelProps={{
					shrink: shrink
				}}
				color="info"
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<FmdGoodIcon color="info" />
						</InputAdornment>
					)
				}}
				value={value}
				error={inputError}
				onChange={(e) => {
					if (e.target.value.length < 6) {
						setValue(e.target.value);
					}
					if (inputError === true && e.target.value.length === 5) {
						setInputError(false);
					}
				}}
				onFocus={() => {
					setShrink(true);
				}}
				onBlur={() => {
					if (value.length === 0) {
						setShrink(false);
					} else if (value.length !== 5) {
						setInputError(true);
					}
				}}
			></TextField>
		</>
	);
};
