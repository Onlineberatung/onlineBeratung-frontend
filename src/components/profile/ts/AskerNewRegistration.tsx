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
import {
	VALID_POSTCODE_LENGTH,
	validPostcodeLengthForConsultingType
} from '../../postcodeSuggestion/ts/postcodeSuggestion';
import { ajaxCallPostcodeSuggestion } from '../../apiWrapper/ts/ajaxCallPostcode';
import { FETCH_ERRORS } from '../../apiWrapper/ts/fetchData';
import {
	hasConsultingTypeLongPostcodeValidation,
	POSTCODE_FALLBACK_LINK
} from '../../../resources/ts/helpers/resorts';

export const AskerNewRegistration = () => {
	const { userData } = useContext(UserDataContext);
	const [isButtonDisabled, setIsButtonDisabled] = useState(true);
	const [selectedConsultingType, setSelectedConsultingType] = useState(null);
	const [selectedPostcode, setSelectedPostcode] = useState(null);
	const [suggestedAgencies, setSuggestedAgencies] = useState(null);
	const [selectedAgencyId, setSelectedAgencyId] = useState(null);
	const [postcodeFallbackLink, setPostcodeFallbackLink] = useState(null);

	useEffect(() => {
		setSelectedPostcode(null);
		setSelectedAgencyId(null);
	}, [selectedConsultingType]);

	useEffect(() => {
		setSelectedAgencyId(null);
		if (
			selectedPostcode &&
			validPostcodeLengthForConsultingType(
				selectedPostcode.length,
				selectedConsultingType
			)
		) {
			ajaxCallPostcodeSuggestion({
				postcode: selectedPostcode,
				consultingType: selectedConsultingType
			})
				.then((response) => {
					if (
						hasConsultingTypeLongPostcodeValidation(
							selectedConsultingType
						)
					) {
						setSelectedAgencyId(response[0].id);
					} else {
						console.log('Suggested Agencies');
						setSuggestedAgencies(response);
						//TODO: cases to unset suggestedAgencies?
					}
				})
				.catch((error) => {
					if (error.message === FETCH_ERRORS.EMPTY) {
						setPostcodeFallbackLink(
							POSTCODE_FALLBACK_LINK[selectedConsultingType]
						);
						//TODO: cases to unset postcodeFallbackLink?
					}
					return null;
				});
		}
	}, [selectedPostcode]);

	const isAllRequiredDataSet = () =>
		selectedConsultingType &&
		selectedPostcode &&
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
			{postcodeFallbackLink ? (
				<p>
					{translate('warningLabels.postcode.unavailable')}{' '}
					<a
						className="warning__link"
						href={postcodeFallbackLink}
						target="_blank"
					>
						{translate('warningLabels.postcode.search')}
					</a>
				</p>
			) : null}
			<Button
				item={buttonSetRegistration}
				buttonHandle={handleRegistration}
				disabled={isButtonDisabled}
			/>
		</div>
	);
};
