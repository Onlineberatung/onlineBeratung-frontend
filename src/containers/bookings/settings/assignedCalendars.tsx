import * as React from 'react';
import './bookingSettings.styles.scss';
import { useAppConfig } from '../../../hooks/useAppConfig';

const AssignedCalendars = () => {
	const settings = useAppConfig();
	return (
		(settings.calcomUrl && (
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
		)) ||
		null
	);
};

export default AssignedCalendars;
