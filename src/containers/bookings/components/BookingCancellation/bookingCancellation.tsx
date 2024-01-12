import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { useAppConfig } from '../../../../hooks/useAppConfig';

export const BookingCancellation = () => {
	const settings = useAppConfig();

	const location = useLocation<{ uid: string }>();

	return (
		(settings.calcomUrl && (
			<iframe
				src={`${settings.calcomUrl}/cancel/${location.state.uid}`}
				frameBorder={0}
				scrolling="false"
				width="100%"
				height="100%"
				title="booking-cancellation"
			/>
		)) ||
		null
	);
};
