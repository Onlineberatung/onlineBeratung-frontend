import React from 'react';
import { BookingEventsInterface } from '../../../../globalState/interfaces/BookingsInterface';
import {
	formatToHHMM,
	getPrettyDateFromMessageDate,
	prettyPrintTimeDifference
} from '../../../../utils/dateHelpers';
import { ReactComponent as CameraOnIcon } from '../../../../resources/img/icons/camera-on.svg';
import './booking-event.styles.scss';

interface BookingEventProps {
	booking: BookingEventsInterface;
}

const COUNTDOWN_START = 5 * 60 * 1000;

export const BookingEvent = ({ booking }: BookingEventProps) => {
	const startTime = new Date(booking.startTime);
	const endTime = new Date(booking.endTime);

	const showCountDown = startTime.getTime() - Date.now() < COUNTDOWN_START;

	return (
		<div className="bookingEvent">
			<div className="bookingEvent__header">
				<div className="bookingEvent__askerName">
					{booking.askerName}
				</div>
			</div>

			<div className="bookingEvent__date">
				<div className="bookingEvent__icon">
					<CameraOnIcon />
				</div>

				{showCountDown &&
					prettyPrintTimeDifference(
						new Date(booking.startTime).getTime(),
						Date.now()
					)}

				{!showCountDown && (
					<div className="bookingEvent__fullDate">
						{getPrettyDateFromMessageDate(
							startTime.getTime() / 1000
						)}
						,{formatToHHMM(startTime.getTime() + '')} -{' '}
						{formatToHHMM(endTime.getTime() + '')}
					</div>
				)}
			</div>
		</div>
	);
};
