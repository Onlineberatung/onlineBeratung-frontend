import * as React from 'react';
import { useEffect } from 'react';
import { OVERLAY_RESET_TIME } from '../overlay/Overlay';
import { ReactComponent as ReloadIcon } from '../../resources/img/icons/reload.svg';
import './button.styles';

export const BUTTON_TYPES = {
	PRIMARY: 'PRIMARY',
	GHOST: 'GHOST',
	LINK: 'LINK',
	TERTIARY: 'TERTIARY',
	AUTO_CLOSE: 'AUTO_CLOSE'
};

export interface ButtonItem {
	label: string;
	function?: string;
	type: string;
	id?: string;
	target?: string;
}

export interface ButtonProps {
	buttonHandle: Function;
	disabled?: boolean;
	isLink?: boolean;
	item: ButtonItem;
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
				props.buttonHandle(item.function, item.target);
			}, OVERLAY_RESET_TIME);
		}
	};

	const getButtonClassName = (type: string) => {
		let className;
		switch (type) {
			case BUTTON_TYPES.PRIMARY:
				className = 'button__primary';
				break;
			case BUTTON_TYPES.GHOST:
				className = 'button__ghost';
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
			default:
				className = '';
		}
		return className;
	};

	const handleButtonClick = (event) => {
		if (props.disabled || !props.isLink) {
			event.preventDefault();
		}

		if (!props.disabled) {
			window.clearTimeout(timeoutID);
			props.buttonHandle(item.function, item.target);
		}
	};

	return (
		<div className="button__wrapper">
			<button
				onClick={(event) => handleButtonClick(event)}
				id={item.id}
				className={
					'button__item ' +
					getButtonClassName(item.type) +
					(props.disabled ? ' button__item--disabled' : '')
				}
			>
				{item.id === 'reloadButton' && (
					<ReloadIcon className="button__icon" />
				)}
				{item.label}
			</button>
		</div>
	);
};
