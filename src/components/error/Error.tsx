import '../../polyfill';
import React from 'react';
import clsx from 'clsx';
import { ReactComponent as Icon400 } from '../../resources/img/illustrations/bad-request.svg';
import { ReactComponent as Icon401 } from '../../resources/img/illustrations/unauthorized.svg';
import { ReactComponent as Icon404 } from '../../resources/img/illustrations/not-found.svg';
import { ReactComponent as Icon500 } from '../../resources/img/illustrations/internal-server-error.svg';
import { Button, BUTTON_TYPES } from '../button/Button';
import { config } from '../../resources/scripts/config';
import useTenantTheming from '../../utils/useTenantTheming';
import '../../resources/styles/styles';
import './error.styles';
import { useTranslation } from 'react-i18next';

import i18n from '../../i18n';
import { LanguageSwitch } from '../languageSwitch/LanguageSwitch';

i18n.init();

const getStatusCode = () => {
	const errorRoot = document.getElementById('errorRoot');
	return errorRoot?.dataset?.errortype;
};

export const Error = () => {
	const { t: translate } = useTranslation();
	useTenantTheming();
	const statusCode = getStatusCode();

	const buttonHandle = () => {
		document.location.href = config.urls.toLogin;
	};

	let Icon;
	let type;
	switch (statusCode) {
		case '400':
			Icon = Icon400;
			type = 'error';
			break;
		case '401':
			Icon = Icon401;
			type = 'warning';
			break;
		case '404':
			Icon = Icon404;
			type = 'warning';
			break;
		case '500':
			Icon = Icon500;
			type = 'error';
			break;
	}

	const changeLanguage = (language) => {
		localStorage.setItem(`appLanguage`, JSON.stringify(language));
		i18n.changeLanguage(language.value);
	};

	return (
		<div className={clsx('errorPage', `errorPage--${type}`)}>
			<header className="errorPage__header">
				<div className="errorPage__headerMobile">
					<h2>{translate('app.title')}</h2>
				</div>
				<p className="errorPage__claim">{translate('app.claim')}</p>
				<LanguageSwitch
					appLanguage={JSON.parse(
						localStorage.getItem(`appLanguage`)
					)}
					setAppLanguage={(language) => changeLanguage(language)}
				/>
			</header>
			<div className="errorPage__main">
				<span className="errorPage__illustrationWrapper">
					<Icon className="errorPage__illustration" />
				</span>
				<div className="errorPage__content">
					<h1 className="errorPage__headline">
						{translate(`error.statusCodes.${statusCode}.headline`)}
					</h1>
					<p
						className="errorPage__infoText"
						dangerouslySetInnerHTML={{
							__html: translate(
								`error.statusCodes.${statusCode}.description`
							)
						}}
					/>
					{statusCode !== '400' && (
						<Button
							className="errorPage__button"
							buttonHandle={buttonHandle}
							item={{
								type: BUTTON_TYPES.PRIMARY,
								label: translate('error.login')
							}}
						/>
					)}
				</div>
			</div>
		</div>
	);
};
