import * as React from 'react';
import { Header } from '../header/Header';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import './waitingRoom.styles';
import { ReactComponent as WelcomeIllustration } from '../../resources/img/illustrations/willkommen.svg';
import { translate } from '../../resources/scripts/i18n/translate';
import { useEffect } from 'react';
import { endpointPort, tld } from '../../resources/scripts/config';

export interface WaitingRoomProps {
	consultingTypeSlug: string;
}

export const WaitingRoom = (props: WaitingRoomProps) => {
	useEffect(() => {
		// make conversations/askers/anonymous/new call
	}, []);

	const getRedirectText = () => {
		const url = `${tld + endpointPort}/${
			props.consultingTypeSlug
		}/registration`;

		return `
			${translate('anonymous.waitingroom.redirect.prefix')}<br>
			<a href="${url}">${translate('anonymous.waitingroom.redirect.link')}</a>
			${translate('anonymous.waitingroom.redirect.suffix')}
		`;
	};

	return (
		<div className="waitingRoom">
			<Header />
			<div className="waitingRoom__illustration">
				<WelcomeIllustration />
			</div>
			<Headline
				className="waitingRoom__headline"
				semanticLevel="3"
				text={translate('anonymous.waitingroom.headline')}
			/>
			<Text
				className="waitingRoom__description"
				type="standard"
				text={translate('anonymous.waitingroom.description')}
			/>
			<Text
				className="waitingRoom__redirect"
				type="standard"
				text={getRedirectText()}
			/>
		</div>
	);
};
