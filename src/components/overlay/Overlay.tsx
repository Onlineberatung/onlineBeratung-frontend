import * as React from 'react';
import { useEffect } from 'react';
import * as ReactDOM from 'react-dom';
import { ButtonItem, Button } from '../button/Button';
import { Text } from '../text/Text';
import { Headline, HeadlineLevel } from '../headline/Headline';
import clsx from 'clsx';
import './overlay.styles';

export const OVERLAY_FUNCTIONS = {
	CLOSE: 'CLOSE',
	CLOSE_SUCCESS: 'CLOSE_SUCCESS',
	REDIRECT: 'REDIRECT',
	REDIRECT_WITH_BLUR: 'REDIRECT_WITH_BLUR',
	REDIRECT_TO_HOME: 'REDIRECT_TO_HOME',
	LOGOUT: 'LOGOUT',
	DEACTIVATE_ABSENCE: 'DEACTIVATE_ABSENCE',
	COPY_LINK: 'COPY_LINK',
	STOP_GROUP_CHAT: 'STOP_GROUP_CHAT',
	LEAVE_GROUP_CHAT: 'LEAVE_GROUP_CHAT',
	DELETE_ACCOUNT: 'DELETE_ACCOUNT',
	FINISH_ANONYMOUS_CONVERSATION: 'FINISH_ANONYMOUS_CONVERSATION'
};

export const OVERLAY_RESET_TIME = 10000;

export interface OverlayItem {
	buttonSet?: ButtonItem[];
	className?: string;
	copy?: string;
	headline?: string;
	headlineStyleLevel?: HeadlineLevel;
	isIllustrationSmall?: boolean;
	illustrationBackground?: 'red' | 'grey' | 'green';
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
	const Illustration = item.svg;
	return (
		<div className={clsx('overlay', item.className)}>
			<div className="overlay__background"></div>
			<div className="overlay__content">
				{item.svg && (
					<span
						className={clsx('overlay__illustrationWrapper', {
							'overlay__illustrationWrapper--small':
								item.isIllustrationSmall,
							'overlay__illustrationWrapper--red':
								item.illustrationBackground === 'red',
							'overlay__illustrationWrapper--green':
								item.illustrationBackground === 'green',
							'overlay__illustrationWrapper--grey':
								item.illustrationBackground === 'grey'
						})}
					>
						<Illustration />
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
