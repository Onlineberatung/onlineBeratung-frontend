import * as React from 'react';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import { useTenant } from '../../globalState';
import './header.styles';
import { useTranslation } from 'react-i18next';
import { LocaleSwitch } from '../localeSwitch/LocaleSwitch';

export const Header = ({ showLocaleSwitch = false }) => {
	const { t: translate } = useTranslation();
	const tenant = useTenant();

	return (
		<header className="header">
			<Headline
				semanticLevel="2"
				text={tenant?.name || translate('app.title')}
			/>
			<div className="header__right">
				<Text
					type="standard"
					text={tenant?.content?.claim || translate('app.claim')}
				/>
				{showLocaleSwitch && <LocaleSwitch />}
			</div>
		</header>
	);
};
