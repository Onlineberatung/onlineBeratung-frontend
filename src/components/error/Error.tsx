import React, { useState } from 'react';
import { errorData } from './errorData';
import { ReactComponent as Icon401 } from '../../resources/img/illustrations/kein-zutritt.svg';
import { ReactComponent as Icon404 } from '../../resources/img/illustrations/ooh.svg';
import { ReactComponent as Icon500 } from '../../resources/img/illustrations/gleich-zurueck.svg';
import '../../resources/styles/styles';
import './error.styles';
import '../button/button.styles';

const getErrorType = () => {
	const errorRoot = document.getElementById('errorRoot');
	return errorRoot?.dataset?.errortype;
};

export const Error = () => {
	const [{ Icon, headline, infoText, hasCaritasButton }] = useState(() => {
		const type = getErrorType();

		let Icon;
		switch (type) {
			case '401':
				Icon = Icon401;
				break;
			case '404':
				Icon = Icon404;
				break;
			case '500':
				Icon = Icon500;
				break;
		}
		return { ...errorData[type], Icon };
	});

	return (
		<div className="errorPage">
			<nav className="errorPage__nav"></nav>
			<header className="errorPage__header">
				<div className="errorPage__headerMobile">
					<h2>Beratung & Hilfe</h2>
				</div>
				<p className="errorPage__claim">Online. Anonym. Sicher.</p>
			</header>
			<div className="errorPage__main">
				<span className="errorPage__illustrationWrapper">
					<Icon className="errorPage__illustration" />
				</span>
				<div className="errorPage__content">
					<h1 className="errorPage__headline">{headline}</h1>
					<p
						className="errorPage__infoText"
						dangerouslySetInnerHTML={{
							__html: infoText
						}}
					/>
					{hasCaritasButton ? (
						<a href="https://www.caritas.de/onlineberatung">
							<button className="errorPage__button button__item button__primary">
								Zur Caritas Website
							</button>
						</a>
					) : (
						<a href="/login.html">
							<button className="errorPage__button button__item button__primary">
								Zum Login
							</button>
						</a>
					)}
				</div>
			</div>
		</div>
	);
};
