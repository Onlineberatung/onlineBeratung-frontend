import * as React from 'react';
import { useEffect, useState, useContext } from 'react';
import { translate } from '../../utils/translate';
import {
	setBookingWrapperActive,
	setBookingWrapperInactive
} from '../app/navigationHandler';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import { Headline } from '../headline/Headline';
import './bookingEvents.styles';
import { history } from '../app/app';
import { ReactComponent as CalendarMonthPlus } from '../../resources/img/icons/calendar-plus.svg';
import { ReactComponent as CalendarCancelIcon } from '../../resources/img/icons/calendar-cancel.svg';
import { ReactComponent as CalendarRescheduleIcon } from '../../resources/img/icons/calendar-reschedule.svg';
import { ReactComponent as CalendarICSIcon } from '../../resources/img/icons/calendar-ics.svg';
import { ReactComponent as VideoCalIcon } from '../../resources/img/icons/video-call.svg';
import { ReactComponent as ArrowUpIcon } from '../../resources/img/icons/arrow-up.svg';
import { ReactComponent as ArrowDownIcon } from '../../resources/img/icons/arrow-down.svg';
import { Text } from '../text/Text';
import { Box } from '../box/Box';
import { downloadICSFile } from '../../utils/downloadICSFile';
import {
	AUTHORITIES,
	hasUserAuthority,
	UserDataContext
} from '../../globalState';
import { BookingEventsInterface } from '../../globalState/interfaces/BookingDataInterface';
import { getWeekDayFromPrefix } from '../../utils/dateHelpers';
import { apiGetConsultantAppointments } from '../../api/apiGetConsultantAppointments';
import { apiAppointmentsServiceBookingEventsByUserId } from '../../api';

interface BookingEventsListInterface {
	id: number;
	rescheduleLink?: string;
	uid: string;
	date: string;
	duration: string;
	counselor: string;
	description: string;
	expanded: boolean;
}

export const BookingEvents = () => {
	useEffect(() => {
		setBookingWrapperActive();

		return () => {
			setBookingWrapperInactive();
		};
	}, []);

	const { userData } = useContext(UserDataContext);

	const buttonSetCancel: ButtonItem = {
		label: translate('booking.schedule'),
		type: BUTTON_TYPES.PRIMARY
	};

	const handleBackButton = () => {
		history.push('/booking');
	};

	const initialData: BookingEventsListInterface[] = [
		{
			id: 1,
			date: '',
			duration: '',
			counselor: '',
			description: '',
			expanded: false,
			uid: ''
		}
	];

	const [bookingEventsApi, setbookingEventsApi] = useState<
		BookingEventsInterface[] | null
	>(null);

	const [bookingEvents, setbookingEvents] =
		useState<BookingEventsListInterface[]>(initialData);

	const handleViewMore = (id: number) => {
		let newArrayEvents: BookingEventsListInterface[] = [];
		bookingEvents.forEach((event) => {
			if (event.id === id) {
				newArrayEvents.push({ ...event, expanded: !event.expanded });
			} else {
				newArrayEvents.push(event);
			}
			setbookingEvents(newArrayEvents);
		});
	};

	const handleICSAppointment = (
		appointmentInfo: BookingEventsListInterface
	) => {
		const date = appointmentInfo.date.split(' ')[1];
		const [day, month, year] = date.split('.');
		const [startHour, , endHour] = appointmentInfo.duration.split(' ');
		const timeStart = new Date('01/01/2007 ' + startHour);
		const timeEnd = new Date('01/01/2007 ' + endHour);
		const duration =
			(Math.abs(timeEnd.getTime() - timeStart.getTime()) / (1000 * 60)) %
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
			appointmentInfo.description +
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

		downloadICSFile(appointmentInfo.description, icsMSG);
	};

	const icsComponent = (event) => {
		return (
			<div
				className="bookingEvents--flex"
				onClick={handleICSAppointment.bind(this, event)}
			>
				<CalendarICSIcon />
				<Text
					type="standard"
					text={translate('message.appointmentSet.addToCalendar')}
					className="bookingEvents--primary"
				/>
			</div>
		);
	};

	const handleCancelAppointment = (event: BookingEventsListInterface) => {
		history.push({
			pathname: '/booking/cancelation',
			state: { uid: event.uid }
		});
	};

	const handleRescheduleAppointment = (event: BookingEventsListInterface) => {
		// TODO: add slug to the state, like this:
		// history.push({
		// 	pathname: '/booking/reschedule',
		// 	state: { uid: event.uid, slug: event.slug }
		// });
		history.push({
			pathname: '/booking/reschedule',
			state: { rescheduleLink: event.rescheduleLink, bookingId: event.id }
		});
	};

	const addMissingZero = (value: number) => {
		if (value < 10) {
			return '0' + value;
		} else {
			return value;
		}
	};

	useEffect(() => {
		const isConsultant = hasUserAuthority(
			AUTHORITIES.CONSULTANT_DEFAULT,
			userData
		);

		if (isConsultant) {
			apiGetConsultantAppointments(userData.userId).then((bookings) => {
				setbookingEventsApi(bookings);
			});
		} else {
			apiAppointmentsServiceBookingEventsByUserId(userData.userId).then(
				(bookings) => {
					setbookingEventsApi(bookings);
				}
			);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		let bookingEvents: BookingEventsListInterface[] = [];
		bookingEventsApi?.forEach((event: BookingEventsInterface) => {
			const startTime = new Date(event.startTime);
			const endTime = new Date(event.endTime);
			const date = `${getWeekDayFromPrefix(
				startTime.getDay()
			)}, ${startTime.getDate()}.${startTime.getMonth() + 1}.${startTime
				.getFullYear()
				.toString()
				.slice(-2)}`;
			const duration = `${addMissingZero(
				startTime.getUTCHours()
			)}:${addMissingZero(startTime.getUTCMinutes())} - ${addMissingZero(
				endTime.getUTCHours()
			)}:${addMissingZero(endTime.getUTCMinutes())}`;

			// TODO: add counselor
			bookingEvents.push({
				id: event.id,
				date,
				duration,
				counselor: event.consultantName,
				description: event.title,
				expanded: false,
				uid: event.uid,
				rescheduleLink: event.rescheduleLink
				// counselor: event.counselor
				// slug: event.slug
			});
		});
		setbookingEvents(bookingEvents);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [bookingEventsApi]);

	return (
		<div className="bookingEvents__wrapper">
			<div className="bookingEvents__header">
				<Headline
					text={translate('navigation.booking.events')}
					semanticLevel="2"
					className="bookingEvents__header--title"
				/>
				<Button
					item={buttonSetCancel}
					buttonHandle={handleBackButton}
					customIcon={<CalendarMonthPlus />}
					className="bookingEvents__headerButton"
				/>
				<div className="bookingEvents__calendar--mobile">
					<CalendarMonthPlus />
					<Text
						type="standard"
						text={translate('booking.mobile.calendar.label')}
					/>
				</div>
			</div>
			<div className="bookingEvents__innerWrapper">
				{bookingEvents?.map((event) => (
					<Box key={event.id}>
						<div className="bookingEvents__innerWrapper-event">
							<div className="bookingEvents__basicInformation">
								<div className="bookingEvents__group">
									<Headline
										text={event.date}
										semanticLevel="4"
										className="bookingEvents__date"
									></Headline>
									<Headline
										text={event.duration}
										semanticLevel="5"
										className="bookingEvents__duration"
									></Headline>
									<div className="bookingEvents__ics bookingEvents--flex bookingEvents--pointer">
										{icsComponent(event)}
									</div>
								</div>
								<div className="bookingEvents__group bookingEvents__counselorWrap">
									<Text
										text={translate(
											'booking.event.your.counselor'
										)}
										type="standard"
										className="bookingEvents__counselor bookingEvents--font-weight-bold"
									/>
									<Text
										text={event.counselor}
										type="standard"
										className="bookingEvents__counselorName"
									/>
									<div className="bookingEvents__video bookingEvents--flex">
										<VideoCalIcon />
										<Text
											type="infoLargeAlternative"
											text={'Videoberatung'}
										/>
									</div>
								</div>
								<div className="bookingEvents__group">
									<div className="bookingEvents__ics--mobile bookingEvents--flex bookingEvents--pointer">
										{icsComponent(event)}
									</div>
								</div>
							</div>
							<div
								className={`bookingEvents__description ${
									event.expanded ? 'expanded' : 'shrinked'
								}`}
							>
								<Text
									text={translate(
										'booking.event.description'
									)}
									type="standard"
									className="bookingEvents--font-weight-bold"
								/>
								<Text
									text={event.description}
									type="standard"
									className="bookingEvents__descriptionText"
								/>
								{event.description.length > 5 ? (
									<div
										className="bookingEvents__showMore bookingEvents--flex bookingEvents--pointer"
										onClick={handleViewMore.bind(
											this,
											event.id
										)}
									>
										{event.expanded ? (
											<ArrowUpIcon />
										) : (
											<ArrowDownIcon />
										)}
										<Text
											text={
												event.expanded
													? translate(
															'booking.event.show.less'
													  )
													: translate(
															'booking.event.show.more'
													  )
											}
											type="standard"
											className="bookingEvents--pointer bookingEvents--primary"
										/>
									</div>
								) : (
									<div />
								)}
							</div>
							<div className="bookingEvents__actions">
								<div
									className="bookingEvents--flex bookingEvents--align-items-center bookingEvents--pointer"
									onClick={handleRescheduleAppointment.bind(
										this,
										event
									)}
								>
									<CalendarRescheduleIcon />
									<Text
										type="standard"
										text={translate(
											'booking.event.booking.reschedule'
										)}
										className="bookingEvents--primary"
									/>
								</div>
								<div
									className="bookingEvents--flex bookingEvents--align-items-center bookingEvents--pointer"
									onClick={handleCancelAppointment.bind(
										this,
										event
									)}
								>
									<CalendarCancelIcon />
									<Text
										type="standard"
										text={translate(
											'booking.event.booking.cancel'
										)}
										className="bookingEvents--primary"
									/>
								</div>
							</div>
						</div>
					</Box>
				))}
				{bookingEvents.length === 0 && (
					<h1>No booking appointments...</h1>
				)}
			</div>
		</div>
	);
};
