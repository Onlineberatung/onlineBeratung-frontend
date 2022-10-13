import * as React from 'react';
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
import { ReactComponent as NewWindowIcon } from '../../../../resources/img/icons/new-window.svg';
import { useAppConfig } from '../../../../hooks/useAppConfig';

export const MyCalendar = () => {
	const settings = useAppConfig();
	const { t: translate } = useTranslation();
	const deleteAccountButton: ButtonItem = {
		label: translate('tools.calendar.button.label'),
		type: BUTTON_TYPES.TERTIARY
	};
	return (
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
	);
};
