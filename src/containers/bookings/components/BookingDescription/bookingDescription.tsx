import * as React from 'react';
import { Text } from '../../../../components/text/Text';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export const BookingDescription = (params: { description: string }) => {
	const { t: translate } = useTranslation();
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
					{expanded ? (
						<ArrowUpIcon
							aria-label={translate('app.close')}
							titleAccess={translate('app.close')}
							className="tertiary"
						/>
					) : (
						<ArrowDownIcon
							aria-label={translate('app.open')}
							titleAccess={translate('app.open')}
							className="tertiary"
						/>
					)}
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
