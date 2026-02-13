import * as React from 'react';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import NewWindowIcon from '../../resources/img/icons/new-window.svg?react';
import PersonsTwoIcon from '../../resources/img/icons/persons-two-google.svg?react';
import './tools.styles.scss';
import { ToolsListInterface } from '../../globalState/interfaces/ToolsInterface';
import { useTranslation } from 'react-i18next';

export const Tool = (params: ToolsListInterface) => {
	const { t: translate } = useTranslation();

	const deleteAccountButton: ButtonItem = {
		label: translate('tools.button.label'),
		type: BUTTON_TYPES.TERTIARY
	};

	return (
		<div className="tool__wrapper">
			<Headline text={params.title} semanticLevel="5" />
			{params.shared && (
				<div className="tool__wrapper__share">
					<PersonsTwoIcon />
					<Text text={translate('tools.shared')} type="infoSmall" />
				</div>
			)}
			<Text
				className="tool__wrapper__text"
				text={params.description}
				type="standard"
			/>
			<Button
				className="tool__wrapper__button"
				item={deleteAccountButton}
				customIcon={<NewWindowIcon />}
				buttonHandle={() =>
					window.open(params.buttonLink, '_blank', 'noopener')
				}
			/>
		</div>
	);
};
