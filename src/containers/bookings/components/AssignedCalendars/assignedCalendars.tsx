import * as React from 'react';
import '../booking.styles.scss';
import { useAppConfig } from '../../../../hooks/useAppConfig';

export const AssignedCalendars = () => {
	const settings = useAppConfig();

	if (!settings.calcomUrl) {
		return null;
	}

	return (
		<div className="assignedCalendars__wrapper">
			<iframe
				title={'AssignedCalendars'}
				src={`${settings.calcomUrl}/apps/installed`}
				frameBorder={0}
				width="100%"
				height="75%"
				style={{ paddingRight: '20px' }}
			/>
		</div>
	);
};
