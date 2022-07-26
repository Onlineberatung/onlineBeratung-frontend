import * as React from 'react';
import { useContext, useEffect } from 'react';
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
import { BookingDescription } from './bookingDescription';
import { DownloadICSFile } from '../downloadICSFile/downloadICSFile';
import { Loading } from '../app/Loading';
import { BookingEventUiInterface } from '../../globalState/interfaces/BookingsInterface';
import { BookingsStatus } from '../../utils/consultant';

interface BookingsComponentProps {
	bookingEventsData: BookingEventUiInterface[];
	isLoading: boolean;
	bookingStatus: BookingsStatus;
}

export const BookingsComponent: React.FC<BookingsComponentProps> = ({
	bookingEventsData,
	isLoading,
	bookingStatus
}) => {
	useEffect(() => {
		setBookingWrapperActive();

		return () => {
			setBookingWrapperInactive();
		};
	}, []);

	const activeBookings = bookingStatus === BookingsStatus.ACTIVE;

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

	const BookingEventTableColumnAttendee = (params: {
		event: BookingEventUiInterface;
	}) => {
		const showAskerName = params.event.askerName
			? params.event.askerName
			: '-';
		const showCounselorName = params.event.counselor
			? params.event.counselor
			: '-';
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
					text={isConsultant ? showAskerName : showCounselorName}
					type="standard"
					className="bookingEvents__counselorName"
				/>
			</>
		);
	};

	const bookingsToShow = () => {
		return (
			<>
				{bookingEventsData.length === 0
					? noBookings()
					: bookingEvents()}
			</>
		);
	};

	const bookingEvents = () => {
		return (
			<>
				{bookingEventsData?.map((event) => (
					<Box key={event.id}>
						<div
							className={`bookingEvents__innerWrapper-event ${
								bookingStatus !== BookingsStatus.ACTIVE
									? 'bookingEvents__innerWrapper-no-actions'
									: ''
							}`}
						>
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
									{activeBookings && (
										<div className="bookingEvents__ics bookingEvents--flex bookingEvents--pointer">
											<DownloadICSFile
												date={event.date}
												duration={event.duration}
												title={event.title}
											/>
										</div>
									)}
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
									{activeBookings && (
										<div className="bookingEvents__ics--mobile bookingEvents--flex bookingEvents--pointer">
											<DownloadICSFile
												date={event.date}
												duration={event.duration}
												title={event.title}
											/>
										</div>
									)}
								</div>
							</div>
							<BookingDescription
								description={event.description}
							/>
							<div className="bookingEvents__actions">
								{activeBookings && (
									<>
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
									</>
								)}
							</div>
						</div>
					</Box>
				))}
			</>
		);
	};

	return <>{isLoading ? <Loading /> : bookingsToShow()}</>;
};
