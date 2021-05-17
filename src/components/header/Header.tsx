import * as React from 'react';
import { translate } from '../../utils/translate';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import './header.styles';

export const Header = () => {
	return (
		<header className="header">
			<Headline semanticLevel="2" text={translate('app.title')} />
			<Text type="standard" text={translate('app.claim')} />
		</header>
	);
};
