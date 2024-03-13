import '../../polyfill';
import React, { useMemo } from 'react';
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
import { useAppConfig } from '../../hooks/useAppConfig';
import { LocaleProvider, AppConfigProvider } from '../../globalState';
import { AppConfigInterface } from '../../globalState/interfaces';
import { useResponsive } from '../../hooks/useResponsive';
import { MENUPLACEMENT_BOTTOM_LEFT } from '../select/SelectDropdown';

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
	const { fromL } = useResponsive();
	const correlationId = useMemo(
		() => new URLSearchParams(window.location.search).get('correlationId'),
		[]
	);

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
			<header className={`errorPage__header ${!fromL ? 'mobile' : ''}`}>
				<LocaleSwitch menuPlacement={MENUPLACEMENT_BOTTOM_LEFT} />
			</header>
			<div className="errorPage__main">
				<span className="errorPage__illustrationWrapper">
					<Icon
						className="errorPage__illustration"
						aria-hidden="true"
					/>
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
					{correlationId && (
						<div className="text--tertiary">
							Ref: {correlationId}
						</div>
					)}
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
