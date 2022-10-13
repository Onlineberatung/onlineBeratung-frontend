import { ReactComponent as ErrorIllustration } from '../../../resources/img/illustrations/not-found.svg';
import { Headline } from '../../headline/Headline';
import { Text } from '../../text/Text';
import { Button, BUTTON_TYPES, ButtonItem } from '../../button/Button';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

type ErrorProps = {
	error?: {
		title: string;
		description?: string;
	};
};

export const Error = ({ error }: ErrorProps) => {
	const { t: translate } = useTranslation();

	const reloadButton: ButtonItem = {
		label: translate('videoConference.waitingroom.errorPage.button'),
		type: BUTTON_TYPES.PRIMARY
	};

	const handleReloadButton = () => {
		window.location.reload();
	};

	return (
		<>
			<div className="waitingRoom__illustration">
				<ErrorIllustration className="waitingRoom__waitingIllustration" />
			</div>
			<div>
				<Headline
					className="waitingRoom__headline"
					semanticLevel="1"
					text={translate(error.title)}
				/>
				{error.description && (
					<Text type="standard" text={translate(error.description)} />
				)}
				<Button
					className="waitingRoom__button"
					buttonHandle={handleReloadButton}
					item={reloadButton}
				/>
			</div>
		</>
	);
};
