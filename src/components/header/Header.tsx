import * as React from 'react';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import { useContext } from 'react';
import { TenantContext } from '../../globalState';
import './header.styles';
import { useTranslation } from 'react-i18next';
import { LocaleSwitch } from '../localeSwitch/LocaleSwitch';
import { useAtomValue } from 'jotai';
import { agencyLogoAtom } from '../../store/agencyLogoAtom';

export const Header = ({ showLocaleSwitch = false }) => {
	const { t: translate } = useTranslation();
	const { tenant } = useContext(TenantContext);
	const agencyLogo = useAtomValue(agencyLogoAtom);

	return (
		<header className="header">
			<Headline
				semanticLevel="2"
				text={tenant?.name || translate('app.title')}
			/>
			<div className="header__right">
				{agencyLogo ? (
					<img src={agencyLogo} className="header__logo" alt="Logo" />
				) : (
					<Text
						type="standard"
						text={tenant?.content?.claim || translate('app.claim')}
					/>
				)}
				{showLocaleSwitch && <LocaleSwitch />}
			</div>
		</header>
	);
};
