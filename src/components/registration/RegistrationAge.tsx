import * as React from 'react';
import { useEffect, useState } from 'react';
import { SelectDropdown, SelectDropdownItem } from '../select/SelectDropdown';
import {
	AccordionItemValidity,
	RegistrationDropdownSelectData,
	VALIDITY_INITIAL,
	VALIDITY_VALID
} from './registrationHelpers';

interface RegistrationAgeProps {
	onAgeChange: Function;
	onValidityChange: Function;
	dropdownSelectData: RegistrationDropdownSelectData;
	onKeyDown: Function;
}

export const RegistrationAge = ({
	onValidityChange,
	onAgeChange,
	dropdownSelectData,
	onKeyDown
}: RegistrationAgeProps) => {
	const [age, setAge] = useState<string>();
	const [isValid, setIsValid] =
		useState<AccordionItemValidity>(VALIDITY_INITIAL);

	useEffect(() => {
		onValidityChange(isValid);
	}, [isValid]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		setIsValid(age ? VALIDITY_VALID : VALIDITY_INITIAL);
		onAgeChange(age);
	}, [age]); // eslint-disable-line react-hooks/exhaustive-deps

	const getOptionOfSelectedAge = () => {
		return dropdownSelectData.options.filter(
			(option: any) => option.value === age
		)[0];
	};

	const ageSelectDropdown: SelectDropdownItem = {
		handleDropdownSelect: (e) => setAge(e.value),
		id: 'ageSelect',
		selectedOptions: dropdownSelectData.options,
		selectInputLabel: dropdownSelectData.label,
		useIconOption: false,
		isSearchable: false,
		menuPlacement: 'bottom',
		defaultValue: getOptionOfSelectedAge()
	};

	return (
		<div>
			<SelectDropdown {...ageSelectDropdown} onKeyDown={onKeyDown} />
		</div>
	);
};
