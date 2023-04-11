import React, { useCallback, useContext, useEffect, useState } from 'react';
import { generatePath } from 'react-router-dom';
import { BookingEventsInterface } from '../../../../globalState/interfaces/BookingsInterface';
import {
	convertUTCDateToLocalDate,
	formatToHHMM,
	getPrettyDateFromMessageDate,
	prettyPrintTimeDifference
} from '../../../../utils/dateHelpers';
import { ReactComponent as CameraOnIcon } from '../../../../resources/img/icons/camera-on.svg';
import './booking-event.styles.scss';
import { uiUrl } from '../../../../resources/scripts/config';
import {
	AUTHORITIES,
	hasUserAuthority,
	UserDataContext
} from '../../../../globalState';
import { useAppConfig } from '../../../../hooks/useAppConfig';
import {
	Button,
	ButtonItem,
	BUTTON_TYPES
} from '../../../../components/button/Button';
import { useTranslation } from 'react-i18next';

interface BookingEventProps {
	booking: BookingEventsInterface;
}

const COUNTDOWN_START = 5 * 60 * 1000;

export const BookingEvent = ({ booking }: BookingEventProps) => {
	const settings = useAppConfig();
	const { t: translate } = useTranslation();
	const { userData } = useContext(UserDataContext);

	const startTime = new Date(
		convertUTCDateToLocalDate(new Date(booking.startTime))
	);
	const endTime = new Date(
		convertUTCDateToLocalDate(new Date(booking.endTime))
	);
	const showCountDown = startTime.getTime() - Date.now() < COUNTDOWN_START;
	const [countdown, setCountdown] = useState(showCountDown && Date.now());

	const isConsultant = hasUserAuthority(
		AUTHORITIES.CONSULTANT_DEFAULT,
		userData
	);

	useEffect(() => {
		if (showCountDown) {
			const rel = setInterval(() => setCountdown(Date.now()), 5000);
			return () => clearInterval(rel);
		}
	}, [showCountDown]);

	const getLink = useCallback(
		(videoAppointmentId: string) => {
			return `${uiUrl}${generatePath(
				isConsultant
					? settings.urls.consultantVideoConference
					: settings.urls.videoConference,
				{
					type: 'app',
					appointmentId: videoAppointmentId
				}
			)}`;
		},
		[
			isConsultant,
			settings.urls.consultantVideoConference,
			settings.urls.videoConference
		]
	);

	const handleVideoLink = useCallback(
		(videoAppointmentId: string) => {
			window.open(getLink(videoAppointmentId));
		},
		[getLink]
	);

	const startVideoCallButton: ButtonItem = {
		label: translate('overview.start'),
		type: BUTTON_TYPES.PRIMARY,
		smallIconBackgroundColor: 'secondary'
	};

	const prettyDate =
		!showCountDown &&
		getPrettyDateFromMessageDate(startTime.getTime() / 1000);

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

				{showCountDown && (
					<>
						<div className="bookingEvent__fullDate">
							{prettyPrintTimeDifference(
								countdown,
								startTime.getTime(),
								true
							)}
						</div>
						<Button
							className="bookingEvent__start"
							buttonHandle={() =>
								handleVideoLink(booking.videoAppointmentId)
							}
							item={startVideoCallButton}
						/>
					</>
				)}

				{!showCountDown && (
					<div className="bookingEvent__fullDate">
						{prettyDate.str
							? translate(prettyDate.str)
							: prettyDate.date}
						,{formatToHHMM(startTime.getTime() + '')} -{' '}
						{formatToHHMM(endTime.getTime() + '')}
					</div>
				)}
			</div>
		</div>
	);
};
