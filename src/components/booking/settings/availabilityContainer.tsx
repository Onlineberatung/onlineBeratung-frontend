import { Headline } from '../../headline/Headline';
import { Text } from '../../text/Text';
import { config } from '../../../resources/scripts/config';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

export const AvailabilityContainer = () => {
	const { t: translate } = useTranslation();

	return (
		<div className="settings-container-column">
			<div style={{ marginBottom: '20px' }}>
				<Headline
					className="pr--3"
					text={translate('booking.availability.title')}
					semanticLevel="5"
				/>
			</div>
			<div style={{ marginBottom: '20px' }}>
				<Text
					text={translate('booking.availability.description')}
					type="standard"
					className="tertiary"
				/>
			</div>

			<iframe
				title={'AvailabilityContainer'}
				style={{ paddingRight: '20px' }}
				src={`${config.urls.appointmentServiceDevServer}/availability`}
				frameBorder={0}
				scrolling="false"
				width="100%"
				height="80%"
			/>
		</div>
	);
};
