import * as React from 'react';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import { useContext } from 'react';
import { TenantContext } from '../../globalState';
import './header.styles';
import { useTranslation } from 'react-i18next';

export const Header = () => {
	const { t: translate } = useTranslation();
	const { tenant } = useContext(TenantContext);
	return (
		<header className="header">
			<Headline
				semanticLevel="2"
				text={tenant?.name || translate('app.title')}
			/>
			<Text
				type="standard"
				text={tenant?.content?.claim || translate('app.claim')}
			/>
		</header>
	);
};
