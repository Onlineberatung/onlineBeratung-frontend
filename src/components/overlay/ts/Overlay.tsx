import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ButtonItem, Button } from '../../button/ts/Button';

export const OVERLAY_FUNCTIONS = {
	CLOSE: 'CLOSE',
	REDIRECT: 'REDIRECT',
	REDIRECT_WITH_BLUR: 'REDIRECT_WITH_BLUR',
	LOGOUT: 'LOGOUT',
	DEACTIVATE_ABSENCE: 'DEACTIVATE_ABSENCE',
	COPY_LINK: 'COPY_LINK',
	STOP_GROUP_CHAT: 'STOP_GROUP_CHAT',
	LEAVE_GROUP_CHAT: 'LEAVE_GROUP_CHAT'
};

export const OVERLAY_RESET_TIME = 10000;

export interface OverlayItem {
	imgSrc?: string;
	headline?: string;
	copy?: string;
	copyTwo?: string;
	buttonSet?: ButtonItem[];
}

export class OverlayWrapper extends React.Component<any> {
	render() {
		const overlay = document.getElementById('overlay');
		if (overlay) {
			return ReactDOM.createPortal(
				this.props.children,
				overlay
			);
		}
	}
}

export class Overlay extends React.Component<{
	item: OverlayItem;
	handleOverlay: Function;
}> {
	constructor(props) {
		super(props);
		this.handleButtonClick = this.handleButtonClick.bind(this);
	}

	componentDidMount() {
		this.addOverlayClasses();
	}

	addOverlayClasses = () => {
		document.querySelector('.app')?.classList.add('app--blur');
		document.querySelector('.overlay')?.classList.add('overlay--flex');
	};

	removeOverlayClasses = () => {
		document.querySelector('.app')?.classList.remove('app--blur');
	};

	handleButtonClick(buttonFunction: string) {
		this.props.handleOverlay(buttonFunction);
		if (
			buttonFunction === OVERLAY_FUNCTIONS.CLOSE ||
			buttonFunction === OVERLAY_FUNCTIONS.REDIRECT
		) {
			this.removeOverlayClasses();
		}
	}

	render(): JSX.Element {
		const item = this.props.item;
		return (
			<div className="overlay">
				<div className="overlay__background"></div>
				<div className="overlay__content">
					{item.imgSrc ? (
						<div className="overlay__iconWrapper">
							<svg
								className="overlay__icon__background"
								xmlns="http://www.w3.org/2000/svg"
								xmlnsXlink="http://www.w3.org/1999/xlink"
								viewBox="0 0 72 72"
							>
								<defs>
									<circle id="dot-a" cx="36" cy="36" r="30" />
								</defs>
								<use xlinkHref="#dot-a" />
							</svg>
							<img className="overlay__icon" src={item.imgSrc} alt="overlay icon" />
						</div>
					) : (
						``
					)}
					{item.headline &&
					item.buttonSet &&
					item.buttonSet[0].function ===
						OVERLAY_FUNCTIONS.DEACTIVATE_ABSENCE ? (
						<h1 className="overlay__headline">{item.headline}</h1>
					) : item.headline ? (
						<h3
							className="overlay__headline"
							dangerouslySetInnerHTML={{ __html: item.headline }}
						></h3>
					) : (
						``
					)}
					{item.copy ? (
						<p className="overlay__copy">{item.copy}</p>
					) : (
						``
					)}
					{item.copyTwo ? (
						<p className="overlay__copy">{item.copyTwo}</p>
					) : (
						``
					)}
					{item.buttonSet
						? item.buttonSet.map((item, i) => {
								return (
									<Button
										item={item}
										key={i}
										buttonHandle={this.handleButtonClick}
									/>
								);
						  })
						: ``}
				</div>
			</div>
		);
	}
}
