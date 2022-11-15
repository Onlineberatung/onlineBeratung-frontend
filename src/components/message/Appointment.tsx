import * as React from 'react';
import { Text } from '../text/Text';
import { Headline } from '../headline/Headline';
import './appointment.styles';
import { ReactComponent as CalendarCheckIcon } from '../../resources/img/icons/calendar-check.svg';
import { ReactComponent as CalendarCancelIcon } from '../../resources/img/icons/calendar-cancel.svg';
import {
	convertUTCDateToLocalDate,
	formatToHHMM
} from '../../utils/dateHelpers';
import { DownloadICSFile } from '../downloadICSFile/downloadICSFile';
import { ALIAS_MESSAGE_TYPES } from '../../api/apiSendAliasMessage';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

interface AppointmentData {
	title: string;
	user: string;
	counselor: string;
	date: string;
	duration: number;
	location: string;
	note?: string;
}

export const Appointment = (param: {
	data: string;
	messageType: ALIAS_MESSAGE_TYPES;
}) => {
	const { t: translate } = useTranslation();
	const [expanded, setExpanded] = useState(false);
	const parsedData: AppointmentData = JSON.parse(param.data);
	const duration = parsedData.duration;
	const startingTimeStampDate = new Date(
		convertUTCDateToLocalDate(new Date(parsedData.date)).toLocaleString(
			'en-ZA'
		)
	).getTime();
	const finishingHour = startingTimeStampDate + duration * 60 * 1000;
	const appointmentDate = new Date(parsedData.date).toLocaleDateString(
		'de-de',
		{
			weekday: 'long',
			year: '2-digit',
			month: '2-digit',
			day: '2-digit'
		}
	);

	const translateKey = expanded
		? 'booking.event.show.less'
		: 'booking.event.show.more';

	const appointmentHours = `${formatToHHMM(
		`${startingTimeStampDate}`
	)} - ${formatToHHMM(`${finishingHour}`)}`;

	let appointmentTitle;
	let appointmentIcon;
	let appointmentComponentHeader;
	let showAddToCalendarComponent;
	if (param.messageType === ALIAS_MESSAGE_TYPES.APPOINTMENT_SET) {
		appointmentComponentHeader = translate(
			'message.appointment.component.header.confirmation'
		);
		appointmentTitle = translate('message.appointmentSet.title');
		appointmentIcon = <CalendarCheckIcon />;
		showAddToCalendarComponent = true;
	} else if (
		param.messageType === ALIAS_MESSAGE_TYPES.APPOINTMENT_RESCHEDULED
	) {
		appointmentComponentHeader = translate(
			'message.appointment.component.header.change'
		);
		appointmentTitle = translate('message.appointmentRescheduled.title');
		appointmentIcon = <CalendarCheckIcon />;
		showAddToCalendarComponent = true;
	} else {
		appointmentComponentHeader = translate(
			'message.appointment.component.header.cancellation'
		);
		appointmentTitle = translate('message.appointmentCancelled.title');
		appointmentIcon = <CalendarCancelIcon />;
		showAddToCalendarComponent = false;
	}

	return (
		<React.Fragment>
			<Text
				type="infoSmall"
				text={appointmentComponentHeader}
				className="appointmentSet__confirmation appointmentSet--primary"
			/>
			<div className="appointmentSet">
				<div className="appointmentSet--flex">
					{appointmentIcon}
					<Headline
						semanticLevel="5"
						text={appointmentTitle}
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
				{parsedData.title && (
					<Text
						type="standard"
						className="appointmentSet__summary"
						text={parsedData.title}
					/>
				)}
				{parsedData.note && (
					<div
						className={`appointmentSet__note__description ${
							expanded ? 'expanded' : 'shrinked'
						}`}
					>
						<Text
							type="standard"
							className="appointmentSet__note__title"
							text={translate('message.note.title')}
						/>
						<Text
							type="standard"
							className="appointmentSet__note__descriptionText"
							text={parsedData.note}
						/>
						{parsedData.note.length > 110 && (
							<>
								<div
									className="appointmentSet__note appointmentSet--flex appointmentSet--pointer"
									onClick={() => setExpanded(!expanded)}
								>
									<Text
										text={translate(translateKey)}
										type="standard"
										className="appointmentSet__note__showMore bookingEvents--pointer bookingEvents--primary"
									/>
								</div>
							</>
						)}
					</div>
				)}
				{showAddToCalendarComponent && (
					<DownloadICSFile
						date={appointmentDate}
						duration={appointmentHours}
						title={parsedData.title}
					/>
				)}
			</div>
		</React.Fragment>
	);
};
