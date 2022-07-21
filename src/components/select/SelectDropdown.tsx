import clsx from 'clsx';
import * as React from 'react';
import Select from 'react-select';
import { components } from 'react-select';
import { CloseCircle } from '../../resources/img/icons';
import { ReactComponent as ArrowDownIcon } from '../../resources/img/icons/arrow-down-light.svg';
import { ReactComponent as ArrowUpIcon } from '../../resources/img/icons/arrow-up-light.svg';
import { Text } from '../text/Text';
import './select.react.styles';
import './select.styles';
import { useResponsive } from '../../hooks/useResponsive';

export interface SelectOption {
	value: string;
	label: string;
	iconLabel?: string;
	isFixed?: boolean;
}

export interface SelectDropdownItem {
	className?: string;
	id: string;
	selectedOptions: SelectOption[];
	selectInputLabel?: string;
	handleDropdownSelect: Function;
	useIconOption?: boolean;
	isSearchable?: boolean;
	isMulti?: boolean;
	isClearable?: boolean;
	menuPlacement: 'top' | 'bottom';
	defaultValue?: SelectOption | SelectOption[];
	hasError?: boolean;
	errorMessage?: string;
	onKeyDown?: Function;
}

const colourStyles = (fromL) => ({
	control: (styles, { isFocused, hasValue }) => {
		return {
			...styles,
			'backgroundColor': 'white',
			'border': isFocused ? '2px solid #3F373F' : '1px solid #8C878C',
			'borderRadius': undefined,
			'height': '50px',
			'outline': isFocused ? '0' : '0',
			'padding': isFocused ? '0 11px' : '0 12px',
			'color': '#3F373F',
			'boxShadow': undefined,
			'&:hover': {
				border: isFocused ? '2px solid #3F373F' : '1px solid #3F373F',
				padding: isFocused ? '0 11px' : '0 12px'
			},
			'.select__inputLabel': {
				fontSize: isFocused || hasValue ? '12px' : '16px',
				top: isFocused || hasValue ? '4px' : '14px',
				transition: 'font-size .5s, top .5s',
				color: '#8C878C',
				position: 'absolute',
				marginLeft: '3px'
			}
		};
	},
	singleValue: (styles) => ({
		...styles,
		top: '60%'
	}),
	input: (styles, state) => {
		return state.isMulti
			? styles
			: {
					...styles,
					paddingTop: '12px'
			  };
	},
	option: (styles) => {
		return {
			...styles,

			// Use values from stylesheet
			color: undefined,
			backgroundColor: undefined,

			textAlign: 'left',
			lineHeight: '21px'
		};
	},
	menuList: (styles) => ({
		...styles,
		...(!fromL && { maxHeight: '150px' }),
		padding: '0',
		border: undefined,
		borderRadius: '4px',
		boxShadow: undefined
	}),
	menu: (styles, { menuPlacement }) => ({
		...styles,
		'boxShadow': undefined,
		'marginBottom': menuPlacement === 'top' ? '16px' : '0',
		'marginTop': menuPlacement === 'top' ? '0' : '16px',
		'&:after, &:before': {
			content: `''`,
			position: 'absolute',
			borderLeft: '10px solid transparent',
			borderRight: '10px solid transparent',
			borderTop: menuPlacement === 'top' ? '10px solid #fff' : 'none',
			borderBottom: menuPlacement === 'top' ? 'none' : '10px solid #fff',
			marginTop: '-1px',
			marginLeft: '-12px',
			bottom: menuPlacement === 'top' ? '-9px' : 'auto',
			top: menuPlacement === 'top' ? 'auto' : '-8px',
			zIndex: 2
		},
		'&:before': {
			left: '50%',
			borderTop:
				menuPlacement === 'top' ? '10px solid rgba(0,0,0,0.1)' : 'none',
			borderBottom:
				menuPlacement === 'top' ? 'none' : '10px solid rgba(0,0,0,0.1)',
			bottom: menuPlacement === 'top' ? '-14px' : 'auto',
			top: menuPlacement === 'top' ? 'auto' : '-10px',
			zIndex: 1
		}
	}),
	multiValue: (styles, state) => {
		const common = {
			margin: '4px'
		};
		return state.data.isFixed
			? {
					...styles,
					...common,
					'border': '1px solid rgba(0,0,0,0.2) !important',
					'backgroundColor': 'transparent !important',
					'&:hover': {
						'border': '1px solid rgba(0,0,0,0.2) !important',
						'backgroundColor': 'transparent !important',
						'& > .select__input__multi-value__label': {
							color: 'rgba(0,0,0,0.8) !important'
						}
					}
			  } // important is needed for fixed option to overwrite color from scss
			: { ...styles, ...common, border: '1px solid transparent' };
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
					...styles,
					...common,
					'color': 'rgba(0,0,0,0.8) !important',
					'&:hover': {
						color: 'rgba(0,0,0,0.8) !important'
					}
			  } // important is needed for fixed option to overwrite color from scss
			: {
					...styles,
					...common,
					paddingRight: '4px'
			  };
	},
	multiValueRemove: (styles, state) => {
		return state.data.isFixed
			? { ...styles, display: 'none' }
			: {
					...styles,
					'paddingRight': '8px',
					'cursor': 'pointer',
					'opacity': 1,
					'backgroundColor': 'transparent',
					'&:hover': {
						backgroundColor: 'transparent'
					}
			  };
	},
	indicatorSeparator: (styles, state) => {
		return {
			...styles,
			display: 'none'
		};
	}
});

export const SelectDropdown = (props: SelectDropdownItem) => {
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
					<ArrowUpIcon />
				) : (
					<ArrowDownIcon />
				)}
			</span>
		</components.DropdownIndicator>
	);

	const currentSelectInputLabel = props.selectInputLabel;
	const CustomValueContainer = ({ children, ...props }) => (
		<components.ValueContainer {...props} className="select__inputWrapper">
			{React.Children.map(children, (child) => child)}
			<label className="select__inputLabel">
				{currentSelectInputLabel}
			</label>
		</components.ValueContainer>
	);

	const CustomMultiValueRemove = (props) => {
		return (
			<components.MultiValueRemove {...props}>
				<CloseCircle />
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
				menuPlacement={props.menuPlacement}
				placeholder={''}
				isClearable={props.isClearable}
				isSearchable={props.isSearchable}
				isMulti={props.isMulti}
				styles={colourStyles(fromL)}
				onKeyDown={(e) => (props.onKeyDown ? props.onKeyDown(e) : null)}
			/>
			{props.hasError && (
				<div className="select__error">
					<Text text={props.errorMessage} type="infoSmall" />
				</div>
			)}
		</div>
	);
};
