import * as React from 'react';
import { Text } from '../text/Text';
import { translate } from '../../utils/translate';
import { useState } from 'react';
import { ReactComponent as ArrowUpIcon } from '../../resources/img/icons/arrow-up.svg';
import { ReactComponent as ArrowDownIcon } from '../../resources/img/icons/arrow-down.svg';

export const BookingDescription = (params: { description: string }) => {
	const [expanded, setExpanded] = useState(false);

	return (
		<div
			className={`bookingEvents__description ${
				expanded ? 'expanded' : 'shrinked'
			}`}
		>
			<Text
				text={translate('booking.event.description')}
				type="standard"
				className="bookingEvents--font-weight-bold"
			/>
			<Text
				text={params.description}
				type="standard"
				className="bookingEvents__descriptionText"
			/>
			{params.description && params.description.length > 135 ? (
				<div
					className="bookingEvents__showMore bookingEvents--flex bookingEvents--pointer"
					onClick={() => setExpanded(!expanded)}
				>
					{expanded ? <ArrowUpIcon /> : <ArrowDownIcon />}
					<Text
						text={
							expanded
								? translate('booking.event.show.less')
								: translate('booking.event.show.more')
						}
						type="standard"
						className="bookingEvents--pointer bookingEvents--primary"
					/>
				</div>
			) : (
				<div />
			)}
		</div>
	);
};
