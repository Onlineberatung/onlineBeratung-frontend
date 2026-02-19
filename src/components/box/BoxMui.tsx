import * as React from 'react';
import { ReactNode } from 'react';
import { Alert, Box as MuiBox, AlertTitle } from '@mui/material';

export enum BoxTypes {
	ERROR = 'error',
	INFO = 'info',
	SUCCESS = 'success'
}

type BoxMuiProps = {
	title?: string;
	type?: BoxTypes;
	children: ReactNode;
};

/**
 * MUI-based Box component using MUI Alert and Box
 * Maintains backward compatibility with original Box component
 */
export const BoxMui = ({ children, title, type }: BoxMuiProps) => {
	// If type is specified, use MUI Alert for better semantics
	if (type) {
		const getSeverity = (): 'error' | 'info' | 'success' => {
			switch (type) {
				case BoxTypes.ERROR:
					return 'error';
				case BoxTypes.INFO:
					return 'info';
				case BoxTypes.SUCCESS:
					return 'success';
				default:
					return 'info';
			}
		};

		return (
			<Alert
				severity={getSeverity()}
				sx={{
					mb: { xs: 1, md: 2 },
					borderRadius: 1,
					'& .MuiAlert-message': {
						width: '100%'
					}
				}}
			>
				{title && <AlertTitle>{title}</AlertTitle>}
				{children}
			</Alert>
		);
	}

	// For non-typed boxes, use MUI Box
	return (
		<MuiBox
			sx={{
				background: 'rgba(255, 255, 255, 0.7)',
				border: '1px solid rgba(255, 255, 255, 0.7)',
				p: { xs: 2, md: 3 },
				mb: { xs: 1, md: 2 },
				borderRadius: 1
			}}
		>
			{title && (
				<MuiBox
					sx={{
						fontWeight: 700,
						fontSize: '16px',
						lineHeight: '24px',
						color: 'rgba(0, 0, 0, 0.87)',
						mb: 2
					}}
				>
					{title}
				</MuiBox>
			)}
			{children}
		</MuiBox>
	);
};
