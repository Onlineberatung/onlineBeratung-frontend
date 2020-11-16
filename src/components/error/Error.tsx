import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { errorData } from './errorData';
import Icon401 from '../../resources/img/illustrations/kein-zutritt.svg';
import Icon404 from '../../resources/img/illustrations/ooh.svg';
import Icon500 from '../../resources/img/illustrations/gleich-zurueck.svg';
import IconConstruction from '../../resources/img/illustrations/baustelle.svg';

import '../../resources/styles/styles';
import './error.styles';

const getErrorType = () => {
	const errorRoot = document.getElementById('errorRoot');
	return errorRoot?.dataset?.errortype;
};

export const initError = () => {
	ReactDOM.render(<Error />, document.getElementById('errorRoot'));
};

const Error = () => {
	const [{ imgSrc, headline, infoText, hasCaritasButton }] = useState(() => {
		const type = getErrorType();

		let imgSrc;
		switch (type) {
			case '401':
				imgSrc = Icon401;
				break;
			case '404':
				imgSrc = Icon404;
				break;
			case '500':
				imgSrc = Icon500;
				break;
			case 'construction':
				imgSrc = IconConstruction;
				break;
		}

		return { ...errorData[type], imgSrc };
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
				<div className="errorPage__illustrationWrapper">
					<svg
						className="errorPage__illustration__background"
						xmlns="http://www.w3.org/2000/svg"
						xmlnsXlink="http://www.w3.org/1999/xlink"
						viewBox="0 0 72 72"
					>
						<defs>
							<circle id="dot-a" cx="36" cy="36" r="30" />
						</defs>
						<use xlinkHref="#dot-a" />
					</svg>
					<img
						alt=""
						className="errorPage__illustration"
						src={imgSrc}
					/>
				</div>
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
