import '../../polyfill';
import React from 'react';
import clsx from 'clsx';
import { ReactComponent as Icon401 } from '../../resources/img/illustrations/kein-zutritt.svg';
import { ReactComponent as Icon404 } from '../../resources/img/illustrations/ooh.svg';
import { ReactComponent as Icon500 } from '../../resources/img/illustrations/gleich-zurueck.svg';
import { translate } from '../../utils/translate';
import { Button, BUTTON_TYPES } from '../button/Button';
import '../../resources/styles/styles';
import './error.styles';
import { Capacitor, Plugins } from '@capacitor/core';

const getStatusCode = () => {
	const errorRoot = document.getElementById('errorRoot');
	return errorRoot?.dataset?.errortype;
};

export const Error = () => {
	const statusCode = getStatusCode();

	const buttonHandle = () => {
		document.location.href = '/';
	};

	let Icon;
	let type;
	switch (statusCode) {
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
					<Button
						className="errorPage__button"
						buttonHandle={buttonHandle}
						item={{
							type: BUTTON_TYPES.PRIMARY,
							label: translate('error.login')
						}}
					/>
				</div>
			</div>
		</div>
	);
};
