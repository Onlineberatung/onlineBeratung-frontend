import React from 'react';
import { OverlayItem } from '../overlay/Overlay';
import { ReactComponent as XIcon } from '../../resources/img/illustrations/x.svg';
import { ReactComponent as Check } from '../../resources/img/illustrations/check.svg';
import { Headline } from '../headline/Headline';
import { BUTTON_TYPES } from '../button/Button';

export const bannedUserOverlay: OverlayItem = {
	svg: XIcon,
	illustrationBackground: 'large',
	headline: 'Sie wurden gebannt.', // TODO i18n
	copy: 'Sie haben gegen unsere Spielregeln im Chat verstoßen. Unsere Spielregeln stehen finden Sie immer auf der ersten Seite des Chats. Wenn Sie sich an die Regeln halten, heißt Sie Ihr_e Moderator_in wieder herzlich Willkommen.' // TODO i18n
};

export const banSuccessOverlay = (userName): OverlayItem => {
	return {
		svg: Check,
		illustrationBackground: 'large',
		nestedComponent: (
			<Headline
				text={'Sie haben <span>' + userName + '</span> gebannt.'}
				semanticLevel="3"
			/>
		), // TODO i18n
		buttonSet: [
			{
				type: BUTTON_TYPES.AUTO_CLOSE,
				label: 'Schliessen' // TODO i18n
			}
		]
	};
};
