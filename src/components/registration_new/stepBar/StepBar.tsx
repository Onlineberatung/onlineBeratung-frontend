import { LinearProgress, Typography, Box } from '@mui/material';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

interface StepBarProps {
	currentStep: number;
	maxNumberOfSteps: number;
}

export const StepBar = ({ currentStep, maxNumberOfSteps }: StepBarProps) => {
	const { t: translate } = useTranslation();
	return (
		<>
			<Box sx={{ display: 'flex', alignItems: 'center' }}>
				<Box
					sx={{
						mr: '16px',
						backgroundColor: '#cc1e1c',
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
						{currentStep}
					</Typography>
				</Box>
				<Typography variant="h5" sx={{ fontWeight: '600' }}>
					{translate('registration.stepbar.step')} {currentStep}{' '}
					{translate('registration.stepbar.of')} {maxNumberOfSteps}
				</Typography>
			</Box>
			<LinearProgress
				variant="determinate"
				value={(currentStep / maxNumberOfSteps) * 100}
				color="primary"
				sx={{ mt: '20px', backgroundColor: '#0000001A' }}
			/>
		</>
	);
};
