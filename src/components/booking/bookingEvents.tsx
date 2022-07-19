import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { translate } from '../../utils/translate';
import {
	setBookingWrapperActive,
	setBookingWrapperInactive
} from '../app/navigationHandler';
import { Button, BUTTON_TYPES, ButtonItem } from '../button/Button';
import { Headline } from '../headline/Headline';
import './bookingEvents.styles';
import { history } from '../app/app';
import { ReactComponent as CalendarMonthPlusIcon } from '../../resources/img/icons/calendar-plus.svg';
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
	SessionsDataContext,
	UserDataContext
} from '../../globalState';
import { BookingEventsInterface } from '../../globalState/interfaces/BookingDataInterface';
import { apiGetConsultantAppointments } from '../../api/apiGetConsultantAppointments';
import {
	apiAppointmentsServiceBookingEventsByUserId,
	apiGetAskerSessionList
} from '../../api';

interface BookingEventUiInterface {
	id: number;
	rescheduleLink?: string;
	uid: string;
	date: string;
	duration: string;
	counselor: string;
	askerId: string;
	askerName: string;
	description: string;
	title: string;
	expanded: boolean;
}

function BookingEventTableColumnAttendee(params: {
	event: BookingEventUiInterface;
}) {
	const { userData } = useContext(UserDataContext);
	const isConsultant = hasUserAuthority(
		AUTHORITIES.CONSULTANT_DEFAULT,
		userData
	);
	return (
		<>
			<Text
				text={translate(
					isConsultant
						? 'booking.event.asker'
						: 'booking.event.your.counselor'
				)}
				type="standard"
				className="bookingEvents__counselor bookingEvents--font-weight-bold"
			/>
			<Text
				text={
					isConsultant
						? params.event.askerName
						: params.event.counselor
				}
				type="standard"
				className="bookingEvents__counselorName"
			/>
		</>
	);
}

export const BookingEvents = () => {
	useEffect(() => {
		setBookingWrapperActive();

		return () => {
			setBookingWrapperInactive();
		};
	}, []);

	const { userData } = useContext(UserDataContext);
	const sessionsContext = useContext(SessionsDataContext);
	const { sessionsData, setSessionsData } = sessionsContext;

	const isConsultant = hasUserAuthority(
		AUTHORITIES.CONSULTANT_DEFAULT,
		userData
	);

	const scheduleAppointmentButton: ButtonItem = {
		label: translate('booking.schedule'),
		type: BUTTON_TYPES.PRIMARY
	};

	//TODO Andre: what is this?
	const handleBackButton = () => {
		history.push('/booking');
	};

	//TODO Andre: remove this
	const [bookingEventsApi, setBookingEventsApi] = useState<
		BookingEventsInterface[] | null
	>(null);

	const [bookingEventsData, setBookingEventsData] = useState<
		BookingEventUiInterface[]
	>([] as BookingEventUiInterface[]);

	//TOOD Andre: move it to a separate component
	const handleViewMore = (id: number) => {
		let newArrayEvents: BookingEventUiInterface[] = [];
		bookingEventsData.forEach((event) => {
			if (event.id === id) {
				newArrayEvents.push({ ...event, expanded: !event.expanded });
			} else {
				newArrayEvents.push(event);
			}
			setBookingEventsData(newArrayEvents);
		});
	};

	//TODO Andre: make a utility function out of that
	// define a new type for BookingEventUiInterface and the other object from message panel inside
	// file that holds this utility function
	const handleICSAppointment = (appointmentInfo: BookingEventUiInterface) => {
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

	//TODO Andre: make a reusable component out of it. in this case downloadICSFile.ts can be also part
	// of this component
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

	//TODO Andre: canceltation vs cancellation
	const handleCancelAppointment = (event: BookingEventUiInterface) => {
		history.push({
			pathname: '/booking/cancelation',
			state: { uid: event.uid }
		});
	};

	const handleRescheduleAppointment = (event: BookingEventUiInterface) => {
		history.push({
			pathname: '/booking/reschedule',
			state: {
				rescheduleLink: event.rescheduleLink,
				bookingId: event.id,
				askerId: event.askerId
			}
		});
	};

	//TODO Andre: move it close to the code that does the transformation from response data to ui data
	const addMissingZero = (value: number) => {
		if (value < 10) {
			return '0' + value;
		} else {
			return value;
		}
	};

	//TODO Andre: think about non optimistic usecases :D
	const fetchAskerData = () => {
		return apiGetAskerSessionList()
			.then((response) => {
				setSessionsData({
					mySessions: response.sessions
				});
			})
			.catch((error) => {
				//TODO Andre: don't catch the error
				console.log(error);
			});
	};

	const noBookings = () => {
		return (
			<Box>
				<div className="bookingEvents__innerWrapper-no-bookings">
					<Headline
						className="bookingEvents__innerWrapper-no-bookings-title"
						text={translate('booking.my.booking.title')}
						semanticLevel="3"
					/>
					<Text
						className="bookingEvents__innerWrapper-no-bookings-text"
						text={`${translate('booking.my.booking.schedule')} <b>${
							sessionsData?.mySessions[0].consultant.username
						}</b>:`}
						type="standard"
					/>
					<Button
						item={scheduleAppointmentButton}
						buttonHandle={handleBackButton}
						customIcon={<CalendarMonthPlusIcon />}
					/>
				</div>
			</Box>
		);
	};

	useEffect(() => {
		//TODO Andre: check are we a consultant or asker
		// based on that call this session endpoint. since we need it only in case of asker

		if (isConsultant) {
			apiGetConsultantAppointments(userData.userId).then((bookings) => {
				//TODO Andre: do the transformation here
				setBookingEventsApi(bookings);
			});
		} else {
			apiAppointmentsServiceBookingEventsByUserId(userData.userId).then(
				(bookings) => {
					setBookingEventsApi(bookings);
				}
			);
		}

		//TODO Andre: replace this with impl.
		fetchAskerData().catch(() => {}); // Intentionally empty to prevent json parse errors

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		let bookingEvents: BookingEventUiInterface[] = [];
		bookingEventsApi?.forEach((event: BookingEventsInterface) => {
			const startTime = new Date(event.startTime);
			const endTime = new Date(event.endTime);
			const date = new Date(event.startTime).toLocaleDateString('de-de', {
				weekday: 'long',
				year: '2-digit',
				month: '2-digit',
				day: 'numeric'
			});
			const duration = `${addMissingZero(
				startTime.getUTCHours()
			)}:${addMissingZero(startTime.getUTCMinutes())} - ${addMissingZero(
				endTime.getUTCHours()
			)}:${addMissingZero(endTime.getUTCMinutes())}`;

			bookingEvents.push({
				id: event.id,
				date,
				title: event.title,
				duration,
				askerId: event.askerId,
				askerName: event.askerName,
				counselor: event.consultantName,
				description: event.description,
				expanded: false,
				uid: event.uid,
				rescheduleLink: event.rescheduleLink
			});
		});
		setBookingEventsData(bookingEvents);
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
				{!isConsultant && bookingEventsData.length > 0 && (
					<Button
						item={scheduleAppointmentButton}
						buttonHandle={handleBackButton}
						customIcon={<CalendarMonthPlusIcon />}
						className="bookingEvents__headerButton"
					/>
				)}
				{bookingEventsData.length > 0 && (
					<div className="bookingEvents__calendar--mobile">
						<CalendarMonthPlusIcon />
						<Text
							type="standard"
							text={translate('booking.mobile.calendar.label')}
						/>
					</div>
				)}
			</div>
			<div className="bookingEvents__innerWrapper">
				{bookingEventsData.length === 0
					? noBookings()
					: bookingEventsData?.map((event) => (
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
											<BookingEventTableColumnAttendee
												event={event}
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
											event.expanded
												? 'expanded'
												: 'shrinked'
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
										{event.description &&
										event.description.length > 105 ? (
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
			</div>
		</div>
	);
};
