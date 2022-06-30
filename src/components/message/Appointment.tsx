import * as React from 'react';
import { translate } from '../../utils/translate';
import { Text } from '../text/Text';
import { Headline } from '../headline/Headline';
import './appointment.styles';
import { ReactComponent as CalendarCheckIcon } from '../../resources/img/icons/calendar-check.svg';
import { ReactComponent as CalendarCancelIcon } from '../../resources/img/icons/calendar-cancel.svg';
import { ReactComponent as CalendarICSIcon } from '../../resources/img/icons/calendar-ics.svg';
import { ReactComponent as VideoCalIcon } from '../../resources/img/icons/video-call.svg';
import {
	addMinutesToDateTime,
	formatToHHMM,
	getMonthFromString,
	getWeekDayFromPrefix
} from '../../utils/dateHelpers';
import { history } from '../app/app';

interface AppointmentData {
	title: string;
	user: string;
	counselor: string;
	date: string;
	duration: number;
	location: string;
}

export const Appointment = (param: { data: string }) => {
	const parsedData: AppointmentData = JSON.parse(param.data);
	const duration = parsedData.duration;
	const startingTimeStampDate = Date.parse(parsedData.date);
	const finishingHour = addMinutesToDateTime(startingTimeStampDate, duration);
	const [weekDay, day, month, year] = parsedData.date.split(' ');
	const appointmentDate = `${getWeekDayFromPrefix(
		weekDay
	)}, ${day}.${getMonthFromString(month)}.${year.slice(-2)}`;
	const appointmentHours = `${formatToHHMM(
		`${startingTimeStampDate}`
	)} - ${formatToHHMM(`${finishingHour}`)}`;

	const handleICSAppointment = (appointmentInfo: AppointmentData) => {
		const [, day, month, year, startHour] = appointmentInfo.date.split(' ');
		const [hour, min, sec] = startHour.split(':');
		const icsMSG =
			'BEGIN:VCALENDAR\n' +
			'VERSION:2.0\n' +
			'CALSCALE:GREGORIAN\n' +
			'PRODID:adamgibbons/ics\n' +
			'METHOD:PUBLISH\n' +
			'X-PUBLISHED-TTL:PT1H\n' +
			'BEGIN:VEVENT\n' +
			'SUMMARY:' +
			appointmentInfo.location +
			'\n' +
			'DTSTART:' +
			year +
			getMonthFromString(month) +
			day +
			'T' +
			hour +
			min +
			sec +
			'Z\n' +
			'DURATION:PT' +
			appointmentInfo.duration +
			'M\n' +
			'END:VEVENT\n' +
			'END:VCALENDAR\n';

		downloadICSFile(appointmentInfo.location, icsMSG);
	};

	const handleCancelAppointment = () => {
		history.push('/booking/cancelation');
	};

	const downloadICSFile = (filename: string, icsMSG: string) => {
		const link = document.createElement('a');
		link.download = `${filename}.ics`;
		link.href = `data:text/calendar;",${escape(icsMSG)}`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<React.Fragment>
			<Text
				type="infoSmall"
				text={translate('message.appointmentSet.confirmation')}
				className="appointmentSet__confirmation appointmentSet--primary"
			/>
			<div className="appointmentSet">
				<div className="appointmentSet--flex">
					<CalendarCheckIcon />
					<Headline
						semanticLevel="5"
						text={translate('message.appointmentSet.title')}
						className="appointmentSet__title"
					/>
				</div>
				<div className="appointmentSet--flex">
					<Text
						type="standard"
						text={appointmentDate}
						className="appointmentSet__date"
					/>
					<Text
						type="standard"
						text={appointmentHours}
						className="appointmentSet__time"
					/>
				</div>
				<div className="appointmentSet--flex">
					<VideoCalIcon />
					<Text
						type="infoLargeAlternative"
						text={'Videoberatung'}
						className="appointmentSet__video"
					/>
				</div>
				<Text
					type="standard"
					className="appointmentSet__summary"
					text={parsedData.location}
				/>
				<div
					className="appointmentSet--flex appointmentSet--pointer"
					onClick={handleICSAppointment.bind(this, parsedData)}
				>
					<CalendarICSIcon />
					<Text
						type="standard"
						text={translate('message.appointmentSet.addToCalendar')}
						className="appointmentSet__ics appointmentSet--primary"
					/>
				</div>
				<div
					className="appointmentSet--flex appointmentSet--pointer"
					onClick={handleCancelAppointment}
				>
					<CalendarCancelIcon />
					<Text
						type="standard"
						text={translate('message.appointmentSet.cancel')}
						className="appointmentSet__cancel appointmentSet--primary"
					/>
				</div>
			</div>
		</React.Fragment>
	);
};
