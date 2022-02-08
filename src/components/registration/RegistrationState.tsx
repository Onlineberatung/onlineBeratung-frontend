import * as React from 'react';
import { useEffect, useState } from 'react';
import { SelectDropdown, SelectDropdownItem } from '../select/SelectDropdown';
import {
	AccordionItemValidity,
	RegistrationDropdownSelectData,
	VALIDITY_INITIAL,
	VALIDITY_VALID
} from './registrationHelpers';

interface RegistrationStateProps {
	onStateChange: Function;
	onValidityChange: Function;
	dropdownSelectData: RegistrationDropdownSelectData;
}

export const RegistrationState = ({
	onStateChange,
	onValidityChange,
	dropdownSelectData
}: RegistrationStateProps) => {
	const [state, setState] = useState<string>();
	const [isValid, setIsValid] =
		useState<AccordionItemValidity>(VALIDITY_INITIAL);
	const stateData = dropdownSelectData.options;

	useEffect(() => {
		onValidityChange(isValid);
	}, [isValid]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		state ? setIsValid(VALIDITY_VALID) : setIsValid(VALIDITY_INITIAL);
		onStateChange(state);
	}, [state]); // eslint-disable-line react-hooks/exhaustive-deps

	const getOptionOfSelectedState = () => {
		return stateData.filter((option) => option.value === state)[0];
	};

	const stateSelectDropdown: SelectDropdownItem = {
		handleDropdownSelect: (e) => setState(e.value),
		id: 'stateSelect',
		selectedOptions: stateData,
		selectInputLabel: dropdownSelectData.label,
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
