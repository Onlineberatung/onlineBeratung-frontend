import { TextField, InputAdornment, Typography } from '@mui/material';
import * as React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface AgencySelectionInputProps {
	value: string;
	onInputChange(val: string): void;
}

export const AgencySelectionInput = ({
	value,
	onInputChange
}: AgencySelectionInputProps) => {
	const { t: translate } = useTranslation();
	const [shrink, setShrink] = useState<boolean>(false);
	return (
		<>
			<Typography variant="h3">
				{translate('registration.agency.headline')}
			</Typography>
			<TextField
				type="number"
				fullWidth
				label={translate('registration.agency.search')}
				sx={{
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
							<SearchIcon color="info" />
						</InputAdornment>
					),
					endAdornment: (
						<InputAdornment position="end">
							<CloseIcon
								sx={{ cursor: 'pointer' }}
								color="info"
								onClick={() => {
									onInputChange('');
									setShrink(false);
								}}
							/>
						</InputAdornment>
					)
				}}
				value={value}
				onChange={(e) => {
					if (e.target.value.length < 6) {
						onInputChange(e.target.value);
					}
				}}
				onFocus={() => {
					setShrink(true);
				}}
				onBlur={() => {
					if (value.length === 0) {
						setShrink(false);
					}
				}}
			></TextField>
		</>
	);
};
