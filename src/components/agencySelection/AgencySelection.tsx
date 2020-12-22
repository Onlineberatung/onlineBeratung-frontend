import * as React from 'react';
import { useEffect, useState } from 'react';
import { AgencyDataInterface, UserDataInterface } from '../../globalState';
import { translate } from '../../resources/scripts/i18n/translate';
import { ajaxCallAgencySelection } from '../apiWrapper/ajaxCallPostcode';
import { FETCH_ERRORS } from '../apiWrapper/fetchData';
import { InputField, InputFieldItem } from '../inputField/InputField';
import { ReactComponent as InfoIcon } from '../../resources/img/icons/i.svg';
import {
	autoselectAgencyForConsultingType,
	autoselectPostcodeForConsultingType,
	POSTCODE_FALLBACK_LINKS,
	VALID_POSTCODE_LENGTH
} from './agencySelectionHelpers';
import './agencySelection.styles';
import '../profile/profile.styles';
import { DEFAULT_POSTCODE } from '../registration/prefillPostcode';
import { InfoText, LABEL_TYPES } from '../infoText/InfoText';
import { SelectedAgencyInfo } from '../selectedAgencyInfo/SelectedAgencyInfo';

export interface AgencySelectionProps {
	selectedConsultingType: number | undefined;
	icon?: JSX.Element;
	setAgency: Function;
	userData?: UserDataInterface;
	preselectedAgency?: AgencyDataInterface;
}

export const AgencySelection = (props: AgencySelectionProps) => {
	const postcodeFlyoutRef = React.useRef<HTMLDivElement>(null);
	const [postcodeFallbackLink, setPostcodeFallbackLink] = useState('');
	const [proposedAgencies, setProposedAgencies] = useState<
		[AgencyDataInterface] | null
	>(null);

	const [selectedPostcode, setSelectedPostcode] = useState('');
	const [selectedAgencyId, setSelectedAgencyId] = useState<
		number | undefined
	>(undefined);
	const [autoSelectAgency, setAutoSelectAgency] = useState(false);
	const [autoSelectPostcode, setAutoSelectPostcode] = useState(false);
	const [selectedAgencyData, setSelectedAgencyData] = useState<
		AgencyDataInterface
	>(null);

	const validPostcode = () =>
		selectedPostcode?.length === VALID_POSTCODE_LENGTH;

	const isSelectedAgencyValidated = () =>
		validPostcode() && typeof selectedAgencyId === 'number';

	useEffect(() => {
		setSelectedPostcode('');
		setPostcodeFallbackLink('');
		setSelectedAgencyId(undefined);
		setProposedAgencies(null);
		setSelectedAgencyData(null);
		setAutoSelectAgency(
			autoselectAgencyForConsultingType(props.selectedConsultingType)
		);
		setAutoSelectPostcode(
			autoselectPostcodeForConsultingType(props.selectedConsultingType)
		);
	}, [props.selectedConsultingType]);

	useEffect(() => {
		if (autoSelectAgency) {
			ajaxCallAgencySelection({
				postcode: DEFAULT_POSTCODE,
				consultingType: props.selectedConsultingType
			})
				.then((response) => {
					const defaultAgency = response[0];
					if (autoSelectPostcode) {
						setSelectedPostcode(defaultAgency.postcode);
					}
					setSelectedAgencyId(defaultAgency.id);
					setSelectedAgencyData(defaultAgency);
				})
				.catch((error) => {
					return null;
				});
		}
	}, [autoSelectAgency]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (isSelectedAgencyValidated()) {
			const agency = {
				id: selectedAgencyId,
				postcode: selectedPostcode
			};
			props.setAgency(agency);
		} else if (props.preselectedAgency && !selectedAgencyId) {
			setSelectedAgencyId(props.preselectedAgency.id);
			setSelectedAgencyData(props.preselectedAgency);
			if (
				autoselectPostcodeForConsultingType(
					props.selectedConsultingType
				)
			) {
				setSelectedPostcode(props.preselectedAgency.postcode);
			}
		} else {
			props.setAgency(null);
		}
	}, [selectedAgencyId, selectedPostcode, props.preselectedAgency]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (!autoSelectAgency && !props.preselectedAgency) {
			setSelectedAgencyId(undefined);
			setSelectedAgencyData(null);
			setPostcodeFallbackLink('');
			if (validPostcode()) {
				ajaxCallAgencySelection({
					postcode: selectedPostcode,
					consultingType: props.selectedConsultingType
				})
					.then((response) => {
						setProposedAgencies(response);
					})
					.catch((error) => {
						if (
							error.message === FETCH_ERRORS.EMPTY &&
							props.selectedConsultingType
						) {
							setPostcodeFallbackLink(
								POSTCODE_FALLBACK_LINKS[
									props.selectedConsultingType
								]
							);
						}
						return null;
					});
			} else if (proposedAgencies) {
				setProposedAgencies(null);
			}
		}
	}, [selectedPostcode]); // eslint-disable-line react-hooks/exhaustive-deps

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
		maxLength: VALID_POSTCODE_LENGTH,
		pattern: '^[0-9]+$',
		disabled:
			autoSelectPostcode ||
			(!props.selectedConsultingType &&
				props.selectedConsultingType !== 0),
		postcodeFallbackLink: postcodeFallbackLink,
		icon: props.icon
	};

	const handlePostcodeInput = (e) => {
		setSelectedPostcode(e.target.value);
	};

	const handleAgencySelection = (agency: AgencyDataInterface) => {
		setProposedAgencies(null);
		setSelectedAgencyId(agency.id);
		setSelectedAgencyData(agency);
	};

	return (
		<div className="askerRegistration__postcode">
			{autoSelectPostcode ? (
				<InfoText
					className="askerRegistration__consultingModeInfo"
					labelType={LABEL_TYPES.CAUTION}
					text={translate(
						'profile.data.register.consultingModeInfo.groupChats'
					)}
				/>
			) : (
				<>
					<InputField
						item={postcodeInputItem}
						inputHandle={(e) => handlePostcodeInput(e)}
					></InputField>
					{!props.preselectedAgency &&
						!autoSelectAgency &&
						selectedAgencyData && (
							<SelectedAgencyInfo
								prefix={translate(
									'registration.agency.selected.prefix'
								)}
								agencyData={selectedAgencyData}
							/>
						)}
					{proposedAgencies && (
						<div
							ref={postcodeFlyoutRef}
							className="askerRegistration__postcodeFlyout"
						>
							{proposedAgencies.map(
								(agency: AgencyDataInterface, index) => (
									<div
										className="askerRegistration__postcodeFlyout__content"
										key={index}
										onClick={() =>
											handleAgencySelection(agency)
										}
									>
										{agency.teamAgency && (
											<div className="askerRegistration__postcodeFlyout__teamagency">
												<span className="suggestionWrapper__item__content__teamAgency__icon">
													<InfoIcon />
												</span>

												{translate(
													'registration.agency.prefilled.isTeam'
												)}
											</div>
										)}
										{agency.postcode && (
											<div className="askerRegistration__postcodeFlyout__postcode">
												{agency.postcode}
											</div>
										)}
										{agency.name && (
											<div className="askerRegistration__postcodeFlyout__name">
												{agency.name}
											</div>
										)}
										{agency.description && (
											<div
												className="askerRegistration__postcodeFlyout__description"
												dangerouslySetInnerHTML={{
													__html: agency.description
												}}
											></div>
										)}
									</div>
								)
							)}
						</div>
					)}
				</>
			)}
		</div>
	);
};
