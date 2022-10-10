import * as React from 'react';
import { useContext } from 'react';
import { translate } from '../../../../utils/translate';
import { Text } from '../../../../components/text/Text';
import {
	AUTHORITIES,
	hasUserAuthority,
	UserDataContext
} from '../../../../globalState';
import { BookingEventUiInterface } from '../../../../globalState/interfaces/BookingsInterface';

interface BookingsComponentProps {
	event: BookingEventUiInterface;
}

export const BookingEventTableColumnAttendee: React.FC<BookingsComponentProps> =
	({ event }) => {
		const { userData } = useContext(UserDataContext);

		const isConsultant = hasUserAuthority(
			AUTHORITIES.CONSULTANT_DEFAULT,
			userData
		);
		const showAskerName = event.askerName ? event.askerName : '-';
		const showCounselorName = event.counselor ? event.counselor : '-';

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
