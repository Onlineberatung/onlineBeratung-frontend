import { config } from '../../../resources/scripts/config';
import * as React from 'react';
import './bookingSettings.styles.scss';

const AssignedCalendars = () => {
	return (
		<iframe
			title={'Assigned calendars'}
			src={`${config.urls.appointmentServiceDevServer}/apps/installed`}
			frameBorder={0}
			width="100%"
			height="75%"
			style={{ paddingRight: '20px' }}
		/>
	);
};

export default AssignedCalendars;
