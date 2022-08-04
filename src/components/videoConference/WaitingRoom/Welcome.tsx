import { ReactComponent as WelcomeIllustration } from '../../../resources/img/illustrations/welcome.svg';
import { Headline } from '../../headline/Headline';
import { Text } from '../../text/Text';
import { Button, BUTTON_TYPES, ButtonItem } from '../../button/Button';
import * as React from 'react';
import { LegalLinkInterface } from '../../../globalState';
import { useTranslation } from 'react-i18next';

export const Welcome = ({
	onClick,
	legalLinks
}: {
	onClick: Function;
	legalLinks: Array<LegalLinkInterface>;
}) => {
	const { t: translate } = useTranslation();

	const confirmButton: ButtonItem = {
		label: translate('anonymous.waitingroom.dataProtection.button'),
		type: BUTTON_TYPES.PRIMARY
	};

	return (
		<>
			<div className="waitingRoom__illustration">
				<WelcomeIllustration />
			</div>
			<div>
				<Headline
					className="waitingRoom__headline"
					semanticLevel="1"
					text={translate(
						'videoConference.waitingroom.dataProtection.headline'
					)}
				/>
				<Headline
					className="waitingRoom__subline"
					semanticLevel="3"
					text={translate(
						'videoConference.waitingroom.dataProtection.subline'
					)}
				/>
				<Text
					type="standard"
					text={translate(
						'videoConference.waitingroom.dataProtection.description'
					)}
				/>
				<Text
					type="standard"
					text={translate(
						'videoConference.waitingroom.dataProtection.label',
						{
							legal_links: legalLinks
								.filter((legalLink) => legalLink.registration)
								.map(
									(legalLink, index, { length }) =>
										(index > 0
											? index < length - 1
												? ', '
												: translate(
														'registration.dataProtection.label.and'
												  )
											: '') +
										`<a target="_blank" href="${legalLink.url}">${legalLink.label}</a>`
								)
								.join('')
						}
					)}
				/>
				<Button
					className="waitingRoom__button"
					buttonHandle={onClick}
					item={confirmButton}
				/>
			</div>
		</>
	);
};
