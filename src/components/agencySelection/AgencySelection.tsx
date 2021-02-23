import * as React from 'react';
import { useEffect, useState } from 'react';
import { AgencyDataInterface, UserDataInterface } from '../../globalState';
import { translate } from '../../resources/scripts/i18n/translate';
import { apiAgencySelection, FETCH_ERRORS } from '../../api';
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
import { RadioButton } from '../radioButton/RadioButton';
import { Loading } from '../app/Loading';
import { Text, LABEL_TYPES } from '../text/Text';

const introItemsTranslations = [
	'registration.agencySelection.intro.point1',
	'registration.agencySelection.intro.point2',
	'registration.agencySelection.intro.point3'
];

export interface AgencySelectionProps {
	selectedConsultingType: number | undefined;
	icon?: JSX.Element;
	onAgencyChange: Function;
	onValidityChange?: Function;
	userData?: UserDataInterface;
	preselectedAgency?: AgencyDataInterface;
	isProfileView?: boolean;
}

export const AgencySelection = (props: AgencySelectionProps) => {
	const agencyInfoRef = React.useRef<HTMLDivElement>(null);
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
	const [displayAgencyInfo, setDisplayAgencyInfo] = useState<
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
		setAutoSelectAgency(
			autoselectAgencyForConsultingType(props.selectedConsultingType)
		);
		setAutoSelectPostcode(
			autoselectPostcodeForConsultingType(props.selectedConsultingType)
		);
	}, [props.selectedConsultingType]);

	useEffect(() => {
		if (autoSelectAgency) {
			apiAgencySelection({
				postcode: DEFAULT_POSTCODE,
				consultingType: props.selectedConsultingType
			})
				.then((response) => {
					const defaultAgency = response[0];
					if (autoSelectPostcode) {
						setSelectedPostcode(defaultAgency.postcode);
					}
					setSelectedAgencyId(defaultAgency.id);
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
			props.onAgencyChange(agency);
			if (props.onValidityChange) {
				props.onValidityChange('valid');
			}
		} else if (props.preselectedAgency && !selectedAgencyId) {
			setSelectedAgencyId(props.preselectedAgency.id);
			if (
				autoselectPostcodeForConsultingType(
					props.selectedConsultingType
				)
			) {
				setSelectedPostcode(props.preselectedAgency.postcode);
			}
		} else {
			props.onAgencyChange(null);
			if (props.onValidityChange) {
				props.onValidityChange('initial');
			}
		}
	}, [selectedAgencyId, selectedPostcode, props.preselectedAgency]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (!autoSelectAgency && !props.preselectedAgency) {
			setSelectedAgencyId(undefined);
			setPostcodeFallbackLink('');
			if (validPostcode()) {
				apiAgencySelection({
					postcode: selectedPostcode,
					consultingType: props.selectedConsultingType
				})
					.then((response) => {
						setProposedAgencies(response);
						setSelectedAgencyId(response[0].id);
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
		} else if (
			(autoSelectAgency || props.preselectedAgency) &&
			!validPostcode()
		) {
			props.onAgencyChange(null);
			if (props.onValidityChange) {
				props.onValidityChange('initial');
			}
		}
	}, [selectedPostcode]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				!agencyInfoRef.current?.contains(event.target) &&
				!event.target.getAttribute('data-agency-info-id') &&
				!event.target.closest('[data-agency-info-id]')
			) {
				setDisplayAgencyInfo(null);
			}
		};
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, [displayAgencyInfo]);

	const postcodeInputItem: InputFieldItem = {
		name: 'postcode',
		class: 'asker__registration__postcodeInput',
		id: 'postcode',
		type: 'number',
		label: translate('registration.agencySelection.postcode.label'),
		content: selectedPostcode,
		maxLength: VALID_POSTCODE_LENGTH,
		pattern: '^[0-9]+$',
		disabled:
			autoSelectPostcode ||
			(!props.selectedConsultingType &&
				props.selectedConsultingType !== 0),
		icon: props.icon
	};

	const handlePostcodeInput = (e) => {
		setSelectedPostcode(e.target.value);
	};

	return (
		<div className="agencySelection">
			{autoSelectPostcode ? (
				<Text
					className="agencySelection__consultingModeInfo"
					labelType={LABEL_TYPES.NOTICE}
					text={translate(
						'profile.data.register.consultingModeInfo.groupChats'
					)}
					type="infoSmall"
				/>
			) : (
				<>
					{props.isProfileView && (
						<h5>
							{translate('registration.agencySelection.headline')}
						</h5>
					)}
					<div className="agencySelection__intro">
						<Text
							text={translate(
								'registration.agencySelection.intro.overline'
							)}
							type="infoLargeAlternative"
						/>
						<div className="agencySelection__intro__content">
							<Text
								text={translate(
									'registration.agencySelection.intro.subline'
								)}
								type="infoLargeAlternative"
							/>
							<ul>
								{introItemsTranslations.map(
									(introItemTranslation, i) => (
										<li key={i}>
											<Text
												text={translate(
													introItemTranslation
												)}
												type="infoLargeAlternative"
											/>
										</li>
									)
								)}
							</ul>
						</div>
					</div>
					<InputField
						item={postcodeInputItem}
						inputHandle={(e) => handlePostcodeInput(e)}
					></InputField>
					{validPostcode() && !props.preselectedAgency && (
						<div className="agencySelection__proposedAgencies">
							<h3>
								{translate(
									'registration.agencySelection.title.start'
								)}{' '}
								{selectedPostcode}
								{translate(
									'registration.agencySelection.title.end'
								)}
							</h3>
							{!proposedAgencies ? (
								postcodeFallbackLink ? (
									<div className="agencySelection__proposedAgencies--warning">
										<Text
											text={translate(
												'warningLabels.postcode.unavailable'
											)}
											type="infoSmall"
										/>{' '}
										<a
											href={postcodeFallbackLink}
											target="_blank"
											rel="noreferrer"
										>
											{translate(
												'warningLabels.postcode.search'
											)}
										</a>
									</div>
								) : (
									<Loading />
								)
							) : (
								proposedAgencies?.map(
									(agency: AgencyDataInterface, index) => (
										<div
											key={index}
											className="agencySelection__proposedAgency"
										>
											<RadioButton
												name="agencySelection"
												handleRadioButton={() =>
													setSelectedAgencyId(
														agency.id
													)
												}
												type="default"
												value={agency.id.toString()}
												checked={index === 0}
												inputId={agency.id.toString()}
												label={agency.name}
											/>
											<InfoIcon
												data-agency-info-id={agency.id}
												onClick={() =>
													displayAgencyInfo?.id ===
													agency.id
														? setDisplayAgencyInfo(
																null
														  )
														: setDisplayAgencyInfo(
																agency
														  )
												}
											/>
											{displayAgencyInfo &&
												displayAgencyInfo?.id ===
													agency.id && (
													<div
														className={`agencySelection__agencyInfo ${
															props.isProfileView
																? 'agencySelection__agencyInfo--above'
																: ''
														}`}
														ref={agencyInfoRef}
													>
														{displayAgencyInfo.teamAgency && (
															<div className="agencySelection__agencyInfo__teamAgency">
																<InfoIcon />
																{translate(
																	'registration.agency.prefilled.isTeam'
																)}
															</div>
														)}
														{displayAgencyInfo.name && (
															<div className="agencySelection__agencyInfo__name">
																{
																	displayAgencyInfo.name
																}
															</div>
														)}
														{displayAgencyInfo.description && (
															<div
																className="agencySelection__agencyInfo__description"
																dangerouslySetInnerHTML={{
																	__html:
																		displayAgencyInfo.description
																}}
															></div>
														)}
													</div>
												)}
										</div>
									)
								)
							)}
						</div>
					)}
				</>
			)}
		</div>
	);
};
