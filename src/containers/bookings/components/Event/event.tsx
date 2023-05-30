import * as React from 'react';
import { useCallback, useContext } from 'react';
import { generatePath, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../booking.styles';
import { Box } from '../../../../components/box/Box';
import {
	Button,
	ButtonItem,
	BUTTON_TYPES
} from '../../../../components/button/Button';
import { Headline } from '../../../../components/headline/Headline';
import { Text } from '../../../../components/text/Text';
import { BookingEventUiInterface } from '../../../../globalState/interfaces/BookingsInterface';
import { BookingsStatus } from '../../../../utils/consultant';
import { BookingEventTableColumnAttendee } from '../BookingEventTableColumnAttendee/bookingEventTableColumnAttendee';
import { DownloadICSFile } from '../../../../components/downloadICSFile/downloadICSFile';
import { CopyIcon } from '../../../../resources/img/icons';
import { uiUrl, config } from '../../../../resources/scripts/config';
import { BookingDescription } from '../BookingDescription/bookingDescription';
import {
	AUTHORITIES,
	hasUserAuthority,
	NotificationsContext,
	NOTIFICATION_TYPE_SUCCESS,
	UserDataContext
} from '../../../../globalState';
import { copyTextToClipboard } from '../../../../utils/clipboardHelpers';
import { ReactComponent as CalendarRescheduleIcon } from '../../../../resources/img/icons/calendar-reschedule.svg';
import { ReactComponent as CalendarCancelIcon } from '../../../../resources/img/icons/calendar-cancel.svg';
import { LocationType } from './LocationType';

interface EventProps {
	event: BookingEventUiInterface;
	bookingStatus: BookingsStatus;
}

export const Event: React.FC<EventProps> = ({ event, bookingStatus }) => {
	const { t: translate } = useTranslation();
	const history = useHistory();
	const { addNotification } = useContext(NotificationsContext);
	const { userData } = useContext(UserDataContext);
	const isConsultant = hasUserAuthority(
		AUTHORITIES.CONSULTANT_DEFAULT,
		userData
	);

	const getLink = useCallback(
		(videoAppointmentId: string) => {
			return `${uiUrl}${generatePath(
				isConsultant
					? config.urls.consultantVideoConference
					: config.urls.videoConference,
				{
					type: 'app',
					appointmentId: videoAppointmentId
				}
			)}`;
		},
		[isConsultant]
	);

	const copyRegistrationLink = React.useCallback(
		async (videoAppointmentId: string) => {
			const url = getLink(videoAppointmentId);

			await copyTextToClipboard(url, () => {
				addNotification({
					notificationType: NOTIFICATION_TYPE_SUCCESS,
					title: translate(
						'booking.event.copy.link.notification.title'
					),
					text: translate('booking.event.copy.link.notification.text')
				});
			});
		},
		[addNotification, getLink, translate]
	);

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

	const handleVideoLink = (videoAppointmentId: string) => {
		window.open(getLink(videoAppointmentId));
	};

	const activeBookings = bookingStatus === BookingsStatus.ACTIVE;

	const startVideoCallButton: ButtonItem = {
		label: translate('booking.video.button.label'),
		type: BUTTON_TYPES.TERTIARY
	};

	return (
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
					</div>
					<div className="bookingEvents__group bookingEvents__counselorWrap">
						<BookingEventTableColumnAttendee event={event} />
						<LocationType event={event} />
					</div>
				</div>
				<BookingDescription description={event.description} />
				<div className="bookingEvents__actions">
					{activeBookings && (
						<div className="bookingEvents__ics--mobile bookingEvents--flex bookingEvents--pointer">
							<DownloadICSFile
								date={event.date}
								duration={event.duration}
								title={event.title}
							/>
						</div>
					)}
					{activeBookings && (
						<div className="bookingEvents--flex">
							<div
								className="bookingEvents--flex bookingEvents--align-items-center bookingEvents--pointer bookingEvents__reschedule"
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
								className="bookingEvents--flex bookingEvents--align-items-center bookingEvents--pointer bookingEvents__cancel"
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
					)}
					{event.videoAppointmentId && (
						<Button
							className="bookingEvents__video-button--mobile"
							buttonHandle={() =>
								handleVideoLink(event.videoAppointmentId)
							}
							item={startVideoCallButton}
						/>
					)}
				</div>
			</div>
			<div className="bookingEvents__video-link-grid">
				{activeBookings && (
					<div className="bookingEvents__ics bookingEvents--flex bookingEvents--pointer">
						<DownloadICSFile
							date={event.date}
							duration={event.duration}
							title={event.title}
						/>
					</div>
				)}

				{event.videoAppointmentId && (
					<>
						<div className="bookingEvents__video-link-grid-wrapper">
							<Button
								className="bookingEvents__video-div-grid-wrapper--text"
								item={{
									type: BUTTON_TYPES.LINK_INLINE,
									title: translate('booking.event.linkVideo'),
									label: translate('booking.event.linkVideo')
								}}
								buttonHandle={() =>
									copyRegistrationLink(
										event.videoAppointmentId
									)
								}
							/>
							<div>
								<CopyIcon
									className={'bookingEvents__copy icn--s'}
									onClick={() =>
										copyRegistrationLink(
											event.videoAppointmentId
										)
									}
								/>
							</div>
						</div>
						<Button
							className="bookingEvents__video-button"
							buttonHandle={() =>
								handleVideoLink(event.videoAppointmentId)
							}
							item={startVideoCallButton}
						/>
					</>
				)}
			</div>
		</Box>
	);
};
