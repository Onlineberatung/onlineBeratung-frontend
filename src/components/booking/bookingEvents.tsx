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
import { ReactComponent as VideoCalIcon } from '../../resources/img/icons/video-call.svg';
import { Text } from '../text/Text';
import { Box } from '../box/Box';
import {
	AUTHORITIES,
	hasUserAuthority,
	SessionsDataContext,
	UserDataContext
} from '../../globalState';
import { BookingEventsInterface } from '../../globalState/interfaces/BookingDataInterface';
import { apiGetConsultantAppointments } from '../../api/apiGetConsultantAppointments';
import { apiAppointmentsServiceBookingEventsByAskerId } from '../../api';
import { BookingDescription } from './bookingDescription';
import { DownloadICSFile } from '../downloadICSFile/downloadICSFile';
import { addMissingZero } from '../../utils/dateHelpers';

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
	const { sessions } = useContext(SessionsDataContext);

	const isConsultant = hasUserAuthority(
		AUTHORITIES.CONSULTANT_DEFAULT,
		userData
	);

	const scheduleAppointmentButton: ButtonItem = {
		label: translate('booking.schedule'),
		type: BUTTON_TYPES.PRIMARY
	};

	const handleBookingButton = () => {
		history.push('/booking');
	};

	const [bookingEventsData, setBookingEventsData] = useState<
		BookingEventUiInterface[]
	>([] as BookingEventUiInterface[]);

	const handleCancellationAppointment = (event: BookingEventUiInterface) => {
		history.push({
			pathname: '/booking/cancellation',
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

	const noBookings = () => {
		return (
			<Box>
				<div className="bookingEvents__innerWrapper-no-bookings">
					<Headline
						className="bookingEvents__innerWrapper-no-bookings-title"
						text={translate('booking.my.booking.title')}
						semanticLevel="3"
					/>
					{!isConsultant && (
						<>
							<Text
								className="bookingEvents__innerWrapper-no-bookings-text"
								text={`${translate(
									'booking.my.booking.schedule'
								)} <b>
								${sessions?.[0]?.consultant?.username}</b>:`}
								type="standard"
							/>
							<Button
								item={scheduleAppointmentButton}
								buttonHandle={handleBookingButton}
								customIcon={<CalendarMonthPlusIcon />}
							/>
						</>
					)}
				</div>
			</Box>
		);
	};

	useEffect(() => {
		if (isConsultant) {
			apiGetConsultantAppointments(userData.userId).then((bookings) => {
				transformData(bookings);
			});
		} else {
			apiAppointmentsServiceBookingEventsByAskerId(userData.userId).then(
				(bookings) => {
					transformData(bookings);
				}
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const transformData = (bookings: BookingEventsInterface[]) => {
		let bookingEvents: BookingEventUiInterface[] = [];
		bookings?.forEach((event: BookingEventsInterface) => {
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
	};

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
						buttonHandle={handleBookingButton}
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
												<DownloadICSFile
													date={event.date}
													duration={event.duration}
													title={event.title}
												/>
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
												<DownloadICSFile
													date={event.date}
													duration={event.duration}
													title={event.title}
												/>
											</div>
										</div>
									</div>
									<BookingDescription
										description={event.description}
									/>
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
											onClick={handleCancellationAppointment.bind(
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
