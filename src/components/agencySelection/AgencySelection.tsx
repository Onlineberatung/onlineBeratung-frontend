import * as React from 'react';
import { useEffect, useState } from 'react';
import { AgencyDataInterface, UserDataInterface } from '../../globalState';
import { translate } from '../../resources/scripts/i18n/translate';
import { apiAgencySelection, FETCH_ERRORS } from '../../api';
import { InputField, InputFieldItem } from '../inputField/InputField';
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
import { AgencyInfo } from './AgencyInfo';
import { PreselectedAgency } from './PreselectedAgency';

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
	const [preselectedAgency, setPreselectedAgency] = useState(
		props.preselectedAgency
	);

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
		setPreselectedAgency(props.preselectedAgency);
	}, [props.selectedConsultingType, props.preselectedAgency]);

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
					setPreselectedAgency(defaultAgency);
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
		} else if (preselectedAgency && !selectedAgencyId) {
			setSelectedAgencyId(preselectedAgency.id);
			if (
				autoselectPostcodeForConsultingType(
					props.selectedConsultingType
				)
			) {
				setSelectedPostcode(preselectedAgency.postcode);
			}
		} else {
			props.onAgencyChange(null);
			if (props.onValidityChange) {
				props.onValidityChange('initial');
			}
		}
	}, [selectedAgencyId, selectedPostcode, preselectedAgency]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (!autoSelectAgency && !preselectedAgency) {
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
			(autoSelectAgency || preselectedAgency) &&
			!validPostcode()
		) {
			props.onAgencyChange(null);
			if (props.onValidityChange) {
				props.onValidityChange('initial');
			}
		}
	}, [selectedPostcode]); // eslint-disable-line react-hooks/exhaustive-deps

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

	const showPreselectedAgency =
		preselectedAgency &&
		!autoselectPostcodeForConsultingType(props.selectedConsultingType);
	const introItemsTranslations = showPreselectedAgency
		? [
				'registration.agencyPreselected.intro.point1',
				'registration.agencyPreselected.intro.point2'
		  ]
		: [
				'registration.agencySelection.intro.point1',
				'registration.agencySelection.intro.point2',
				'registration.agencySelection.intro.point3'
		  ];

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
							{showPreselectedAgency
								? translate(
										'registration.agencyPreselected.headline'
								  )
								: translate(
										'registration.agencySelection.headline'
								  )}
						</h5>
					)}
					<div className="agencySelection__intro">
						<Text
							text={
								showPreselectedAgency
									? translate(
											'registration.agencyPreselected.intro.overline'
									  )
									: translate(
											'registration.agencySelection.intro.overline'
									  )
							}
							type="infoLargeAlternative"
						/>
						<div className="agencySelection__intro__content">
							<Text
								text={
									showPreselectedAgency
										? translate(
												'registration.agencyPreselected.intro.subline'
										  )
										: translate(
												'registration.agencySelection.intro.subline'
										  )
								}
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
					{validPostcode() && !preselectedAgency && (
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
												'registration.agencySelection.postcode.unavailable'
											)}
											type="infoSmall"
										/>{' '}
										<a
											href={postcodeFallbackLink}
											target="_blank"
											rel="noreferrer"
										>
											{translate(
												'registration.agencySelection.postcode.search'
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
											<AgencyInfo
												agency={agency}
												isProfileView={
													props.isProfileView
												}
											/>
										</div>
									)
								)
							)}
						</div>
					)}
				</>
			)}
			{showPreselectedAgency && (
				<PreselectedAgency
					prefix={translate('registration.agency.preselected.prefix')}
					agencyData={preselectedAgency}
					isProfileView={props.isProfileView}
				/>
			)}
		</div>
	);
};
