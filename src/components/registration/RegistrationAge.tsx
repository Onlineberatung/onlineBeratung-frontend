import * as React from 'react';
import { useEffect, useState } from 'react';
import { SelectDropdown, SelectDropdownItem } from '../select/SelectDropdown';
import {
	AccordionItemValidity,
	RegistrationDropdownSelectData
} from './registrationHelpers';

interface RegistrationAgeProps {
	onAgeChange: Function;
	onValidityChange: Function;
	dropdownSelectData: RegistrationDropdownSelectData;
}

export const RegistrationAge = (props: RegistrationAgeProps) => {
	const [age, setAge] = useState<string>();
	const [isValid, setIsValid] = useState<AccordionItemValidity>('initial');

	useEffect(() => {
		props.onValidityChange(isValid);
	}, [isValid, props]);

	useEffect(() => {
		age ? setIsValid('valid') : setIsValid('initial');
		props.onAgeChange(age);
	}, [age, props]);

	const getOptionOfSelectedAge = () => {
		return props.dropdownSelectData.options.filter(
			(option: any) => option.value === age
		)[0];
	};

	const ageSelectDropdown: SelectDropdownItem = {
		handleDropdownSelect: (e) => setAge(e.value),
		id: 'ageSelect',
		selectedOptions: props.dropdownSelectData.options,
		selectInputLabel: props.dropdownSelectData.label,
		useIconOption: false,
		isSearchable: false,
		menuPlacement: 'bottom',
		defaultValue: getOptionOfSelectedAge()
	};

	return (
		<div>
			<SelectDropdown {...ageSelectDropdown} />
		</div>
	);
};
