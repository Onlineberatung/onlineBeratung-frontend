import * as React from 'react';
import { useContext, useEffect } from 'react';
import { translate } from '../../../../utils/translate';
import {
	setBookingWrapperActive,
	setBookingWrapperInactive
} from '../../../../components/app/navigationHandler';
import {
	Button,
	BUTTON_TYPES,
	ButtonItem
} from '../../../../components/button/Button';
import { Headline } from '../../../../components/headline/Headline';
import '../booking.styles';
import { history } from '../../../../components/app/app';
import { ReactComponent as CalendarMonthPlusIcon } from '../../../../resources/img/icons/calendar-plus.svg';
import { Text } from '../../../../components/text/Text';
import { NavLink, Redirect, Route, Switch } from 'react-router-dom';
import bookingRoutes from '../../booking.routes';
import {
	UserDataContext,
	useConsultingTypes,
	hasUserAuthority,
	AUTHORITIES
} from '../../../../globalState';
import {
	solveTabConditions,
	SingleComponentType,
	isTabGroup,
	solveCondition
} from '../../../../utils/tabsHelper';

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
		history.push({
			pathname: '/booking/',
			state: {
				isInitialMessage: false
			}
		});
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
						<div
							className="bookingEvents__nav"
							style={{ height: '100%' }}
						>
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
				{!isConsultant && (
					<Button
						item={scheduleAppointmentButton}
						buttonHandle={handleBookingButton}
						customIcon={<CalendarMonthPlusIcon />}
						className="bookingEvents__headerButton"
					/>
				)}
				{!isConsultant && (
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
								<div
									className="booking__content"
									style={{ height: '100%' }}
								>
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
