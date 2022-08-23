import { Headline } from '../../headline/Headline';
import { Text } from '../../text/Text';
import { config } from '../../../resources/scripts/config';
import * as React from 'react';
import { translate } from '../../../utils/translate';

export const AvailabilityContainer = () => {
	return (
		<div className="settings-container-column">
			<div style={{ marginBottom: '20px' }}>
				<Headline
					className="pr--3"
					text={translate('booking.availability')}
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
