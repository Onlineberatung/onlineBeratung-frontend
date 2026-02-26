import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import NewWindow from '@mui/icons-material/OpenInNew';
import { Headline } from '../../headline/Headline';
import styles from './styles.module.scss';
import { Box as MuiBox, Stack, Typography } from '@mui/material';

export const Documentation = () => {
	const { t } = useTranslation();

	return (
		<MuiBox>
			<Stack spacing={2}>
				<Headline
					text={t('profile.documentation.title')}
					semanticLevel="5"
				/>
				<Typography variant="body2" color="text.secondary">
					{t('profile.documentation.description')}
				</Typography>

				<Link to="/docs" target="_blank" className={styles.link}>
					<NewWindow
						titleAccess={t('profile.documentation.link')}
						aria-label={t('profile.documentation.link')}
					/>{' '}
					{t('profile.documentation.link')}
				</Link>
			</Stack>
		</MuiBox>
	);
};
