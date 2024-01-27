import * as React from 'react';
import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
	Button,
	BUTTON_TYPES,
	ButtonItem
} from '../../../../components/button/Button';
import { Headline } from '../../../../components/headline/Headline';
import '../booking.styles';
import { ReactComponent as CalendarMonthPlusIcon } from '../../../../resources/img/icons/calendar-plus.svg';
import { Text } from '../../../../components/text/Text';
import { Box } from '../../../../components/box/Box';
import {
	AUTHORITIES,
	hasUserAuthority,
	UserDataContext
} from '../../../../globalState';
import { ListItemInterface } from '../../../../globalState/interfaces';

interface NoBookings {
	sessions: ListItemInterface[];
}

export const NoBookingsBooked: React.FC<NoBookings> = ({ sessions }) => {
	const { t: translate } = useTranslation();
	const history = useHistory();
	const { userData } = useContext(UserDataContext);

	const isConsultant = hasUserAuthority(
		AUTHORITIES.CONSULTANT_DEFAULT,
		userData
	);

	const scheduleAppointmentButton: ButtonItem = {
		label: translate('booking.schedule'),
		type: BUTTON_TYPES.PRIMARY
	};

	const handleBookingButton = () => {
		history.push('/booking/');
	};

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
                            ${sessions
								?.filter((session) => session.agency !== null)
								?.map(
									({ consultant }) =>
										consultant.displayName ||
										consultant.username
								)}</b>:`}
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
