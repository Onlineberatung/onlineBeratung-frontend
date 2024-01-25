import * as React from 'react';
import { useEffect } from 'react';
import { OVERLAY_RESET_TIME } from '../overlay/Overlay';
import { ReactComponent as ReloadIcon } from '../../resources/img/icons/reload.svg';
import './button.styles';
import { useTranslation } from 'react-i18next';

export const BUTTON_TYPES = {
	PRIMARY: 'PRIMARY',
	SECONDARY: 'SECONDARY',
	TERTIARY: 'TERTIARY',
	LINK: 'LINK',
	LINK_INLINE: 'LINK_INLINE',
	AUTO_CLOSE: 'AUTO_CLOSE',
	SMALL_ICON: 'SMALL_ICON'
};

export interface ButtonItem {
	function?: string;
	functionArgs?: {
		[key: string]: any;
	};
	disabled?: boolean;
	icon?: JSX.Element;
	id?: string;
	label?: string;
	smallIconBackgroundColor?:
		| 'green'
		| 'red'
		| 'yellow'
		| 'grey'
		| 'alternate'
		| 'secondary'
		| 'transparent';
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
	customIcon?: JSX.Element;
	tabIndex?: number;
}

export const Button = (props: ButtonProps) => {
	const item = props.item;
	let timeoutID: number;
	const { t: translate } = useTranslation();

	useEffect(() => {
		handleButtonTimer();

		return (): void => {
			if (timeoutID) window.clearTimeout(timeoutID);
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const handleButtonTimer = () => {
		if (item.type === BUTTON_TYPES.AUTO_CLOSE) {
			timeoutID = window.setTimeout(() => {
				props.buttonHandle(item.function, item.functionArgs);
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
			case BUTTON_TYPES.LINK_INLINE:
				className = 'button__link';
				if (type === BUTTON_TYPES.LINK_INLINE) {
					className += ' button__link--inline';
				}
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

		if (!props.disabled && !props.item.disabled && props.buttonHandle) {
			if (timeoutID) window.clearTimeout(timeoutID);
			props.buttonHandle(item.function, item.functionArgs);
		}
	};

	return (
		<div
			className={`button__wrapper ${
				item.type === BUTTON_TYPES.LINK_INLINE
					? 'button__wrapper--inline'
					: ''
			} ${props.className ? props.className : ''}`}
		>
			<button
				onClick={(event) => handleButtonClick(event)}
				id={item.id}
				disabled={props.disabled}
				title={item.title}
				aria-label={item.title}
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
					${props.disabled || props.item.disabled ? ' button__item--disabled' : ''}
				`}
				data-cy={props.testingAttribute}
				tabIndex={props.tabIndex}
			>
				{props.customIcon && (
					<div className="button__custom-icon">
						{props.customIcon}
					</div>
				)}
				{item.id === 'reloadButton' && (
					<ReloadIcon className="button__icon" />
				)}
				{item.icon && item.icon}
				{item.label && translate(item.label)}
			</button>
		</div>
	);
};
