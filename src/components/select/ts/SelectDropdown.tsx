import * as React from 'react';
import Select from 'react-select';
import { components } from 'react-select';

export interface Select {
	value: string;
	label: string;
	iconLabel?: string;
}

export interface SelectDropdownItem {
	id: string;
	selectedOptions: Select[];
	selectInputLabel: string;
	handleDropdownSelect: Function;
	useIconOption: boolean;
	isSearchable: boolean;
	menuPlacement: string;
	defaultValue?: Select;
}

const colourStyles = {
	control: (styles, { isFocused, hasValue }) => {
		return {
			...styles,
			'backgroundColor': 'white',
			'border': isFocused ? '2px solid #3F373F' : '1px solid #8C878C',
			'borderRadius': '25px',
			'height': '50px',
			'outline': isFocused ? '0' : '0',
			'padding': '0 12px',
			'color': '#3F373F',
			'boxShadow': 'inset 0 2px 0 0 rgba(0,0,0,0.1)',
			'&:hover': {
				border: isFocused ? '2px solid #3F373F' : '1px solid #3F373F'
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
	input: (styles) => ({
		...styles,
		paddingTop: '12px'
	}),
	option: (styles, { isFocused }) => {
		return {
			...styles,
			backgroundColor: isFocused ? '#F8DEDD' : '#fff',
			color: isFocused ? '#CC1E1C' : '#3F373F',
			textAlign: 'left',
			lineHeight: '48px',
			paddingTop: '0',
			paddingBottom: '0'
		};
	},
	menuList: (styles) => ({
		...styles,
		padding: '0',
		border: '1px solid #C4BFC4',
		borderRadius: '4px',
		boxShadow: '0 3px 0 1px rgba(0, 0, 0, 0.1)'
	}),
	menu: (styles, { menuPlacement }) => ({
		...styles,
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
			borderTop:
				menuPlacement === 'top' ? '10px solid rgba(0,0,0,0.1)' : 'none',
			borderBottom:
				menuPlacement === 'top' ? 'none' : '10px solid rgba(0,0,0,0.1)',
			bottom: menuPlacement === 'top' ? '-14px' : 'auto',
			top: menuPlacement === 'top' ? 'auto' : '-10px',
			zIndex: 1
		}
	})
};

export const SelectDropdown = (props: SelectDropdownItem) => {
	const IconOption = (props) => (
		<components.Option {...props} className="select__option">
			<span className="select__option__icon">{props.data.iconLabel}</span>
			<p className="select__option__label">{props.data.label}</p>
		</components.Option>
	);

	const IconDropdown = (props) => (
		<components.DropdownIndicator {...props}>
			<span
				id="selectIcon"
				className={
					props.selectProps.menuIsOpen
						? `select__input__iconWrapper select__input__iconWrapper--up`
						: `select__input__iconWrapper select__input__iconWrapper--down`
				}
			></span>
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

	return (
		<div className="select__wrapper">
			<Select
				id={props.id}
				className="select__input"
				components={{
					Option: props.useIconOption
						? IconOption
						: components.Option,
					DropdownIndicator: IconDropdown,
					ValueContainer: CustomValueContainer,
					IndicatorSeparator: !props.isSearchable
						? () => null
						: components.IndicatorSeparator
				}}
				value={props.defaultValue ? props.defaultValue : null}
				defaultValue={props.defaultValue ? props.defaultValue : null}
				onChange={props.handleDropdownSelect}
				options={props.selectedOptions}
				noOptionsMessage={() => null}
				menuPlacement={props.menuPlacement}
				placeholder={''}
				isSearchable={props.isSearchable}
				styles={colourStyles}
			/>
		</div>
	);
};
