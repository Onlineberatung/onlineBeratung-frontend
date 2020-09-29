import * as React from 'react';
import { useEffect, useState } from 'react';
import { AgencyDataInterface } from '../../../globalState';
import {
	hasConsultingTypeLongPostcodeValidation,
	POSTCODE_FALLBACK_LINK
} from '../../../resources/ts/helpers/resorts';
import { translate } from '../../../resources/ts/i18n/translate';
import { ajaxCallPostcodeSuggestion } from '../../apiWrapper/ts/ajaxCallPostcode';
import { FETCH_ERRORS } from '../../apiWrapper/ts/fetchData';
import { InputField, InputFieldItem } from '../../inputField/ts/InputField';
import { extendPostcodeToBeValid } from '../../registrationFormular/ts/handleRegistration';
import {
	validPostcodeLengthForConsultingType,
	VALID_POSTCODE_LENGTH
} from './postcodeSuggestionHelper';

export interface PostcodeSuggestionProps {
	selectedConsultingType: number;
	icon?: JSX.Element;
	setAgency: Function;
}

export const PostcodeSuggestion = (props: PostcodeSuggestionProps) => {
	let postcodeFlyoutRef: React.RefObject<HTMLDivElement> = React.useRef();
	const [postcodeFallbackLink, setPostcodeFallbackLink] = useState(null);
	const [suggestedAgencies, setSuggestedAgencies] = useState(null);
	const [postcodeExtended, setPostcodeExtended] = useState(false);

	const [selectedPostcode, setSelectedPostcode] = useState(null);
	const [typedPostcode, setTypedPostcode] = useState(null);
	const [selectedAgencyId, setSelectedAgencyId] = useState(null);

	const isSelectedAgencyValidated = () =>
		selectedPostcode &&
		selectedPostcode.length === VALID_POSTCODE_LENGTH.MAX &&
		selectedAgencyId &&
		typedPostcode;

	useEffect(() => {
		setSelectedPostcode(null);
		setPostcodeFallbackLink(null);
		setSelectedAgencyId(null);
		setSuggestedAgencies(null);
	}, [props.selectedConsultingType]);

	useEffect(() => {
		if (isSelectedAgencyValidated()) {
			const agency = {
				id: selectedAgencyId,
				typedPostcode: typedPostcode
			};
			props.setAgency(agency);
		} else {
			props.setAgency(null);
		}
	}, [selectedAgencyId]);

	useEffect(() => {
		if (!postcodeExtended) {
			setSelectedAgencyId(null);
			setTypedPostcode(null);
			setPostcodeFallbackLink(null);
			if (
				selectedPostcode &&
				validPostcodeLengthForConsultingType(
					selectedPostcode.length,
					props.selectedConsultingType
				)
			) {
				ajaxCallPostcodeSuggestion({
					postcode: selectedPostcode,
					consultingType: props.selectedConsultingType
				})
					.then((response) => {
						if (
							hasConsultingTypeLongPostcodeValidation(
								props.selectedConsultingType
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
								POSTCODE_FALLBACK_LINK[
									props.selectedConsultingType
								]
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

	const postcodeInputItem: InputFieldItem = {
		name: 'postcode',
		class: 'asker__registration__postcodeInput',
		id: 'postcode',
		type: 'text',
		infoText: translate('profile.data.register.postcodeInput.infoText'),
		labelTranslatable: 'profile.data.register.postcodeInput.label',
		content: selectedPostcode,
		maxLength: VALID_POSTCODE_LENGTH.MAX,
		pattern: '^[0-9]+$',
		disabled: !props.selectedConsultingType,
		postcodeFallbackLink: postcodeFallbackLink,
		icon: props.icon
	};

	const handlePostcodeInput = (e) => {
		setSelectedPostcode(e.target.value);
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

	return (
		<div className="askerRegistration__postcode">
			<InputField
				item={postcodeInputItem}
				inputHandle={(e) => handlePostcodeInput(e)}
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
								onClick={() => handleAgencySelection(agency)}
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
	);
};
