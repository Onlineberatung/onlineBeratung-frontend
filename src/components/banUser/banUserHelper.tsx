import React from 'react';
import { OverlayItem } from '../overlay/Overlay';
import { ReactComponent as XIcon } from '../../resources/img/illustrations/x.svg';
import { ReactComponent as Check } from '../../resources/img/illustrations/check.svg';
import { Headline } from '../headline/Headline';
import { BUTTON_TYPES } from '../button/Button';
import { translate } from '../../utils/translate';

export const bannedUserOverlay: OverlayItem = {
	svg: XIcon,
	illustrationBackground: 'large',
	headline: translate('banUser.banned.headline'),
	copy: translate('banUser.banned.info')
};

export const banSuccessOverlay = (userName): OverlayItem => {
	const compositeText =
		translate('banUser.ban.info.1') +
		'<span>' +
		userName +
		'</span>' +
		translate('banUser.ban.info.2');
	return {
		svg: Check,
		illustrationBackground: 'large',
		nestedComponent: <Headline text={compositeText} semanticLevel="3" />,
		buttonSet: [
			{
				type: BUTTON_TYPES.AUTO_CLOSE,
				label: translate('banUser.ban.overlay.close')
			}
		]
	};
};
