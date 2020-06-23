import * as React from 'react';

const infoIcon = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 72 72"
		>
			<path d="M36,6 C52.5333333,6 66,19.4666667 66,36 C66,52.5333333 52.5333333,66 36,66 C19.4666667,66 6,52.5333333 6,36 C6,19.4666667 19.4666667,6 36,6 Z M29.3515625,50.4609375 L29.3515625,54.5625 L42.78125,54.5625 L42.78125,50.4609375 L39.5,49.7578125 L39.5,29.203125 L29,29.203125 L29,33.328125 L32.65625,34.03125 L32.65625,49.7578125 L29.3515625,50.4609375 Z M39.5,23.1328125 L39.5,18 L32.65625,18 L32.65625,23.1328125 L39.5,23.1328125 Z" />
		</svg>
	);
};

const errorIcon = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="72"
			height="72"
			viewBox="0 0 72 72"
		>
			<path d="M37.7654935,7.31698782 L67.4353219,63.0603018 C67.9543029,64.035357 67.5845817,65.2465126 66.6095266,65.7654935 C66.3202373,65.9194701 65.9975433,66 65.6698284,66 L6.33017157,66 C5.22560207,66 4.33017157,65.1045695 4.33017157,64 C4.33017157,63.6722851 4.41070152,63.3495911 4.56467805,63.0603018 L34.2345065,7.31698782 C34.7534874,6.34193268 35.964643,5.9722115 36.9396982,6.49119247 C37.29099,6.67817038 37.5785156,6.96569598 37.7654935,7.31698782 Z M39,46 L39,26 L33,26 L33,46 L39,46 Z M39,56.4 L39,50.4 L33,50.4 L33,56.4 L39,56.4 Z" />
		</svg>
	);
};

export interface MessageSubmitInfoInterface {
	isInfo: boolean;
	infoHeadline: string;
	infoMessage: string;
}

export const MessageSubmitInfo = (props: MessageSubmitInfoInterface) => {
	return (
		<div className="messageSubmitInfoWrapper">
			<div
				className={
					props.isInfo
						? 'messageSubmitInfoWrapper__headlineWrapper'
						: 'messageSubmitInfoWrapper__headlineWrapper messageSubmitInfoWrapper__headlineWrapper--red'
				}
			>
				<span className="messageSubmitInfoWrapper__icon">
					{props.isInfo ? infoIcon() : errorIcon()}
				</span>
				<span
					className={
						props.isInfo
							? 'messageSubmitInfoWrapper__headline'
							: 'messageSubmitInfoWrapper__headline messageSubmitInfoWrapper__headline--red'
					}
				>
					{props.infoHeadline}
				</span>
			</div>

			<div
				className={
					props.isInfo
						? 'messageSubmitInfoWrapper__message'
						: 'messageSubmitInfoWrapper__message messageSubmitInfoWrapper__message--red'
				}
			>
				{props.infoMessage}
			</div>
		</div>
	);
};
