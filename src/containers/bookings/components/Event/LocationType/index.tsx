import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '../../../../../components/text/Text';
import { Tooltip } from '../../../../../components/tooltip/Tooltip';
import {
	AUTHORITIES,
	hasUserAuthority,
	UserDataContext
} from '../../../../../globalState';
import { BookingEventUiInterface } from '../../../../../globalState/interfaces/BookingsInterface';
import { InfoIcon } from '../../../../../resources/img/icons';
import { ReactComponent as VideoCalIcon } from '../../../../../resources/img/icons/video-booking.svg';
import { ReactComponent as CallIcon } from '../../../../../resources/img/icons/call.svg';
import { ReactComponent as LocationIcon } from '../../../../../resources/img/icons/location.svg';
import { ReactComponent as ChatIcon } from '../../../../../resources/img/icons/chat-booking.svg';

export const LocationType = ({ event }: { event: BookingEventUiInterface }) => {
	const { t: translate } = useTranslation();
	const { userData } = useContext(UserDataContext);
	const isConsultant = hasUserAuthority(
		AUTHORITIES.CONSULTANT_DEFAULT,
		userData
	);

	return (
		<div className="bookingEvents__video">
			<div className="">
				<div className="bookingEvents__locationTypeTitle">
					<Text
						text={translate('booking.event.appointmentType')}
						type="standard"
						className="bookingEvents__counselor bookingEvents--font-weight-bold"
					/>
					<Tooltip trigger={<InfoIcon className="icn icn--xl" />}>
						{translate(
							`booking.event.tooltip.${
								isConsultant ? 'consultant' : 'adviceSeeker'
							}`
						)}
					</Tooltip>
				</div>
				<div className="bookingEvents__video-label">
					{(event.location === 'PHONE_CALL' ||
						event.location === 'USER_PHONE') && <CallIcon />}
					{(event.location === 'VIDEO_CALL' ||
						event.location === 'LINK') && <VideoCalIcon />}
					{event.location === 'IN_PERSON' && <LocationIcon />}
					{event.location === 'CHAT' && <ChatIcon />}
					<Text
						type="infoLargeAlternative"
						text={translate(
							`booking.event.location.${event.location}`
						)}
					/>
				</div>
			</div>
		</div>
	);
};
