import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { translate } from '../../../resources/ts/i18n/translate';
import { UserDataContext, AgencyDataInterface } from '../../../globalState';
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
import { extendPostcodeToBeValid } from '../../registrationFormular/ts/handleRegistration';

export const AskerNewRegistration = () => {
	const { userData } = useContext(UserDataContext);
	const [isButtonDisabled, setIsButtonDisabled] = useState(true);
	const [selectedConsultingType, setSelectedConsultingType] = useState(null);
	const [selectedPostcode, setSelectedPostcode] = useState(null);
	const [suggestedAgencies, setSuggestedAgencies] = useState(null);
	const [selectedAgencyId, setSelectedAgencyId] = useState(null);
	const [postcodeExtended, setPostcodeExtended] = useState(false);
	const [postcodeFallbackLink, setPostcodeFallbackLink] = useState(null);

	useEffect(() => {
		setSelectedPostcode(null);
		setPostcodeFallbackLink(null);
		setSelectedAgencyId(null);
		setSuggestedAgencies(null);
	}, [selectedConsultingType]);

	useEffect(() => {
		if (!postcodeExtended) {
			setSelectedAgencyId(null);
			setPostcodeFallbackLink(null);
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
							setSuggestedAgencies(response);
						}
					})
					.catch((error) => {
						if (error.message === FETCH_ERRORS.EMPTY) {
							setPostcodeFallbackLink(
								POSTCODE_FALLBACK_LINK[selectedConsultingType]
							);
						}
						return null;
					});
			}
		} else {
			setPostcodeExtended(false);
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
		disabled: !selectedConsultingType,
		postcodeFallbackLink: postcodeFallbackLink
	};

	const handleAgencySelection = (agencyId: number) => {
		setSuggestedAgencies(null);
		setSelectedPostcode(extendPostcodeToBeValid(selectedPostcode));
		setPostcodeExtended(true);
		setSelectedAgencyId(agencyId);
	};

	const handleRegistration = () => {
		if (isAllRequiredDataSet()) {
			console.log('TODO: send registration');
		}
	};

	return (
		<div className="profile__data__itemWrapper askerRegistration">
			<p className="askerRegistration__headline">
				{translate('profile.data.register.headline')}
			</p>
			<SelectDropdown {...consultingTypesDropdown} />

			<div className="askerRegistration__postcode">
				<InputField
					item={postcodeInputItem}
					inputHandle={(e) => setSelectedPostcode(e.target.value)}
				></InputField>

				{suggestedAgencies ? (
					<div className="askerRegistration__postcodeFlyout">
						{suggestedAgencies.map(
							(agency: AgencyDataInterface, index) => (
								<div
									className="askerRegistration__postcodeFlyout__content"
									key={index}
									onClick={() =>
										handleAgencySelection(agency.id)
									}
								>
									{agency.teamAgency ? (
										<div className="askerRegistration__postcodeFlyout__teamagency">
											{agency.teamAgency}
										</div>
									) : null}
									{agency.postcode ? (
										<div className="askerRegistration__postcodeFlyout__postcode">
											{agency.postcode}
										</div>
									) : null}
									{agency.name ? (
										<div className="askerRegistration__postcodeFlyout__name">
											{agency.name}
										</div>
									) : null}
									{agency.description ? (
										<div
											className="askerRegistration__postcodeFlyout__description"
											dangerouslySetInnerHTML={{
												__html: agency.description
											}}
										></div>
									) : null}
								</div>
							)
						)}
					</div>
				) : null}
			</div>
			<Button
				item={buttonSetRegistration}
				buttonHandle={handleRegistration}
				disabled={isButtonDisabled}
			/>
		</div>
	);
};
