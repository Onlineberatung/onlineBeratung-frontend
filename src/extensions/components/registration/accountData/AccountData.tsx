import {
	Checkbox,
	FormGroup,
	InputAdornment,
	Typography,
	Link,
	FormControlLabel
} from '@mui/material';
import * as React from 'react';
import {
	useState,
	useContext,
	useEffect,
	VFC,
	Dispatch,
	SetStateAction
} from 'react';
import { useTranslation } from 'react-i18next';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import { Input } from '../../../../components/input/input';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
	hasMixedLetters,
	hasNumber,
	hasSpecialChar
} from '../../../../utils/validateInputValue';
import { LegalLinksContext } from '../../../../globalState/provider/LegalLinksProvider';
import { RegistrationContext, RegistrationData } from '../../../../globalState';
import { apiGetIsUsernameAvailable } from '../../../../api/apiGetIsUsernameAvailable';
import { REGISTRATION_DATA_VALIDATION } from '../registrationDataValidation';
import LegalLinks from '../../../../components/legalLinks/LegalLinks';

export const passwordCriteria = [
	{
		info: 'registration.account.password.criteria1',
		validation: (val) => val.length > 8
	},
	{
		info: 'registration.account.password.criteria2',
		validation: (val) => hasNumber(val)
	},
	{
		info: 'registration.account.password.criteria3',
		validation: (val) => hasMixedLetters(val)
	},
	{
		info: 'registration.account.password.criteria4',
		validation: (val) => hasSpecialChar(val)
	}
];

export const AccountData: VFC<{
	onChange: Dispatch<SetStateAction<Partial<RegistrationData>>>;
}> = ({ onChange }) => {
	const legalLinks = useContext(LegalLinksContext);
	const { t } = useTranslation();
	const [password, setPassword] = useState<string>('');
	const [repeatPassword, setRepeatPassword] = useState<string>('');
	const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>();
	const [dataProtectionChecked, setDataProtectionChecked] =
		useState<boolean>();
	const [isRepeatPasswordVisible, setIsRepeatPasswordVisible] =
		useState<boolean>();
	const [username, setUsername] = useState<string>('');
	const [isUsernameAvailable, setIsUsernameAvailable] =
		useState<boolean>(true);
	const { setDisabledNextButton } = useContext(RegistrationContext);

	useEffect(() => {
		if (
			isUsernameAvailable &&
			REGISTRATION_DATA_VALIDATION.username.validation(username) &&
			REGISTRATION_DATA_VALIDATION.password.validation(password) &&
			password === repeatPassword &&
			dataProtectionChecked
		) {
			setDisabledNextButton(false);
			onChange({ username, password });
		} else {
			setDisabledNextButton(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [username, password, repeatPassword, dataProtectionChecked]);

	return (
		<>
			<Typography variant="h3">
				{t('registration.account.headline')}
			</Typography>
			<Typography sx={{ mt: '16px' }}>
				{t('registration.account.subline')}
			</Typography>
			<Input
				startAdornment={
					<InputAdornment position="start">
						<PersonIcon color="info" />
					</InputAdornment>
				}
				onInputChange={(val: string) => {
					setUsername(val);
				}}
				value={username}
				label={t('registration.account.username.label')}
				info={t('registration.account.username.info')}
				errorMessage={
					isUsernameAvailable
						? t('registration.account.username.error.available')
						: t('registration.account.username.error.unavailable')
				}
				successMesssage={t('registration.account.username.success')}
				isValueValid={async (val: string) => {
					if (val.length < 5) {
						setIsUsernameAvailable(true);
						return false;
					} else {
						return await apiGetIsUsernameAvailable(val)
							.then(() => {
								setIsUsernameAvailable(false);
								return false;
							})
							.catch(() => {
								setIsUsernameAvailable(true);
								return true;
							});
					}
				}}
			/>
			<Input
				inputType={isPasswordVisible ? 'text' : 'password'}
				startAdornment={
					<InputAdornment position="start">
						<LockIcon color="info" />
					</InputAdornment>
				}
				endAdornment={
					<InputAdornment
						position="start"
						aria-label={t('login.password.show')}
						title={t('login.password.show')}
					>
						<VisibilityIcon
							sx={{ cursor: 'pointer', color: 'info.light' }}
							onClick={() => {
								setIsPasswordVisible(!isPasswordVisible);
							}}
							tabIndex={0}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									setIsPasswordVisible(!isPasswordVisible);
								}
							}}
						/>
					</InputAdornment>
				}
				onInputChange={(val: string) => {
					setPassword(val);
				}}
				value={password}
				label={t('registration.account.password.label')}
				multipleCriteria={passwordCriteria}
			/>
			<Input
				inputType={isRepeatPasswordVisible ? 'text' : 'password'}
				startAdornment={
					<InputAdornment position="start">
						<LockIcon color="info" />
					</InputAdornment>
				}
				endAdornment={
					<InputAdornment
						position="start"
						aria-label={t('login.password.show')}
						title={t('login.password.show')}
					>
						<VisibilityIcon
							sx={{ cursor: 'pointer', color: 'info.light' }}
							tabIndex={0}
							onClick={() => {
								setIsRepeatPasswordVisible(
									!isRepeatPasswordVisible
								);
							}}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									setIsRepeatPasswordVisible(
										!isRepeatPasswordVisible
									);
								}
							}}
						/>
					</InputAdornment>
				}
				onInputChange={(val: string) => {
					setRepeatPassword(val);
				}}
				value={repeatPassword}
				label={t('registration.account.repeatPassword.label')}
				isValueValid={async (val) =>
					val === password && password.length > 0
				}
				errorMessage={t('registration.account.repeatPassword.error')}
				successMesssage={t(
					'registration.account.repeatPassword.success'
				)}
			/>
			<FormGroup sx={{ mt: '40px' }}>
				<FormControlLabel
					onClick={() => {
						setDataProtectionChecked(!dataProtectionChecked);
					}}
					sx={{ alignItems: 'flex-start' }}
					control={
						<Checkbox
							checked={dataProtectionChecked}
							sx={{ mt: '-9px' }}
						/>
					}
					label={
						<Typography>
							<LegalLinks
								delimiter={', '}
								filter={(legalLink) => legalLink.registration}
								legalLinks={legalLinks}
								params={{ aid: null }}
								prefix={t(
									'registration.dataProtection.label.prefix'
								)}
								lastDelimiter={t(
									'registration.dataProtection.label.and'
								)}
								suffix={t(
									'registration.dataProtection.label.suffix'
								)}
							>
								{(label, url) => (
									<Link target="_blank" href={url}>
										{label}
									</Link>
								)}
							</LegalLinks>
						</Typography>
					}
				/>
			</FormGroup>
		</>
	);
};
