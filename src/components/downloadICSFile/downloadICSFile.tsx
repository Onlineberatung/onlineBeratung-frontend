import * as React from 'react';
import { Text } from '../text/Text';
import { ReactComponent as CalendarICSIcon } from '../../resources/img/icons/calendar-ics.svg';
import { addMissingZero } from '../../utils/dateHelpers';
import './downloadICSFile.styles';
import { useTranslation } from 'react-i18next';

export interface AppointmentInfoICS {
	date: string;
	duration: string;
	title: string;
}

const downloadICSFile = (filename: string, icsMSG: string) => {
	const link = document.createElement('a');
	link.download = `${filename}.ics`;
	link.href = `data:text/calendar;",${escape(icsMSG)}`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};

const handleICSAppointment = (appointmentInfo: AppointmentInfoICS) => {
	const date = appointmentInfo.date.split(' ')[1];
	const [day, month, year] = date.split('.');
	const [startHour, , endHour] = appointmentInfo.duration.split(' ');
	const timeStart = new Date('01/01/2007 ' + startHour);
	const timeEnd = new Date('01/01/2007 ' + endHour);
	const duration = appointmentInfo.duration.split('-').length
		? appointmentInfo.duration
		: (Math.abs(timeEnd.getTime() - timeStart.getTime()) / (1000 * 60)) %
			60;

	const icsMSG =
		'BEGIN:VCALENDAR\n' +
		'VERSION:2.0\n' +
		'CALSCALE:GREGORIAN\n' +
		'PRODID:adamgibbons/ics\n' +
		'METHOD:PUBLISH\n' +
		'X-PUBLISHED-TTL:PT1H\n' +
		'BEGIN:VEVENT\n' +
		'SUMMARY:' +
		appointmentInfo.title +
		'\n' +
		'DTSTART:' +
		'20' +
		addMissingZero(parseInt(year)) +
		addMissingZero(parseInt(month)) +
		day +
		'T' +
		startHour.replace(':', '') +
		'00\n' +
		'DURATION:PT' +
		duration +
		'M\n' +
		'END:VEVENT\n' +
		'END:VCALENDAR\n';

	downloadICSFile(appointmentInfo.title, icsMSG);
};

export const DownloadICSFile = (params: AppointmentInfoICS) => {
	const { t: translate } = useTranslation();
	return (
		<div
			className="downloadICSFile--flex"
			onClick={handleICSAppointment.bind(this, params)}
		>
			<CalendarICSIcon className="downloadICSFile__icon" />
			<Text
				type="standard"
				text={translate('message.appointmentSet.addToCalendar')}
				className="downloadICSFile__text downloadICSFile--primary"
			/>
		</div>
	);
};
