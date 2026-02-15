import React from 'react';
import { CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface LoadingSpinnerProps {}

/**
 * MUI-based Loading Spinner
 * Replaces custom CSS multi-div animation with MUI CircularProgress
 * Uses theme primary color
 */
export const LoadingSpinnerMui: React.FC<LoadingSpinnerProps> = () => {
	const { t: translate } = useTranslation();
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				minHeight: '200px'
			}}
			title={translate('app.wait')}
		>
			<CircularProgress
				size={50}
				sx={{
					color: 'var(--skin-color-primary, #1976d2)'
				}}
			/>
		</div>
	);
};
