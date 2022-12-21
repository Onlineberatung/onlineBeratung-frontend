import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Headline } from '../../../../components/headline/Headline';
import { Text } from '../../../../components/text/Text';
import { Box } from '../../../../components/box/Box';
import { useAppConfig } from '../../../../hooks/useAppConfig';
import { useEffect, useState } from 'react';
import { apiHasCalDavAccount } from '../../../../api/apiGetCalDavAccount';
import { MyCalendar } from '../MyCalendar/myCalendar';

export const AvailabilityContainer = () => {
	const { t: translate } = useTranslation();
	const settings = useAppConfig();
	const [hasCalDavAccount, setHasCalDavAccount] = useState(false);

	useEffect(() => {
		apiHasCalDavAccount().then(setHasCalDavAccount);
	}, []);

	return (
		<div className="availability__wrapper">
			{hasCalDavAccount && <MyCalendar />}
			<Box>
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
				{settings.calcomUrl && (
					<iframe
						title={'AvailabilityContainer'}
						style={{ paddingRight: '20px' }}
						src={`${settings.calcomUrl}/availability`}
						frameBorder={0}
						scrolling="false"
						width="100%"
						height="80%"
					/>
				)}
			</Box>
		</div>
	);
};
