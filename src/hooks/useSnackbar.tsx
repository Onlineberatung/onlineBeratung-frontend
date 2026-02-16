import { useState, useCallback } from 'react';

export interface SnackbarState {
	open: boolean;
	message: string;
	severity?: 'success' | 'info' | 'warning' | 'error';
}

export const useSnackbar = () => {
	const [snackbar, setSnackbar] = useState<SnackbarState>({
		open: false,
		message: '',
		severity: 'info'
	});

	const showSnackbar = useCallback(
		(
			message: string,
			severity: 'success' | 'info' | 'warning' | 'error' = 'info'
		) => {
			setSnackbar({
				open: true,
				message,
				severity
			});
		},
		[]
	);

	const hideSnackbar = useCallback(() => {
		setSnackbar((prev) => ({
			...prev,
			open: false
		}));
	}, []);

	return {
		snackbar,
		showSnackbar,
		hideSnackbar
	};
};
