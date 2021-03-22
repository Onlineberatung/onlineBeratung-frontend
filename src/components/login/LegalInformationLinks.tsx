import * as React from 'react';
import { translate } from '../../resources/scripts/i18n/translate';
import { Text } from '../text/Text';
import './legalInformationLinks.styles';

export const LegalInformationLinks = () => {
	return (
		<div className="legalInformationLinks">
			<Text
				text={translate('login.legal.infoText.impressum')}
				type={'infoSmall'}
			/>
			<Text
				text={translate('login.legal.infoText.divider')}
				type={'infoSmall'}
			/>
			<Text
				text={translate('login.legal.infoText.dataprotection')}
				type={'infoSmall'}
			/>
		</div>
	);
};
