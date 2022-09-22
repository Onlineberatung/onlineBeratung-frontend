import { Headline } from '../../headline/Headline';
import { Text } from '../../text/Text';
import { config } from '../../../resources/scripts/config';
import * as React from 'react';
import { translate } from '../../../utils/translate';
import { Box } from '../../box/Box';
import { ReactComponent as NewWindowIcon } from '../../../resources/img/icons/new-window.svg';
import { ButtonItem, BUTTON_TYPES, Button } from '../../button/Button';
import { useAppConfig } from '../../../hooks/useAppConfig';

export const AvailabilityContainer = () => {
	const settings = useAppConfig();

	const deleteAccountButton: ButtonItem = {
		label: translate('tools.button.label'),
		type: BUTTON_TYPES.TERTIARY
	};

	return (
		<div className="availability__wrapper">
			<Box>
				<div className="tool__wrapper">
					<Headline text={'Mein Kalender'} semanticLevel="5" />
					<Text
						className="tool__wrapper__text"
						text={`Tragen Sie Ihre Urlaube oder sonstigen Termine in den Kalender ein, sodass die Ratsuchenden in dieser Zeit keine Termine bei Ihnen buchen können.
						Melden Sie sich mit der gleichen E-mail Adresse und Passwort an, das Sie auch hier bei der Online Beratung verwenden.`}
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

				<iframe
					title={'AvailabilityContainer'}
					src={`${config.urls.appointmentServiceDevServer}/availability`}
					frameBorder={0}
					scrolling="false"
					width="100%"
					height="80%"
				/>
			</Box>
		</div>
	);
};
