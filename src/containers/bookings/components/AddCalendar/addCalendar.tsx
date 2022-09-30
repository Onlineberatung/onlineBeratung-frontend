import {
	AppleIcon,
	CalDav,
	GoogleCalendar,
	Office365
} from '../../../../resources/img/icons';
import * as React from 'react';
import { translate } from '../../../../utils/translate';
import { ReactElement } from 'react';
import { Calendar } from '../Calendar/calendar';

interface AvailableCalendarsInterface {
	component: ReactElement;
	label: string;
	buttonLabel: string;
	calendarName: string;
}

const AddCalendar = () => {
	const availableCalendars: AvailableCalendarsInterface[] = [
		{
			component: <Office365 className="calendar-integration-icon" />,
			label: translate('booking.calender.integration.office365'),
			buttonLabel: translate('booking.calender.synchronise'),
			calendarName: 'office365'
		},
		{
			component: <CalDav className="calendar-integration-icon" />,
			label: translate('booking.calender.integration.caldav'),
			buttonLabel: translate('booking.calender.synchronise'),
			calendarName: 'caldav'
		},
		{
			component: <GoogleCalendar className="calendar-integration-icon" />,
			label: translate('booking.calender.integration.google'),
			buttonLabel: translate('booking.calender.synchronise'),
			calendarName: 'google'
		},
		{
			component: <AppleIcon className="calendar-integration-icon" />,
			label: translate('booking.calender.integration.apple'),
			buttonLabel: translate('booking.calender.synchronise'),
			calendarName: 'apple'
		}
	];

	return (
		<>
			{availableCalendars.map((calendar) => (
				<Calendar
					component={calendar.component}
					label={calendar.label}
					buttonLabel={calendar.buttonLabel}
					calendarName={calendar.calendarName}
				/>
			))}
		</>
	);
};

export default AddCalendar;
