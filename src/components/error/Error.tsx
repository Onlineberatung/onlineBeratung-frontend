import '../../polyfill';
import React from 'react';
import clsx from 'clsx';
import { ReactComponent as Icon400 } from '../../resources/img/illustrations/bad-request.svg';
import { ReactComponent as Icon401 } from '../../resources/img/illustrations/unauthorized.svg';
import { ReactComponent as Icon404 } from '../../resources/img/illustrations/not-found.svg';
import { ReactComponent as Icon500 } from '../../resources/img/illustrations/internal-server-error.svg';
import { Button, BUTTON_TYPES } from '../button/Button';
import useTenantTheming from '../../utils/useTenantTheming';
import '../../resources/styles/styles';
import './error.styles';
import { useTranslation } from 'react-i18next';
import { LocaleSwitch } from '../localeSwitch/LocaleSwitch';
import { AppConfigProvider } from '../../globalState/provider/AppConfigProvider';
import { useAppConfig } from '../../hooks/useAppConfig';
import { AppConfigInterface, LocaleProvider } from '../../globalState';

const getStatusCode = () => {
	const errorRoot = document.getElementById('errorRoot');
	return errorRoot?.dataset?.errortype;
};

type ErrorProps = {
	config: AppConfigInterface;
};

export const Error = ({ config }: ErrorProps) => (
	<AppConfigProvider config={config}>
		<LocaleProvider>
			<ErrorContent />
		</LocaleProvider>
	</AppConfigProvider>
);

export const ErrorContent = () => {
	const { t: translate } = useTranslation();
	useTenantTheming();
	const settings = useAppConfig();
	const statusCode = getStatusCode();

	const buttonHandle = () => {
		document.location.href = settings.urls.toLogin;
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

	return (
		<div className={clsx('errorPage', `errorPage--${type}`)}>
			<header className="errorPage__header">
				<div className="errorPage__headerMobile">
					<h2>{translate('app.title')}</h2>
				</div>
				<p className="errorPage__claim">{translate('app.claim')}</p>
				<LocaleSwitch />
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
