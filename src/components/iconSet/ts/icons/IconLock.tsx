import * as React from 'react';
import { IconProps } from '../Icon';

export const IconLock = (props: IconProps) => {
	return (
		<svg
			className={props.className ? props.className : null}
			name={props.name}
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
			width="72"
			height="72"
			viewBox="0 0 72 72"
		>
			<defs>
				<path
					id="lock-a"
					d="M48,27.9898836 L48,24.9695747 C48,17.8182095 42.6167461,12 36,12 C29.3832539,12.0088288 24,17.8270383 24,24.9784036 L24,27.9979767 L18,28 L18,23.8453049 C18,14.0121777 26.0748809,6.01213966 36,6 C45.9251191,6 54,14.0000381 54,23.8331653 L54,27.9878603 L48,27.9898836 Z M10,28 L62,28 C63.1045695,28 64,28.8954305 64,30 L64,65 C64,66.1045695 63.1045695,67 62,67 L10,67 C8.8954305,67 8,66.1045695 8,65 L8,30 C8,28.8954305 8.8954305,28 10,28 Z M35,39 C33.8954305,39 33,39.8954305 33,41 L33,55 C33,56.1045695 33.8954305,57 35,57 L37,57 C38.1045695,57 39,56.1045695 39,55 L39,41 C39,39.8954305 38.1045695,39 37,39 L35,39 Z"
				/>
			</defs>
			<use xlinkHref="#lock-a" />
		</svg>
	);
};
