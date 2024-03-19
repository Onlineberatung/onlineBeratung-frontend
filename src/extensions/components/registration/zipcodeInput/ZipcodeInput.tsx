import { InputAdornment, Typography } from '@mui/material';
import * as React from 'react';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import {
	useState,
	VFC,
	useContext,
	useEffect,
	Dispatch,
	SetStateAction
} from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../../../../components/input/input';
import { RegistrationContext, RegistrationData } from '../../../../globalState';
import { REGISTRATION_DATA_VALIDATION } from '../registrationDataValidation';

export const ZipcodeInput: VFC<{
	onChange: Dispatch<SetStateAction<Partial<RegistrationData>>>;
}> = ({ onChange }) => {
	const { t } = useTranslation();
	const { setDisabledNextButton, registrationData } =
		useContext(RegistrationContext);
	const [value, setValue] = useState<string>(registrationData.zipcode || '');

	useEffect(() => {
		if (REGISTRATION_DATA_VALIDATION.zipcode.validation(value)) {
			setDisabledNextButton(false);
			onChange({ zipcode: value });
		} else {
			setDisabledNextButton(true);
		}
	}, [setDisabledNextButton, onChange, value]);

	return (
		<>
			<Typography variant="h3">
				{t('registration.zipcode.headline')}
			</Typography>
			<Typography sx={{ mt: '16px' }}>
				{t('registration.zipcode.subline')}
			</Typography>
			<Typography>{t('registration.zipcode.bullet1')}</Typography>
			<Typography>{t('registration.zipcode.bullet2')}</Typography>
			<Input
				inputProps={{
					'data-cy': 'input-postal-code'
				}}
				autoComplete="postal-code"
				inputMode="numeric"
				inputType="text"
				isValueValid={async (val: string) => val.length === 5}
				startAdornment={
					<InputAdornment position="start">
						<FmdGoodIcon color="info" />
					</InputAdornment>
				}
				onInputChange={(val: string) => {
					const reg = /^\d*$/;
					if (val.length < 6 && reg.test(val)) {
						setValue(val);
					}
				}}
				value={value}
				label={t('registration.zipcode.label')}
			/>
		</>
	);
};
