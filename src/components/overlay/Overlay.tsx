import * as React from 'react';
import { useEffect } from 'react';
import * as ReactDOM from 'react-dom';
import { ButtonItem, Button } from '../button/Button';
import { Text } from '../text/Text';
import { Headline, HeadlineStyleLevel } from '../headline/Headline';
import './overlay.styles';

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
	buttonSet?: ButtonItem[];
	copy?: string;
	headline?: string;
	headlineStyleLevel?: HeadlineStyleLevel;
	isIconSmall?: boolean;
	nestedComponent?: React.ReactNode;
	svg?: React.FunctionComponent<
		React.SVGProps<SVGSVGElement> & { title?: string }
	>;
}

export const OverlayWrapper = (props) => {
	const overlay = document.getElementById('overlay');
	return overlay && ReactDOM.createPortal(props.children, overlay);
};

export const Overlay = (props: {
	item: OverlayItem;
	handleOverlay: Function;
}) => {
	useEffect(() => {
		document.querySelector('.app')?.classList.add('app--blur');

		return () => {
			document.querySelector('.app')?.classList.remove('app--blur');
		};
	}, []);

	const handleButtonClick = (buttonFunction: string) => {
		props.handleOverlay(buttonFunction);
	};

	const item = props.item;
	const Icon = item.svg;
	return (
		<div className="overlay">
			<div className="overlay__background"></div>
			<div className="overlay__content">
				{item.svg && (
					<span
						className={`overlay__iconWrapper 
						${item.isIconSmall ? `overlay__iconWrapper--small` : ''}`}
					>
						<Icon />
					</span>
				)}
				{item.headline && (
					<Headline
						semanticLevel="3"
						text={item.headline}
						styleLevel={item.headlineStyleLevel}
					/>
				)}
				{item.copy && <Text text={item.copy} type="standard" />}
				{item.nestedComponent && (
					<div className="overlay__nestedComponent">
						{item.nestedComponent}
					</div>
				)}
				{item.buttonSet?.map((item, i) => {
					return (
						<Button
							item={item}
							key={i}
							buttonHandle={handleButtonClick}
						/>
					);
				})}
			</div>
		</div>
	);
};
