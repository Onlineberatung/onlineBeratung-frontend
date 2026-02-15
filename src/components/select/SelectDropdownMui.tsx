import * as React from 'react';
import { useState, useMemo, ReactNode } from 'react';
import {
	Select as MuiSelect,
	MenuItem,
	Autocomplete,
	TextField,
	Chip,
	SelectChangeEvent
} from '@mui/material';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { CloseCircle } from '../../resources/img/icons';
import ArrowDownIcon from '../../resources/img/icons/arrow-down-light.svg?react';
import ArrowUpIcon from '../../resources/img/icons/arrow-up-light.svg?react';
import { Text } from '../text/Text';
import './select-mui.styles.scss';

// Local type definition to avoid react-select dependency
export type MultiValue<T> = T[];

export interface SelectOption {
	value: string;
	label: ReactNode;
	iconLabel?: string;
	isFixed?: boolean;
}

export interface SelectOptionsMulti {
	action: string;
	name?: string;
	removedValue?: SelectOption;
	option?: SelectOption;
}

export const MENUPLACEMENT_TOP = 'top';
export const MENUPLACEMENT_BOTTOM = 'bottom';
export const MENUPLACEMENT_RIGHT = 'right';
export const MENUPLACEMENT_BOTTOM_LEFT = 'bottomLeft';
export const MENUPLACEMENT_BOTTOM_RIGHT = 'bottomRight';

export type MENUPLACEMENT =
	| typeof MENUPLACEMENT_TOP
	| typeof MENUPLACEMENT_BOTTOM
	| typeof MENUPLACEMENT_RIGHT
	| typeof MENUPLACEMENT_BOTTOM_LEFT
	| typeof MENUPLACEMENT_BOTTOM_RIGHT;

export interface SelectDropdownItem {
	className?: string;
	id: string;
	selectedOptions: SelectOption[];
	selectInputLabel?: string;
	placeholder?: string;
	handleDropdownSelect: (
		newValue: SelectOption | MultiValue<SelectOption>,
		actionMeta?: any
	) => void;
	useIconOption?: boolean;
	isSearchable?: boolean;
	isMulti?: boolean;
	isClearable?: boolean;
	menuPlacement: MENUPLACEMENT;
	menuPosition?: 'absolute' | 'fixed';
	defaultValue?: SelectOption | SelectOption[];
	hasError?: boolean;
	errorMessage?: string;
	onKeyDown?: Function;
	styleOverrides?: any;
	selectRef?: any;
	isInsideMenu?: boolean;
	menuShouldBlockScroll?: boolean;
}

/**
 * MUI-based Select/Autocomplete wrapper that maintains API compatibility with react-select
 * Supports single-select, multi-select, searchable, icons, and custom positioning
 */
export const SelectDropdownMui = (props: SelectDropdownItem) => {
	const { t: translate } = useTranslation();
	const [open, setOpen] = useState(false);
	const [isFocused, setIsFocused] = useState(false);

	// Determine the current value(s)
	const value = props.defaultValue || (props.isMulti ? [] : null);

	// For multi-select with Autocomplete
	const multiValue = Array.isArray(value) ? value : value ? [value] : [];

	// For single-select
	const singleValue = Array.isArray(value)
		? value[0]?.value || ''
		: value?.value || '';

	const hasValue = props.isMulti
		? multiValue.length > 0
		: singleValue !== '';

	// Handle change for single-select (MUI Select)
	const handleSingleChange = (event: SelectChangeEvent<string>) => {
		const selectedValue = event.target.value;
		const selectedOption = props.selectedOptions.find(
			(opt) => opt.value === selectedValue
		);
		if (selectedOption) {
			props.handleDropdownSelect(selectedOption);
		}
	};

	// Handle change for multi-select or searchable (MUI Autocomplete)
	const handleMultiChange = (
		event: React.SyntheticEvent,
		newValue: SelectOption | SelectOption[]
	) => {
		if (props.isMulti) {
			// For multi-select, return array
			props.handleDropdownSelect(newValue as MultiValue<SelectOption>);
		} else {
			// For single searchable, return single option
			props.handleDropdownSelect(newValue as SelectOption);
		}
	};

	// Custom arrow icon component
	const DropdownIcon = () => (
		<span className="select-mui__arrow">
			{open ? (
				<ArrowUpIcon
					title={translate('app.close')}
					aria-label={translate('app.close')}
					className="tertiary"
				/>
			) : (
				<ArrowDownIcon
					title={translate('app.open')}
					aria-label={translate('app.open')}
					className="tertiary"
				/>
			)}
		</span>
	);

	// Render option with icon if needed
	const renderOption = (optionProps: any, option: SelectOption) => {
		const { key, ...restProps } = optionProps;
		if (props.useIconOption && option.iconLabel) {
			return (
				<li key={key} {...restProps} className="select-mui__option">
					<span className="select-mui__option__icon">
						{option.iconLabel}
					</span>
					<span className="select-mui__option__label">
						{option.label}
					</span>
				</li>
			);
		}
		return (
			<li key={key} {...restProps} className="select-mui__option">
				{option.label}
			</li>
		);
	};

	// Render tag (chip) for multi-select
	const renderTags = (tagValue: SelectOption[], getTagProps: any) => {
		return tagValue.map((option, index) => {
			const { key, ...tagProps } = getTagProps({ index });
			return (
				<Chip
					key={key}
					label={option.label}
					{...tagProps}
					disabled={option.isFixed}
					deleteIcon={
						option.isFixed ? undefined : (
							<CloseCircle
								title={translate('app.delete')}
								aria-label={translate('app.delete')}
							/>
						)
					}
					className={clsx('select-mui__chip', {
						'select-mui__chip--fixed': option.isFixed
					})}
				/>
			);
		});
	};

	// Determine menu position class
	const menuPositionClass = useMemo(() => {
		switch (props.menuPlacement) {
			case MENUPLACEMENT_TOP:
				return 'select-mui--menu-top';
			case MENUPLACEMENT_RIGHT:
				return 'select-mui--menu-right';
			case MENUPLACEMENT_BOTTOM_LEFT:
				return 'select-mui--menu-bottom-left';
			case MENUPLACEMENT_BOTTOM_RIGHT:
				return 'select-mui--menu-bottom-right';
			default:
				return 'select-mui--menu-bottom';
		}
	}, [props.menuPlacement]);

	// Use Autocomplete for multi-select or searchable
	if (props.isMulti || props.isSearchable) {
		return (
			<div
				className={clsx(
					props.className,
					'select-mui__wrapper',
					menuPositionClass,
					{
						'select-mui__wrapper--error': props.hasError
					}
				)}
			>
				<Autocomplete
					id={props.id}
					multiple={props.isMulti}
					value={props.isMulti ? multiValue : (value as SelectOption)}
					onChange={handleMultiChange}
					options={props.selectedOptions}
					getOptionLabel={(option) =>
						typeof option.label === 'string'
							? option.label
							: String(option.value)
					}
					isOptionEqualToValue={(option, val) =>
						option.value === val.value
					}
					open={open}
					onOpen={() => setOpen(true)}
					onClose={() => {
						setOpen(false);
						if (props.isInsideMenu) {
							setTimeout(() => {
								const focusElement = document.getElementById(
									'local-switch-wrapper'
								);
								focusElement?.focus();
							}, 10);
						}
					}}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					disableClearable={!props.isClearable}
					popupIcon={<DropdownIcon />}
					renderInput={(params) => (
						<TextField
							{...params}
							placeholder={props.placeholder}
							variant="outlined"
							label={
								props.selectInputLabel
									? translate(props.selectInputLabel)
									: undefined
							}
							InputLabelProps={{
								shrink: isFocused || hasValue || undefined
							}}
						/>
					)}
					renderOption={renderOption}
					renderTags={props.isMulti ? renderTags : undefined}
					onKeyDown={(e) => props.onKeyDown?.(e)}
					ref={props.selectRef}
					slotProps={{
						popper: {
							placement:
								props.menuPlacement === MENUPLACEMENT_TOP
									? 'top'
									: 'bottom',
							style: {
								position:
									props.menuPosition === 'fixed'
										? 'fixed'
										: 'absolute'
							}
						}
					}}
				/>
				{props.hasError && (
					<div className="select-mui__error">
						<Text text={props.errorMessage} type="infoSmall" />
					</div>
				)}
			</div>
		);
	}

	// Use Select for simple single-select (non-searchable)
	return (
		<div
			className={clsx(
				props.className,
				'select-mui__wrapper',
				menuPositionClass,
				{
					'select-mui__wrapper--error': props.hasError
				}
			)}
		>
			<MuiSelect
				id={props.id}
				value={singleValue}
				onChange={handleSingleChange}
				open={open}
				onOpen={() => setOpen(true)}
				onClose={() => setOpen(false)}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				displayEmpty
				IconComponent={DropdownIcon}
				MenuProps={{
					anchorOrigin: {
						vertical:
							props.menuPlacement === MENUPLACEMENT_TOP
								? 'top'
								: 'bottom',
						horizontal: 'left'
					},
					transformOrigin: {
						vertical:
							props.menuPlacement === MENUPLACEMENT_TOP
								? 'bottom'
								: 'top',
						horizontal: 'left'
					},
					style: {
						position:
							props.menuPosition === 'fixed' ? 'fixed' : 'absolute'
					}
				}}
				renderValue={(selected) => {
					if (!selected) {
						return (
							<span className="select-mui__placeholder">
								{props.placeholder}
							</span>
						);
					}
					const option = props.selectedOptions.find(
						(opt) => opt.value === selected
					);
					if (props.useIconOption && option?.iconLabel) {
						return (
							<div className="select-mui__value-with-icon">
								<span className="select-mui__value__icon">
									{option.iconLabel}
								</span>
								<span>{option.label}</span>
							</div>
						);
					}
					return option?.label;
				}}
				onKeyDown={(e) => props.onKeyDown?.(e)}
				inputRef={props.selectRef}
			>
				{props.placeholder && (
					<MenuItem value="" disabled>
						{props.placeholder}
					</MenuItem>
				)}
				{props.selectedOptions.map((option) => (
					<MenuItem
						key={option.value}
						value={option.value}
						className="select-mui__menu-item"
					>
						{props.useIconOption && option.iconLabel ? (
							<div className="select-mui__option">
								<span className="select-mui__option__icon">
									{option.iconLabel}
								</span>
								<span className="select-mui__option__label">
									{option.label}
								</span>
							</div>
						) : (
							option.label
						)}
					</MenuItem>
				))}
			</MuiSelect>
			{props.selectInputLabel && (
				<label
					className={clsx('select-mui__label', {
						'select-mui__label--active': isFocused || hasValue
					})}
				>
					{translate(props.selectInputLabel)}
				</label>
			)}
			{props.hasError && (
				<div className="select-mui__error">
					<Text text={props.errorMessage} type="infoSmall" />
				</div>
			)}
		</div>
	);
};
