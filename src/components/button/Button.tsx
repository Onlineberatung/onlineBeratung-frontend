import * as React from 'react';
import { useEffect } from 'react';
import { OVERLAY_RESET_TIME } from '../overlay/Overlay';
import { ReactComponent as ReloadIcon } from '../../resources/img/icons/reload.svg';
import './button.styles';

export const BUTTON_TYPES = {
	PRIMARY: 'PRIMARY',
	SECONDARY: 'SECONDARY',
	TERTIARY: 'TERTIARY',
	LINK: 'LINK',
	AUTO_CLOSE: 'AUTO_CLOSE',
	SMALL_ICON: 'SMALL_ICON'
};

export interface ButtonItem {
	function?: string;
	icon?: JSX.Element;
	id?: string;
	label?: string;
	smallIconBackgroundColor?: 'green' | 'red' | 'yellow' | 'grey';
	title?: string;
	type: string;
}

export interface ButtonProps {
	buttonHandle?: Function;
	disabled?: boolean;
	isLink?: boolean;
	item: ButtonItem;
	testingAttribute?: string;
	className?: string;
}

export const Button = (props: ButtonProps) => {
	const item = props.item;
	let timeoutID: number;

	useEffect(() => {
		handleButtonTimer();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const handleButtonTimer = () => {
		if (item.type === BUTTON_TYPES.AUTO_CLOSE) {
			timeoutID = window.setTimeout(() => {
				props.buttonHandle(item.function);
			}, OVERLAY_RESET_TIME);
		}
	};

	const getButtonClassName = (type: string) => {
		let className;
		switch (type) {
			case BUTTON_TYPES.PRIMARY:
				className = 'button__primary';
				break;
			case BUTTON_TYPES.SECONDARY:
				className = 'button__secondary';
				break;
			case BUTTON_TYPES.TERTIARY:
				className = 'button__tertiary';
				break;
			case BUTTON_TYPES.LINK:
				className = 'button__link';
				break;
			case BUTTON_TYPES.AUTO_CLOSE:
				className = 'button__autoClose';
				break;
			case BUTTON_TYPES.SMALL_ICON:
				className = 'button__smallIcon';
				break;
			default:
				className = '';
		}
		return className;
	};

	const handleButtonClick = (event) => {
		if (props.disabled || !props.isLink) {
			event.preventDefault();
		}

		if (!props.disabled && props.buttonHandle) {
			window.clearTimeout(timeoutID);
			props.buttonHandle(item.function);
		}
	};

	return (
		<div
			className={`button__wrapper ${
				props.className ? props.className : ''
			}`}
		>
			<button
				onClick={(event) => handleButtonClick(event)}
				id={item.id}
				title={item.title}
				className={`
					button__item 
					${getButtonClassName(item.type)} 
					${
						item.type === BUTTON_TYPES.SMALL_ICON
							? getButtonClassName(item.type) +
							  '--' +
							  item.smallIconBackgroundColor
							: ''
					} 
					${
						item.type === BUTTON_TYPES.SMALL_ICON && item.label
							? getButtonClassName(item.type) + '--withLabel'
							: ''
					} 
					${props.disabled ? ' button__item--disabled' : ''}
				`}
				data-cy={props.testingAttribute}
			>
				{item.id === 'reloadButton' && (
					<ReloadIcon className="button__icon" />
				)}
				{item.icon && item.icon}
				{item.label && item.label}
			</button>
		</div>
	);
};
