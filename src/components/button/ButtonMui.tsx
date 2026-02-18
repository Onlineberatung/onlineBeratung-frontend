import * as React from 'react';
import { useEffect } from 'react';
import { Button as MuiButton, IconButton } from '@mui/material';
import { OVERLAY_RESET_TIME } from '../overlay/Overlay';
import ReloadIcon from '../../resources/img/icons/reload.svg?react';
import './buttonMui.styles.scss';
import { useTranslation } from 'react-i18next';

export const BUTTON_TYPES = {
	PRIMARY: 'PRIMARY',
	SECONDARY: 'SECONDARY',
	TERTIARY: 'TERTIARY',
	DANGER: 'DANGER',
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

export const ButtonMui = (props: ButtonProps) => {
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

	const handleButtonClick = (event) => {
		if (props.disabled || !props.isLink) {
			event.preventDefault();
		}

		if (!props.disabled && !props.item.disabled && props.buttonHandle) {
			if (timeoutID) window.clearTimeout(timeoutID);
			props.buttonHandle(item.function, item.functionArgs);
		}
	};

	const getMuiVariant = (): 'contained' | 'outlined' | 'text' => {
		switch (item.type) {
			case BUTTON_TYPES.PRIMARY:
			case BUTTON_TYPES.DANGER:
			case BUTTON_TYPES.AUTO_CLOSE:
				return 'contained';
			case BUTTON_TYPES.SECONDARY:
			case BUTTON_TYPES.TERTIARY:
				return 'outlined';
			case BUTTON_TYPES.LINK:
			case BUTTON_TYPES.LINK_INLINE:
				return 'text';
			default:
				return 'contained';
		}
	};

	const getButtonClassName = (): string => {
		let className = 'button-mui';
		
		switch (item.type) {
			case BUTTON_TYPES.PRIMARY:
				className += ' button-mui--primary';
				break;
			case BUTTON_TYPES.SECONDARY:
				className += ' button-mui--secondary';
				break;
			case BUTTON_TYPES.TERTIARY:
				className += ' button-mui--tertiary';
				break;
			case BUTTON_TYPES.DANGER:
				className += ' button-mui--danger';
				break;
			case BUTTON_TYPES.LINK:
				className += ' button-mui--link';
				break;
			case BUTTON_TYPES.LINK_INLINE:
				className += ' button-mui--link button-mui--link-inline';
				break;
			case BUTTON_TYPES.AUTO_CLOSE:
				className += ' button-mui--auto-close';
				break;
			case BUTTON_TYPES.SMALL_ICON:
				className += ' button-mui--small-icon';
				if (item.smallIconBackgroundColor) {
					className += ` button-mui--small-icon-${item.smallIconBackgroundColor}`;
				}
				if (item.label) {
					className += ' button-mui--small-icon-with-label';
				}
				break;
		}
		
		return className;
	};

	// For SMALL_ICON type, use IconButton
	if (item.type === BUTTON_TYPES.SMALL_ICON) {
		return (
			<div
				className={`button-mui__wrapper ${
					item.type === BUTTON_TYPES.LINK_INLINE
						? 'button-mui__wrapper--inline'
						: ''
				} ${props.className ? props.className : ''}`}
			>
				<IconButton
					onClick={handleButtonClick}
					id={item.id}
					disabled={props.disabled || item.disabled}
					title={item.title}
					aria-label={item.title}
					className={getButtonClassName()}
					data-cy={props.testingAttribute}
					tabIndex={props.tabIndex}
					size="small"
				>
					{props.customIcon && props.customIcon}
					{item.id === 'reloadButton' && <ReloadIcon />}
					{item.icon && item.icon}
					{item.label && <span className="button-mui__icon-label">{translate(item.label)}</span>}
				</IconButton>
			</div>
		);
	}

	// For all other button types, use regular MUI Button
	return (
		<div
			className={`button-mui__wrapper ${
				item.type === BUTTON_TYPES.LINK_INLINE
					? 'button-mui__wrapper--inline'
					: ''
			} ${props.className ? props.className : ''}`}
		>
			<MuiButton
				variant={getMuiVariant()}
				onClick={handleButtonClick}
				id={item.id}
				disabled={props.disabled || item.disabled}
				title={item.title}
				aria-label={item.title}
				className={getButtonClassName()}
				data-cy={props.testingAttribute}
				tabIndex={props.tabIndex}
				type="button"
				startIcon={
					props.customIcon ? (
						props.customIcon
					) : item.id === 'reloadButton' ? (
						<ReloadIcon />
					) : item.icon ? (
						item.icon
					) : undefined
				}
			>
				{item.label && translate(item.label)}
			</MuiButton>
		</div>
	);
};
