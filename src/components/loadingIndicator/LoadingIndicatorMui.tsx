import * as React from 'react';
import { CircularProgress } from '@mui/material';

/**
 * MUI-based Loading Indicator
 * Replaces custom CSS bouncing animation with MUI CircularProgress
 * Uses theme primary color
 */
export const LoadingIndicatorMui = () => {
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				margin: '20px 0'
			}}
		>
			<CircularProgress
				size={40}
				sx={{
					color: 'var(--skin-color-primary, #1976d2)'
				}}
			/>
		</div>
	);
};
