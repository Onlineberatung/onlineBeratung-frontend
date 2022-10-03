import { Headline } from '../../headline/Headline';
import { Text } from '../../text/Text';
import * as React from 'react';
import { translate } from '../../../utils/translate';
import { Box } from '../../box/Box';
import { ReactComponent as NewWindowIcon } from '../../../resources/img/icons/new-window.svg';
import { ButtonItem, BUTTON_TYPES, Button } from '../../button/Button';
import { useAppConfig } from '../../../hooks/useAppConfig';
import { apiHasCalDavAccount } from '../../../api/apiGetCalDavAccount';
import { useEffect, useState } from 'react';

export const AvailabilityContainer = () => {
	const settings = useAppConfig();
	const [hasCalDavAccount, setHasCalDavAccount] = useState(false);

	const deleteAccountButton: ButtonItem = {
		label: translate('tools.calendar.button.label'),
		type: BUTTON_TYPES.TERTIARY
	};

	useEffect(() => {
		apiHasCalDavAccount().then(setHasCalDavAccount);
	}, []);

	return (
		<div className="availability__wrapper">
			{hasCalDavAccount && (
				<Box>
					<div className="tool__wrapper">
						<Headline
							text={translate('tools.calendar.title')}
							semanticLevel="5"
						/>
						<Text
							className="tool__wrapper__text"
							text={translate('tools.calendar.description')}
							type="standard"
						/>
						<Button
							className="tool__wrapper__button"
							item={deleteAccountButton}
							customIcon={<NewWindowIcon />}
							buttonHandle={() =>
								window.open(
									settings.calendarAppUrl,
									'_blank',
									'noopener'
								)
							}
						/>
					</div>
				</Box>
			)}
			<Box>
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
