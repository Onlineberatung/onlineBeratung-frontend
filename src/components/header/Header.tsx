import * as React from 'react';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import { useContext } from 'react';
import { TenantContext } from '../../globalState';
import './header.styles';
import { useTranslation } from 'react-i18next';
import { LocaleSwitch } from '../localeSwitch/LocaleSwitch';

export const Header = ({ showLocaleSwitch = false }) => {
	const { t: translate } = useTranslation();
	const { tenant } = useContext(TenantContext);
	const hasAssociationLogo = !!tenant?.theming.associationLogo;

	return (
		<header className="header">
			<Headline
				semanticLevel="2"
				text={tenant?.name || translate('app.title')}
			/>
			<div className="header__right">
				{hasAssociationLogo ? (
					<img
						src={tenant?.theming.associationLogo}
						className="header__logo"
						alt={`Logo ${tenant?.name}`}
					/>
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
