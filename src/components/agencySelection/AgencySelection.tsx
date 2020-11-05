import * as React from 'react';
import { useEffect, useState } from 'react';
import { AgencyDataInterface } from '../../globalState';
import {
	hasConsultingTypeLongPostcodeValidation,
	POSTCODE_FALLBACK_LINK
} from '../../resources/scripts/helpers/resorts';
import { translate } from '../../resources/scripts/i18n/translate';
import { ajaxCallAgencySelection } from '../apiWrapper/ajaxCallPostcode';
import { FETCH_ERRORS } from '../apiWrapper/fetchData';
import { InputField, InputFieldItem } from '../inputField/InputField';
import { extendPostcodeToBeValid } from '../registration/registrationHelper';
import { SVG } from '../svgSet/SVG';
import { ICON_KEYS } from '../svgSet/SVGHelpers';
import {
	validPostcodeLengthForConsultingType,
	VALID_POSTCODE_LENGTH
} from './agencySelectionHelper';
import './agencySelection.styles';

export interface AgencySelectionProps {
	selectedConsultingType: number | undefined;
	icon?: JSX.Element;
	setAgency: Function;
}

export const AgencySelection = (props: AgencySelectionProps) => {
	const postcodeFlyoutRef = React.useRef<HTMLDivElement>(null);
	const [postcodeFallbackLink, setPostcodeFallbackLink] = useState('');
	const [proposedAgencies, setProposedAgencies] = useState<[AgencyDataInterface] | null>(null);
	const [postcodeExtended, setPostcodeExtended] = useState(false);

	const [selectedPostcode, setSelectedPostcode] = useState('');
	const [typedPostcode, setTypedPostcode] = useState('');
	const [selectedAgencyId, setSelectedAgencyId] = useState<number | undefined>(undefined);

	const isSelectedAgencyValidated = () =>
		selectedPostcode &&
		selectedPostcode.length === VALID_POSTCODE_LENGTH.MAX &&
		selectedAgencyId &&
		typedPostcode;

	useEffect(() => {
		setSelectedPostcode('');
		setPostcodeFallbackLink('');
		setSelectedAgencyId(undefined);
		setProposedAgencies(null);
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
			setSelectedAgencyId(undefined);
			setTypedPostcode('');
			setPostcodeFallbackLink('');
			if (
				selectedPostcode &&
				validPostcodeLengthForConsultingType(
					selectedPostcode.length,
					props.selectedConsultingType
				)
			) {
				ajaxCallAgencySelection({
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
							if (response) {
								setSelectedAgencyId(response[0].id);
							}
						} else {
							setProposedAgencies(response);
						}
					})
					.catch((error) => {
						if (error.message === FETCH_ERRORS.EMPTY && props.selectedConsultingType) {
							setPostcodeFallbackLink(
								POSTCODE_FALLBACK_LINK[
									props.selectedConsultingType
								]
							);
						}
						return null;
					});
			} else if (proposedAgencies) {
				setProposedAgencies(null);
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
				setProposedAgencies(null);
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
		type: 'number',
		infoText: translate('profile.data.register.postcodeInput.infoText'),
		label: translate('profile.data.register.postcodeInput.label'),
		content: selectedPostcode,
		maxLength: VALID_POSTCODE_LENGTH.MAX,
		pattern: '^[0-9]+$',
		disabled:
			!props.selectedConsultingType && props.selectedConsultingType !== 0,
		postcodeFallbackLink: postcodeFallbackLink,
		icon: props.icon
	};

	const handlePostcodeInput = (e) => {
		setSelectedPostcode(e.target.value);
	};

	const handleAgencySelection = (agency: AgencyDataInterface) => {
		setProposedAgencies(null);
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

			{proposedAgencies ? (
				<div
					ref={postcodeFlyoutRef}
					className="askerRegistration__postcodeFlyout"
				>
					{proposedAgencies.map(
						(agency: AgencyDataInterface, index) => (
							<div
								className="askerRegistration__postcodeFlyout__content"
								key={index}
								onClick={() => handleAgencySelection(agency)}
							>
								{agency.teamAgency ? (
									<div className="askerRegistration__postcodeFlyout__teamagency">
										<span className="suggestionWrapper__item__content__teamAgency__icon">
											<SVG name={ICON_KEYS.INFO} />
										</span>

										{translate(
											'registration.agency.prefilled.isTeam'
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
