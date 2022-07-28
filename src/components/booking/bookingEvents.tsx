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
import { Text } from '../text/Text';
import {
	AUTHORITIES,
	hasUserAuthority,
	useConsultingTypes,
	UserDataContext
} from '../../globalState';
import {
	BookingEventsInterface,
	BookingEventUiInterface
} from '../../globalState/interfaces/BookingsInterface';
import { NavLink, Redirect, Route, Switch } from 'react-router-dom';
import bookingRoutes from './booking.routes';
import { BookingsStatus } from '../../utils/consultant';
import { apiGetConsultantAppointments } from '../../api/apiGetConsultantAppointments';
import { apiAppointmentsServiceBookingEventsByAskerId } from '../../api';
import {
	solveTabConditions,
	isTabGroup,
	solveCondition,
	SingleComponentType
} from '../../utils/tabsHelper';
import { transformBookingData } from '../../utils/transformBookingData';

export const BookingEvents = () => {
	useEffect(() => {
		setBookingWrapperActive();

		return () => {
			setBookingWrapperInactive();
		};
	}, []);

	const { userData } = useContext(UserDataContext);

	const consultingTypes = useConsultingTypes();

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

	useEffect(() => {
		if (isConsultant) {
			apiGetConsultantAppointments(
				userData.userId,
				BookingsStatus.ACTIVE
			).then((bookings) => {
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
		const bookingEvents = transformBookingData(bookings);
		setBookingEventsData(bookingEvents);
	};

	return (
		<div className="bookingEvents__wrapper">
			<div
				className={`bookingEvents__header ${
					isConsultant ? 'bookingEvents__header-consultant' : ''
				}`}
			>
				<Headline
					text={translate('navigation.booking.events')}
					semanticLevel="2"
					className="bookingEvents__header--title"
				/>
				{isConsultant && (
					<>
						<div className="bookingEvents__nav">
							{bookingRoutes.map((tab) => (
								<div
									key={tab.url}
									className="text--nowrap flex__col--no-grow"
								>
									<NavLink
										to={`/booking/events${tab.url}`}
										activeClassName="active"
									>
										{tab.title}
									</NavLink>
								</div>
							))}
						</div>
						<div />
					</>
				)}
				{!isConsultant && bookingEventsData.length > 0 && (
					<Button
						item={scheduleAppointmentButton}
						buttonHandle={handleBookingButton}
						customIcon={<CalendarMonthPlusIcon />}
						className="bookingEvents__headerButton"
					/>
				)}
				{!isConsultant && bookingEventsData.length > 0 && (
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
				<Switch>
					{bookingRoutes
						.filter((tab) =>
							solveTabConditions(tab, userData, consultingTypes)
						)
						.map((tab) => (
							<Route
								path={`/booking/events${tab.url}`}
								key={`/booking/events${tab.url}`}
							>
								<div className="booking__content">
									{tab.elements
										.reduce(
											(
												acc: SingleComponentType[],
												element
											) =>
												acc.concat(
													isTabGroup(element)
														? element.elements
														: element
												),
											[]
										)
										.filter((element) =>
											solveCondition(
												element.condition,
												userData,
												consultingTypes
											)
										)
										.map((element, i) => (
											<element.component key={i} />
										))}
								</div>
							</Route>
						))}
					<Redirect to={`/booking/events${bookingRoutes[0].url}`} />
				</Switch>
			</div>
		</div>
	);
};
