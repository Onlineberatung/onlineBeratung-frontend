import {
	AppleIcon,
	CalDav,
	GoogleCalendar,
	Office365
} from '../../../../resources/img/icons';
import * as React from 'react';
import { Calendar } from '../Calendar/calendar';

const AddCalendar = () => {
	return (
		<>
			<Calendar
				labelKey="booking.calender.integration.office365"
				buttonLabelKey="booking.calender.synchronise"
				calendarName="office365"
			>
				<Office365 className="calendar-integration-icon" />
			</Calendar>
			<Calendar
				labelKey="booking.calender.integration.caldav"
				buttonLabelKey="booking.calender.synchronise"
				calendarName="caldav"
			>
				<CalDav className="calendar-integration-icon" />
			</Calendar>
			<Calendar
				labelKey="booking.calender.integration.google"
				buttonLabelKey="booking.calender.synchronise"
				calendarName="google"
			>
				<GoogleCalendar className="calendar-integration-icon" />
			</Calendar>
			<Calendar
				labelKey="booking.calender.integration.apple"
				buttonLabelKey="booking.calender.synchronise"
				calendarName="apple"
			>
				<AppleIcon className="calendar-integration-icon" />
			</Calendar>
		</>
	);
};

export default AddCalendar;
