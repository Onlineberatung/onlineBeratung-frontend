import * as React from 'react';
import { useEffect, useState } from 'react';
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

interface BookingEventsInterface {
	id: number;
	date: string;
	duration: string;
	counselor: string;
	description: string;
	expanded: boolean;
}

export const BookingEvents = () => {
	debugger;
	useEffect(() => {
		setBookingWrapperActive();

		return () => {
			setBookingWrapperInactive();
		};
	}, []);

	const buttonSetCancel: ButtonItem = {
		label: translate('booking.schedule'),
		type: BUTTON_TYPES.PRIMARY
	};

	const handleBackButton = () => {
		history.push('/booking');
	};

	const getMessageDate = () => {
		return (
			<div className="messageItem__divider">
				<Text text={'Diese Woche'} type="divider" />
			</div>
		);
	};

	const fakeData: BookingEventsInterface[] = [
		{
			id: 1,
			date: 'Mittwoch, 29.06.22',
			duration: '11:30 - 12:00',
			counselor: 'Max Musrermann',
			description:
				'Vivamus a molestie ex, nec tincidunt diam. Quisque posuere lorem libero, ultrices cursus lorem rhoncus vitae. Fusce rutrum elementum imperdiet. Nulla pulvinar ex urna, sit amet rutrum risus mattis vitae. Morbi ac convallis quam. Fusce mollis laoreet dolor et blandit. Sed sem lorem, auctor tempus commodo a, semper ut felis. In hac habitasse platea dictumst. Proin bibendum, libero fringilla vestibulum malesuada, magna nibh mollis mi, eget gravida ante tortor vitae odio. Etiam imperdiet eros felis. In volutpat non turpis sit amet finibus. Donec facilisis nisi eu sem pharetra, vitae interdum massa suscipit. Aenean volutpat nulla eget ornare sodales. Quisque rhoncus euismod euismod. Phasellus at nibh in nisl fermentum pellentesque quis et neque.',
			expanded: false
		},
		{
			id: 2,
			date: 'Freitag, 05.07.22',
			duration: '11:30 - 12:00',
			counselor: 'Max Musrermann',
			description:
				'Ihre Nachricht zum Termin Lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim cididunt ut labore et dolcididunt ut labore et dol Aliquam sed justo convallis, lobortis ante vel, pellentesque lectus. Etiam semper ligula a tortor ornare, semper varius dui ullamcorper. Donec a viverra massa. Vestibulum malesuada sem sit amet orci efficitur, ac vestibulum nunc imperdiet. Ut rutrum egestas purus, ullamcorper ultrices dui maximus non. Proin maximus pulvinar mauris, tristique dapibus nunc dapibus sit amet. Suspendisse in vestibulum metus. Suspendisse luctus urna et nunc dictum, nec tempus sapien iaculis. Pellentesque velit nibh, ultricies nec nulla nec, sagittis cursus sem. Fusce ac leo eget odio sollicitudin pulvinar a in dui. Proin varius nulla varius, aliquam augue quis, pretium purus. Ut vehicula purus sit amet ligula efficitur, sit amet pulvinar metus aliquet.',
			expanded: false
		},
		{
			id: 3,
			date: 'Donnerstag, 18.07.22',
			duration: '11:30 - 12:00',
			counselor: 'Max Musrermann',
			description:
				'Etiam dictum vel nunc ac bibendum. Nam suscipit mauris ex. Nullam ut elit ac magna tincidunt tempus a a ante. Suspendisse eget ligula varius, vulputate lorem nec, commodo velit. Quisque aliquam, magna non vestibulum convallis, justo lectus molestie massa, eu iaculis purus nibh et quam. Sed vitae neque eget magna accumsan pharetra. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam rutrum semper lacus accumsan tincidunt.',
			expanded: false
		}
	];

	const [bookingEvents, setbookingEvents] = useState<
		BookingEventsInterface[] | null
	>(fakeData);

	const handleViewMore = (id: number) => {
		let newArrayEvents: BookingEventsInterface[] = [];
		bookingEvents.forEach((event) => {
			if (event.id === id) {
				newArrayEvents.push({ ...event, expanded: !event.expanded });
			} else {
				newArrayEvents.push(event);
			}
			setbookingEvents(newArrayEvents);
		});
	};

	const handleICSAppointment = (appointmentInfo) => {
		const icsMSG =
			'BEGIN:VCALENDAR\n' +
			'VERSION:2.0\n' +
			'CALSCALE:GREGORIAN\n' +
			'PRODID:adamgibbons/ics\n' +
			'METHOD:PUBLISH\n' +
			'X-PUBLISHED-TTL:PT1H\n' +
			'BEGIN:VEVENT\n' +
			'SUMMARY:Team B Event 2 zwischen Team B und Andre Soares\n' +
			'DTSTART:20220704T080000Z\n' +
			'DURATION:PT15M\n' +
			'END:VEVENT\n' +
			'END:VCALENDAR\n';

		downloadICSFile(
			'Team B Event 2 zwischen Team B und Andre Soares',
			icsMSG
		);
	};

	const icsComponent = (event: BookingEventsInterface) => {
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

	const handleCancelAppointment = () => {
		history.push('/booking/cancelation');
	};

	const handleRescheduleAppointment = () => {
		history.push('/booking/reschedule');
	};

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
				{getMessageDate()}
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
							</div>
							<div className="bookingEvents__actions">
								<div
									className="bookingEvents--flex bookingEvents--align-items-center bookingEvents--pointer"
									onClick={handleRescheduleAppointment}
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
									onClick={handleCancelAppointment}
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
