import { LinearProgress, Typography, Box } from '@mui/material';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { VFC } from 'react';

interface StepBarProps {
	currentStep: number;
	maxNumberOfSteps: number;
}

export const StepBar: VFC<StepBarProps> = ({
	currentStep,
	maxNumberOfSteps
}) => {
	const { t } = useTranslation();
	return (
		<>
			<Box
				sx={{ display: 'flex', alignItems: 'center' }}
				data-cy="steps"
				data-cy-max={maxNumberOfSteps}
				data-cy-curr={currentStep}
			>
				<Box
					sx={{
						mr: '16px',
						backgroundColor: 'primary.main',
						borderRadius: '50%',
						height: '36px',
						width: '36px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center'
					}}
				>
					<Typography
						variant="h5"
						sx={{ color: 'white', fontWeight: '600' }}
					>
						{currentStep > maxNumberOfSteps
							? maxNumberOfSteps
							: currentStep}
					</Typography>
				</Box>
				<Typography variant="h5" sx={{ fontWeight: '600' }}>
					{t('registration.stepbar.step')}{' '}
					{currentStep > maxNumberOfSteps
						? maxNumberOfSteps
						: currentStep}{' '}
					{t('registration.stepbar.of')} {maxNumberOfSteps}
				</Typography>
			</Box>
			<LinearProgress
				variant="determinate"
				value={
					currentStep > maxNumberOfSteps
						? 100
						: (currentStep / maxNumberOfSteps) * 100
				}
				color="primary"
				sx={{
					'mt': '20px',
					'mb': '48px',
					'backgroundColor': '#0000001A',
					'borderRadius': '2px',
					'& .MuiLinearProgress-bar': { borderRadius: '2px' }
				}}
			/>
		</>
	);
};
