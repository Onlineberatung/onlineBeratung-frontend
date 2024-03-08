import clsx from 'clsx';
import * as React from 'react';
import Select, { defaultStyles } from 'react-select';
import { components } from 'react-select';
import { CloseCircle } from '../../resources/img/icons';
import { ReactComponent as ArrowDownIcon } from '../../resources/img/icons/arrow-down-light.svg';
import { ReactComponent as ArrowUpIcon } from '../../resources/img/icons/arrow-up-light.svg';
import { Text } from '../text/Text';
import './select.react.styles';
import './select.styles';
import { useResponsive } from '../../hooks/useResponsive';
import { useTranslation } from 'react-i18next';
import { ReactNode } from 'react';

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

export interface SelectDropdownItem {
	className?: string;
	id: string;
	selectedOptions: SelectOption[];
	selectInputLabel?: string;
	placeholder?: string;
	handleDropdownSelect: Function;
	useIconOption?: boolean;
	isSearchable?: boolean;
	isMulti?: boolean;
	isClearable?: boolean;
	menuPlacement: 'top' | 'bottom' | 'right';
	menuPosition?: 'absolute' | 'fixed';
	defaultValue?: SelectOption | SelectOption[];
	hasError?: boolean;
	errorMessage?: string;
	onKeyDown?: Function;
	styleOverrides?: defaultStyles;
	selectRef?: any;
	isInsideMenu?: boolean;
	menuShouldBlockScroll?: boolean;
}

const colourStyles = (
	fromL,
	menuPlacement,
	{
		control,
		singleValue,
		input,
		option,
		menuList,
		menu,
		multiValue,
		multiValueLabel,
		multiValueRemove,
		indicatorSeparator,
		...overrides
	}: defaultStyles
) => ({
	control: (styles, state) => {
		return {
			...styles,
			'backgroundColor': 'white',
			'border': state.isFocused
				? '2px solid #3F373F'
				: '1px solid #8C878C',
			'borderRadius': undefined,
			'height': '50px',
			'outline': '0',
			'padding': state.isFocused ? '0 11px' : '0 12px',
			'color': '#3F373F',
			'boxShadow': undefined,
			'cursor': 'pointer',
			'&:hover': {
				border: state.isFocused
					? '2px solid #3F373F'
					: '1px solid #3F373F',
				padding: state.isFocused ? '0 11px' : '0 12px'
			},
			'.select__inputLabel': {
				fontSize: state.isFocused || state.hasValue ? '12px' : '16px',
				top: state.isFocused || state.hasValue ? '0px' : '14px',
				transition: 'font-size .5s, top .5s',
				color: 'rgba(0, 0, 0, 0.6)',
				position: 'absolute',
				marginLeft: '3px',
				cursor: 'pointer'
			},
			...(control?.(styles, state) ?? {})
		};
	},
	singleValue: (styles, state) => ({
		...styles,
		top: '60%',
		...(singleValue?.(styles, state) ?? {})
	}),
	input: (styles, state) => {
		return state.isMulti
			? {
					...styles,
					...(input?.(styles, state) ?? {})
				}
			: {
					...styles,
					paddingTop: '12px',
					cursor: 'pointer',
					...(input?.(styles, state) ?? {})
				};
	},
	option: (styles, state) => {
		return {
			...styles,

			// Use values from stylesheet
			color: undefined,
			backgroundColor: undefined,

			textAlign: 'left',
			lineHeight: '21px',
			cursor: 'pointer',
			...(option?.(styles, state) ?? {})
		};
	},
	menuList: (styles, state) => ({
		...styles,
		...(!fromL && { maxHeight: '150px' }),
		padding: '0',
		border: undefined,
		borderRadius: '4px',
		boxShadow: undefined,
		...(menuList?.(styles, state) ?? {})
	}),
	menu: (styles, state) => ({
		...styles,
		'marginTop': state.menuPlacement === 'top' ? '0' : '16px',
		'fontWeight': 'normal',
		...(menuPlacement === 'right'
			? {
					bottom: '0',
					left: '100%',
					top: 'auto',
					marginLeft: '16px',
					marginBottom: 0,
					width: 'auto'
				}
			: {
					marginBottom: state.menuPlacement === 'top' ? '16px' : '0'
				}),
		'boxShadow': undefined,
		'&:after, &:before': {
			content: `''`,
			position: 'absolute',
			marginTop: '-1px',
			marginLeft: '-12px',
			bottom: state.menuPlacement === 'top' ? '-9px' : 'auto',
			top: state.menuPlacement === 'top' ? 'auto' : '-8px',
			zIndex: 2,
			...(menuPlacement === 'right'
				? {
						left: '0',
						bottom: '5%',
						top: 'auto',
						borderTop: '10px solid transparent',
						borderBottom: '10px solid transparent',
						borderLeft: 'none',
						borderRight: '10px solid #fff',
						height: '12px',
						width: '12px'
					}
				: {
						borderLeft: '10px solid transparent',
						borderRight: '10px solid transparent',
						borderTop:
							state.menuPlacement === 'top'
								? '10px solid #fff'
								: 'none',
						borderBottom:
							state.menuPlacement === 'top'
								? 'none'
								: '10px solid #fff'
					})
		},
		'&:before': {
			zIndex: 1,
			...(menuPlacement === 'right'
				? {
						left: '0',
						bottom: '5%',
						top: 'auto',
						borderTop: '10px solid transparent',
						borderBottom: '10px solid transparent',
						borderLeft: 'none',
						borderRight: '10px solid rgba(0,0,0,0.1)'
					}
				: {
						left: '50%',
						bottom:
							state.menuPlacement === 'top' ? '-14px' : 'auto',
						top: state.menuPlacement === 'top' ? 'auto' : '-10px',
						borderTop:
							state.menuPlacement === 'top'
								? '10px solid rgba(0,0,0,0.1)'
								: 'none',
						borderBottom:
							state.menuPlacement === 'top'
								? 'none'
								: '10px solid rgba(0,0,0,0.1)'
					})
		},
		...(menu?.(styles, state) ?? {})
	}),
	multiValue: (styles, state) => {
		const common = {
			margin: '4px'
		};
		return state.data.isFixed
			? {
					...styles,
					...common,
					// important is needed for fixed option to overwrite color from scss
					'border': '1px solid rgba(0,0,0,0.2) !important',
					'backgroundColor': 'transparent !important',
					'&:hover': {
						'border': '1px solid rgba(0,0,0,0.2) !important',
						'backgroundColor': 'transparent !important',
						'& > .select__input__multi-value__label': {
							color: 'rgba(0,0,0,0.8) !important'
						}
					},
					...(multiValue?.(styles, state) ?? {})
				}
			: {
					...styles,
					...common,
					border: '1px solid transparent',
					...(multiValue?.(styles, state) ?? {})
				};
	},
	multiValueLabel: (styles, state) => {
		const common = {
			paddingLeft: '11px',
			paddingRight: '11px',
			paddingTop: '3px',
			paddingBottom: '3px'
		};
		return state.data.isFixed
			? {
					// important is needed for fixed option to overwrite color from scss
					...styles,
					...common,
					'color': 'rgba(0,0,0,0.8) !important',
					'&:hover': {
						color: 'rgba(0,0,0,0.8) !important'
					},
					'cursor': 'pointer',
					...(multiValueLabel?.(styles, state) ?? {})
				}
			: {
					...styles,
					...common,
					paddingRight: '4px',
					cursor: 'pointer',
					...(multiValueLabel?.(styles, state) ?? {})
				};
	},
	multiValueRemove: (styles, state) =>
		state.data.isFixed
			? {
					...styles,
					display: 'none',
					...(multiValueRemove?.(styles, state) ?? {})
				}
			: {
					...styles,
					'paddingRight': '8px',
					'cursor': 'pointer',
					'opacity': 1,
					'backgroundColor': 'transparent',
					'&:hover': {
						backgroundColor: 'transparent'
					},
					...(multiValueRemove?.(styles, state) ?? {})
				},
	indicatorSeparator: (styles, state) => ({
		...styles,
		display: 'none',
		cursor: 'pointer',
		...(indicatorSeparator?.(styles, state) ?? {})
	}),
	...overrides
});

export const SelectDropdown = (props: SelectDropdownItem) => {
	const { t: translate } = useTranslation();
	const { fromL } = useResponsive();

	const IconOption = (props) => (
		<components.Option {...props} className="select__option">
			<span className="select__option__icon">{props.data.iconLabel}</span>
			<p className="select__option__label">{props.data.label}</p>
		</components.Option>
	);

	const IconDropdown = (props) => (
		<components.DropdownIndicator {...props}>
			<span id="selectIcon" className="select__input__iconWrapper">
				{props.selectProps.menuIsOpen ? (
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
		</components.DropdownIndicator>
	);

	const currentSelectInputLabel = props.selectInputLabel;
	const CustomValueContainer = ({ children, ...props }) => (
		<components.ValueContainer {...props} className="select__inputWrapper">
			{React.Children.map(children, (child) => child)}
			<label className="select__inputLabel">
				{translate(currentSelectInputLabel)}
			</label>
		</components.ValueContainer>
	);

	const CustomMultiValueRemove = (props) => {
		return (
			<components.MultiValueRemove {...props}>
				<CloseCircle
					title={translate('app.delete')}
					aria-label={translate('app.delete')}
				/>
			</components.MultiValueRemove>
		);
	};

	return (
		<div className={clsx(props.className, 'select__wrapper')}>
			<Select
				id={props.id}
				className={`select__input ${
					props.hasError ? 'select__input--error' : ''
				}`}
				classNamePrefix="select__input"
				components={{
					Option: props.useIconOption
						? IconOption
						: components.Option,
					DropdownIndicator: IconDropdown,
					ValueContainer: props.selectInputLabel
						? CustomValueContainer
						: components.ValueContainer,
					IndicatorSeparator: !props.isSearchable
						? () => null
						: components.IndicatorSeparator,
					MultiValueRemove: CustomMultiValueRemove
				}}
				value={props.defaultValue ? props.defaultValue : null}
				defaultValue={props.defaultValue ? props.defaultValue : null}
				onChange={props.handleDropdownSelect}
				options={props.selectedOptions}
				noOptionsMessage={() => null}
				menuPosition={props.menuPosition}
				menuShouldBlockScroll={props.menuShouldBlockScroll}
				menuPlacement={
					props.menuPlacement === 'right'
						? 'bottom'
						: props.menuPlacement
				}
				placeholder={props.placeholder ? props.placeholder : ''}
				isClearable={props.isClearable}
				isSearchable={props.isSearchable}
				isMulti={props.isMulti}
				styles={colourStyles(
					fromL,
					props.menuPlacement,
					props.styleOverrides ?? {}
				)}
				onKeyDown={(e) => (props.onKeyDown ? props.onKeyDown(e) : null)}
				tabIndex={props.isInsideMenu ? -1 : 0}
				ref={props.selectRef}
				openMenuOnFocus={props.isInsideMenu ? true : false}
				closeMenuOnSelect={true}
				onMenuClose={() => {
					if (props.isInsideMenu) {
						setTimeout(() => {
							document
								.getElementById('local-switch-wrapper')
								.focus();
						}, 10); //we need this timeout because the menu is not closed when switching the focus
					}
				}}
			/>
			{props.hasError && (
				<div className="select__error">
					<Text text={props.errorMessage} type="infoSmall" />
				</div>
			)}
		</div>
	);
};
