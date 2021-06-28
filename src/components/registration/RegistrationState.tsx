import * as React from 'react';
import { useEffect, useState } from 'react';
import { SelectDropdown, SelectDropdownItem } from '../select/SelectDropdown';
import {
	AccordionItemValidity,
	RegistrationDropdownSelectData
} from './registrationHelpers';

interface RegistrationStateProps {
	onStateChange: Function;
	onValidityChange: Function;
	dropdownSelectData: RegistrationDropdownSelectData;
}

export const RegistrationState = (props: RegistrationStateProps) => {
	const [state, setState] = useState<string>();
	const [isValid, setIsValid] = useState<AccordionItemValidity>('initial');
	const stateData = props.dropdownSelectData.options;

	useEffect(() => {
		props.onValidityChange(isValid);
	}, [isValid, props]);

	useEffect(() => {
		state ? setIsValid('valid') : setIsValid('initial');
		props.onStateChange(state);
	}, [state, props]);

	const getOptionOfSelectedState = () => {
		return stateData.filter((option) => option.value === state)[0];
	};

	const stateSelectDropdown: SelectDropdownItem = {
		handleDropdownSelect: (e) => setState(e.value),
		id: 'stateSelect',
		selectedOptions: stateData,
		selectInputLabel: props.dropdownSelectData.label,
		useIconOption: false,
		isSearchable: false,
		menuPlacement: 'bottom',
		defaultValue: getOptionOfSelectedState()
	};

	return (
		<div>
			<SelectDropdown {...stateSelectDropdown} />
		</div>
	);
};
