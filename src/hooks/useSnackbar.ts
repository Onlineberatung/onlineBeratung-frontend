import { useState, useCallback } from 'react';
import { AlertColor } from '@mui/material';

export interface SnackbarState {
	open: boolean;
	message: string;
	severity: AlertColor;
}

export const useSnackbar = () => {
	const [snackbar, setSnackbar] = useState<SnackbarState>({
		open: false,
		message: '',
		severity: 'info'
	});

	const showSnackbar = useCallback((message: string, severity: AlertColor = 'info') => {
		setSnackbar({
			open: true,
			message,
			severity
		});
	}, []);

	const hideSnackbar = useCallback(() => {
		setSnackbar((prev) => ({ ...prev, open: false }));
	}, []);

	return {
		snackbar,
		showSnackbar,
		hideSnackbar
	};
};
