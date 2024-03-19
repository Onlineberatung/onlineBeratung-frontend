import { Box, Typography, Button, Divider } from '@mui/material';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import CreateIcon from '@mui/icons-material/Create';
import ChatIcon from '@mui/icons-material/Chat';
import MailIcon from '@mui/icons-material/Mail';
import LockIcon from '@mui/icons-material/Lock';
import { Link as RouterLink } from 'react-router-dom';
import { useMemo } from 'react';
import { PreselectionBox } from '../preselectionBox/PreselectionBox';

interface WelcomeScreenProps {
	nextStepUrl: string;
}

export const WelcomeScreen = ({ nextStepUrl }: WelcomeScreenProps) => {
	const { t } = useTranslation();

	const infoDefinitions = useMemo(
		() => [
			{
				icon: (
					<CreateIcon
						aria-hidden="true"
						focusable="false"
						sx={{ width: '30px', height: '30px' }}
						color="primary"
					/>
				),
				headline: t('registration.welcomeScreen.info1.title'),
				subline: t('registration.welcomeScreen.info1.text')
			},
			{
				icon: (
					<ChatIcon
						sx={{ width: '30px', height: '30px' }}
						color="primary"
					/>
				),
				headline: t('registration.welcomeScreen.info2.title'),
				subline: t('registration.welcomeScreen.info2.text')
			},
			{
				icon: (
					<MailIcon
						sx={{ width: '30px', height: '30px' }}
						color="primary"
					/>
				),
				headline: t('registration.welcomeScreen.info3.title'),
				subline: t('registration.welcomeScreen.info3.text')
			},
			{
				icon: (
					<LockIcon
						sx={{ width: '30px', height: '30px' }}
						color="primary"
					/>
				),
				headline: t('registration.welcomeScreen.info4.title'),
				subline: t('registration.welcomeScreen.info4.text')
			}
		],
		[t]
	);

	return (
		<>
			<Typography variant="h2">{t('registration.overline')}</Typography>
			<PreselectionBox hasDrawer={true} />
			<Typography variant="subtitle1" sx={{ mt: '12px', mb: '48px' }}>
				{t('registration.welcomeScreen.subline')}
			</Typography>
			{infoDefinitions.map((info) => (
				<Box
					sx={{ display: 'flex', alignItems: 'center', mb: '32px' }}
					key={info.subline}
				>
					{info.icon}
					<Box sx={{ ml: '24px' }}>
						<Typography variant="h5">{info.headline}</Typography>
						<Typography variant="body1" sx={{ mt: '4px' }}>
							{info.subline}
						</Typography>
					</Box>
				</Box>
			))}
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'flex-end',
					flexDirection: { xs: 'column', md: 'row' },
					p: { xs: '0', md: '32px' },
					mt: '48px',
					borderRadius: '4px',
					border: { xs: 'none', md: '1px solid #c6c5c4' }
				}}
			>
				<Box
					sx={{
						mr: { xs: '0', md: '24px' },
						width: { xs: '100%', md: '50%' }
					}}
				>
					<Typography
						variant="body2"
						sx={{ textAlign: 'center', fontWeight: '600' }}
					>
						{t('registration.welcomeScreen.register.helperText')}
					</Typography>
					<Button
						fullWidth
						sx={{ mt: { xs: '8px', md: '16px' } }}
						variant="contained"
						component={RouterLink}
						to={nextStepUrl}
						data-cy="button-register"
					>
						{t('registration.welcomeScreen.register.buttonLabel')}
					</Button>
				</Box>
				<Divider
					sx={{ mt: '32px', width: '100%', display: { md: 'none' } }}
				>
					<Typography
						variant="subtitle2"
						sx={{ textTransform: 'uppercase', color: 'info.light' }}
					>
						{t('app.or')}
					</Typography>
				</Divider>
				<Box
					sx={{
						width: { xs: '100%', md: '50%' },
						mt: { xs: '32px', md: '0' }
					}}
				>
					<Typography
						variant="body2"
						sx={{ textAlign: 'center', fontWeight: '600' }}
					>
						{t('registration.welcomeScreen.login.helperText')}
					</Typography>
					<Button
						fullWidth
						sx={{ mt: { xs: '8px', md: '16px' } }}
						variant="outlined"
						component={RouterLink}
						to={`/login`}
					>
						{t('registration.welcomeScreen.login.buttonLabel')}
					</Button>
				</Box>
			</Box>
		</>
	);
};
