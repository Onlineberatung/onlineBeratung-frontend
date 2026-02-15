import * as React from 'react';
import { CircularProgress } from '@mui/material';

interface SpinnerProps {
	isDark?: boolean;
	className?: string;
	size?: number;
}

/**
 * MUI-based Spinner component
 * Replaces custom CSS spinner with MUI CircularProgress
 * Uses theme primary color by default
 */
export const SpinnerMui = ({ isDark, className, size = 40 }: SpinnerProps) => {
	return (
		<div
			className={className}
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center'
			}}
		>
			<CircularProgress
				size={size}
				sx={{
					color: isDark ? 'rgba(0, 0, 0, 0.6)' : 'var(--skin-color-primary, #1976d2)'
				}}
			/>
		</div>
	);
};
