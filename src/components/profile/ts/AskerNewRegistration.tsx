import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { translate } from '../../../resources/ts/i18n/translate';
import { UserDataContext } from '../../../globalState';
import { Button } from '../../button/ts/Button';
import {
	SelectDropdown,
	SelectDropdownItem
} from '../../select/ts/SelectDropdown';
import { InputField, InputFieldItemTSX } from '../../inputField/ts/InputField';
import {
	consultingTypeSelectOptionsSet,
	buttonSetRegistration
} from './profileHelpers';
import { VALID_POSTCODE_LENGTH } from '../../postcodeSuggestion/ts/postcodeSuggestion';

export const AskerNewRegistration = () => {
	const { userData } = useContext(UserDataContext);
	const [isButtonDisabled, setIsButtonDisabled] = useState(true);
	const [selectedConsultingType, setSelectedConsultingType] = useState(null);
	const [selectedPostcode, setSelectedPostcode] = useState('');
	const [selectedAgencyId, setSelectedAgencyId] = useState(null);

	useEffect(() => {
		setSelectedPostcode('');
		setSelectedAgencyId(null);
	}, [selectedConsultingType]);

	useEffect(() => {
		console.log('POSTCODE CHANGED', selectedPostcode);
		setSelectedAgencyId(null);
		//TODO: POSTCODE LOGIC from registration!
	}, [selectedPostcode]);

	const isAllRequiredDataSet = () =>
		selectedConsultingType &&
		selectedPostcode.length === VALID_POSTCODE_LENGTH.MAX &&
		selectedAgencyId;

	useEffect(() => {
		if (isAllRequiredDataSet()) {
			setIsButtonDisabled(false);
		} else {
			setIsButtonDisabled(true);
		}
	}, [selectedAgencyId]);

	const handleConsultingTypeSelect = (selectedOption) => {
		setSelectedConsultingType(selectedOption.value);
	};

	const getOptionOfSelectedConsultingType = () => {
		return consultingTypeSelectOptionsSet(userData).filter(
			(option) => option.value == (selectedConsultingType as any)
		)[0];
	};

	const consultingTypesDropdown: SelectDropdownItem = {
		id: 'consultingTypeSelect',
		selectedOptions: consultingTypeSelectOptionsSet(userData),
		handleDropdownSelect: handleConsultingTypeSelect,
		selectInputLabel: translate(
			'profile.data.register.consultingTypeSelect.label'
		),
		useIconOption: false,
		isSearchable: false,
		menuPlacement: 'top',
		defaultValue: getOptionOfSelectedConsultingType()
	};

	const postcodeInputItem: InputFieldItemTSX = {
		name: 'postcode',
		class: 'asker__registration__postcodeInput',
		id: 'postcode',
		type: 'text',
		infoText: translate('profile.data.register.postcodeInput.infoText'),
		labelTranslatable: 'profile.data.register.postcodeInput.label',
		content: selectedPostcode,
		maxLength: VALID_POSTCODE_LENGTH.MAX,
		pattern: '^[0-9]+$',
		disabled: !selectedConsultingType
	};

	const handleRegistration = () => {
		if (isAllRequiredDataSet) {
			console.log('TODO: handle registration');
		}
	};

	return (
		<div className="profile__data__itemWrapper asker__registration">
			<p>{translate('profile.data.register.headline')}</p>
			<SelectDropdown {...consultingTypesDropdown} />
			<InputField
				item={postcodeInputItem}
				inputHandle={(e) => setSelectedPostcode(e.target.value)}
			></InputField>

			<Button
				item={buttonSetRegistration}
				buttonHandle={handleRegistration}
				disabled={isButtonDisabled}
			/>
		</div>
	);
};
