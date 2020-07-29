import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { translate } from '../../../resources/ts/i18n/translate';
import {
	UserDataContext,
	AgencyDataInterface,
	AcceptedGroupIdContext
} from '../../../globalState';
import { history } from '../../app/ts/app';
import { Button } from '../../button/ts/Button';
import {
	SelectDropdown,
	SelectDropdownItem
} from '../../select/ts/SelectDropdown';
import { InputField, InputFieldItemTSX } from '../../inputField/ts/InputField';
import {
	consultingTypeSelectOptionsSet,
	buttonSetRegistration,
	overlayItemNewRegistrationSuccess,
	overlayItemNewRegistrationError
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
import { ajaxCallRegistrationNewConsultingTypes } from '../../apiWrapper/ts/ajaxCallRegistrationNewConsultingType';
import {
	OverlayWrapper,
	Overlay,
	OVERLAY_FUNCTIONS
} from '../../overlay/ts/Overlay';
import { logout } from '../../logout/ts/logout';
import {
	setProfileWrapperInactive,
	mobileListView
} from '../../app/ts/navigationHandler';

export const AskerNewRegistration = () => {
	let postcodeFlyoutRef: React.RefObject<HTMLDivElement> = React.useRef();
	const { userData } = useContext(UserDataContext);
	const [isButtonDisabled, setIsButtonDisabled] = useState(true);
	const [selectedConsultingType, setSelectedConsultingType] = useState(null);
	const [selectedPostcode, setSelectedPostcode] = useState(null);
	const [typedPostcode, setTypedPostcode] = useState(null);
	const [suggestedAgencies, setSuggestedAgencies] = useState(null);
	const [selectedAgencyId, setSelectedAgencyId] = useState(null);
	const [postcodeExtended, setPostcodeExtended] = useState(false);
	const [postcodeFallbackLink, setPostcodeFallbackLink] = useState(null);
	const [overlayActive, setOverlayActive] = useState(false);
	const [overlayItem, setOverlayItem] = useState(null);
	const { setAcceptedGroupId } = useContext(AcceptedGroupIdContext);

	const isAllRequiredDataSet = () =>
		selectedConsultingType &&
		selectedPostcode &&
		selectedPostcode.length === VALID_POSTCODE_LENGTH.MAX &&
		selectedAgencyId &&
		typedPostcode;

	useEffect(() => {
		setSelectedPostcode(null);
		setPostcodeFallbackLink(null);
		setSelectedAgencyId(null);
		setSuggestedAgencies(null);
	}, [selectedConsultingType]);

	useEffect(() => {
		if (!postcodeExtended) {
			setSelectedAgencyId(null);
			setTypedPostcode(null);
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
							setTypedPostcode(selectedPostcode);
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
			} else if (suggestedAgencies) {
				setSuggestedAgencies(false);
			}
		} else {
			setPostcodeExtended(false);
		}
	}, [selectedPostcode]);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				postcodeFlyoutRef.current &&
				!postcodeFlyoutRef.current.contains(event.target)
			) {
				setSuggestedAgencies(null);
			}
		};
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, [postcodeFlyoutRef]);

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

	const handleAgencySelection = (agency: AgencyDataInterface) => {
		setSuggestedAgencies(null);
		const fulllengthPostcode = extendPostcodeToBeValid(selectedPostcode);
		setTypedPostcode(fulllengthPostcode);
		agency.postcode
			? setSelectedPostcode(agency.postcode)
			: setSelectedPostcode(fulllengthPostcode);
		setPostcodeExtended(true);
		setSelectedAgencyId(agency.id);
	};

	const handleRegistration = () => {
		if (isAllRequiredDataSet()) {
			ajaxCallRegistrationNewConsultingTypes(
				selectedConsultingType,
				selectedAgencyId,
				typedPostcode
			)
				.then((response) => {
					setOverlayItem(overlayItemNewRegistrationSuccess);
					setOverlayActive(true);
					setAcceptedGroupId(response.sessionId);
				})
				.catch((error) => {
					setOverlayItem(overlayItemNewRegistrationError);
					setOverlayActive(true);
				});
		}
	};

	const handleOverlayAction = (buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECT) {
			setProfileWrapperInactive();
			mobileListView();
			history.push({
				pathname: `/sessions/user/view`
			});
		} else if (buttonFunction === OVERLAY_FUNCTIONS.CLOSE) {
			setOverlayItem(null);
			setOverlayActive(false);
			setSelectedConsultingType(null);
		} else {
			logout();
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
					<div
						ref={postcodeFlyoutRef}
						className="askerRegistration__postcodeFlyout"
					>
						{suggestedAgencies.map(
							(agency: AgencyDataInterface, index) => (
								<div
									className="askerRegistration__postcodeFlyout__content"
									key={index}
									onClick={() =>
										handleAgencySelection(agency)
									}
								>
									{agency.teamAgency ? (
										<div className="askerRegistration__postcodeFlyout__teamagency">
											<span className="suggestionWrapper__item__content__teamAgency__icon">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="72"
													height="72"
													viewBox="0 0 72 72"
												>
													<path d="M36,6 C52.5333333,6 66,19.4666667 66,36 C66,52.5333333 52.5333333,66 36,66 C19.4666667,66 6,52.5333333 6,36 C6,19.4666667 19.4666667,6 36,6 Z M29.3515625,50.4609375 L29.3515625,54.5625 L42.78125,54.5625 L42.78125,50.4609375 L39.5,49.7578125 L39.5,29.203125 L29,29.203125 L29,33.328125 L32.65625,34.03125 L32.65625,49.7578125 L29.3515625,50.4609375 Z M39.5,23.1328125 L39.5,18 L32.65625,18 L32.65625,23.1328125 L39.5,23.1328125 Z" />
												</svg>
											</span>

											{translate(
												'registration.agency.isteam'
											)}
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
			{overlayActive ? (
				<OverlayWrapper>
					<Overlay
						item={overlayItem}
						handleOverlay={handleOverlayAction}
					/>
				</OverlayWrapper>
			) : null}
		</div>
	);
};
