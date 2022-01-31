import * as React from 'react';
import { useEffect, useState } from 'react';
import {
	AgencyDataInterface,
	ConsultingTypeBasicInterface,
	UserDataInterface
} from '../../globalState';
import { translate } from '../../utils/translate';
import { apiAgencySelection, FETCH_ERRORS } from '../../api';
import { InputField, InputFieldItem } from '../inputField/InputField';
import { VALID_POSTCODE_LENGTH } from './agencySelectionHelpers';
import './agencySelection.styles';
import '../profile/profile.styles';
import { DEFAULT_POSTCODE } from '../registration/prefillPostcode';
import { RadioButton } from '../radioButton/RadioButton';
import { Loading } from '../app/Loading';
import { Text, LABEL_TYPES } from '../text/Text';
import { AgencyInfo } from './AgencyInfo';
import { PreselectedAgency } from './PreselectedAgency';
import { Headline } from '../headline/Headline';
import { parsePlaceholderString } from '../../utils/parsePlaceholderString';
import { config } from '../../resources/scripts/config';
import { Notice } from '../notice/Notice';
import { AgencyLanguages } from './AgencyLanguages';

export interface AgencySelectionProps {
	consultingType: ConsultingTypeBasicInterface;
	icon?: JSX.Element;
	onAgencyChange: Function;
	onValidityChange?: Function;
	userData?: UserDataInterface;
	preselectedAgency?: AgencyDataInterface;
	isProfileView?: boolean;
	agencySelectionNote?: string;
	initialPostcode?: string;
	fixedLanguages: string[];
	hideExternalAgencies?: boolean;
}

export const AgencySelection = (props: AgencySelectionProps) => {
	const [postcodeFallbackLink, setPostcodeFallbackLink] = useState('');
	const [proposedAgencies, setProposedAgencies] = useState<
		AgencyDataInterface[] | null
	>(null);
	const [selectedPostcode, setSelectedPostcode] = useState('');
	const [selectedAgencyId, setSelectedAgencyId] = useState<
		number | undefined
	>(undefined);
	const autoSelectAgency = props.consultingType.registration.autoSelectAgency;
	const autoSelectPostcode =
		props.consultingType.registration.autoSelectPostcode;
	const [preselectedAgency, setPreselectedAgency] =
		useState<AgencyDataInterface>(props.preselectedAgency);

	const validPostcode = () =>
		selectedPostcode?.length === VALID_POSTCODE_LENGTH;

	const isSelectedAgencyValidated = () =>
		validPostcode() && typeof selectedAgencyId === 'number';

	useEffect(() => {
		setSelectedPostcode(props.initialPostcode || '');
		setPostcodeFallbackLink('');
		setSelectedAgencyId(undefined);
		setProposedAgencies(null);
		setPreselectedAgency(props.preselectedAgency);
	}, [props.preselectedAgency, props.consultingType, props.initialPostcode]);

	useEffect(() => {
		(async () => {
			try {
				if (autoSelectAgency) {
					const response = await apiAgencySelection({
						postcode: DEFAULT_POSTCODE,
						consultingType: props.consultingType.id
					});

					const defaultAgency = response[0];
					if (autoSelectPostcode) {
						setSelectedPostcode(defaultAgency.postcode);
					}
					setSelectedAgencyId(defaultAgency.id);
					setPreselectedAgency(defaultAgency);
				}
			} catch (err) {
				return null;
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [autoSelectAgency, props.consultingType.id]);

	useEffect(() => {
		if (isSelectedAgencyValidated()) {
			const agency = {
				...proposedAgencies?.find((cur) => cur.id === selectedAgencyId),
				id: selectedAgencyId,
				postcode: selectedPostcode
			};
			props.onAgencyChange(agency);
			if (props.onValidityChange) {
				props.onValidityChange('valid');
			}
		} else if (preselectedAgency && !selectedAgencyId) {
			setSelectedAgencyId(preselectedAgency.id);
			if (props.consultingType.registration.autoSelectPostcode) {
				setSelectedPostcode(preselectedAgency.postcode);
			}
		} else {
			props.onAgencyChange(null);
			if (props.onValidityChange) {
				props.onValidityChange(
					selectedPostcode ? 'invalid' : 'initial'
				);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedAgencyId, selectedPostcode, preselectedAgency]);

	useEffect(() => {
		if (!autoSelectAgency && !preselectedAgency) {
			(async () => {
				try {
					setSelectedAgencyId(undefined);
					setPostcodeFallbackLink('');
					if (validPostcode()) {
						const agencies = (
							await apiAgencySelection({
								postcode: selectedPostcode,
								consultingType: props.consultingType.id
							})
						).filter(
							(agency) =>
								!props.hideExternalAgencies || !agency.external
						);

						setProposedAgencies(agencies);
						setSelectedAgencyId(agencies[0].id);
					} else if (proposedAgencies) {
						setProposedAgencies(null);
					}
				} catch (err: any) {
					if (
						err.message === FETCH_ERRORS.EMPTY &&
						props.consultingType.id !== null
					) {
						setPostcodeFallbackLink(
							parsePlaceholderString(config.postcodeFallbackUrl, {
								url: props.consultingType.urls
									.registrationPostcodeFallbackUrl,
								postcode: selectedPostcode
							})
						);
					}
					return;
				}
			})();
		} else if (
			(autoSelectAgency || preselectedAgency) &&
			!validPostcode()
		) {
			props.onAgencyChange(null);
			if (props.onValidityChange) {
				props.onValidityChange(
					selectedPostcode ? 'invalid' : 'initial'
				);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedPostcode, props.consultingType.id]);

	const postcodeInputItem: InputFieldItem = {
		name: 'postcode',
		class: 'asker__registration__postcodeInput',
		id: 'postcode',
		type: 'number',
		label: translate('registration.agencySelection.postcode.label'),
		content: selectedPostcode,
		maxLength: VALID_POSTCODE_LENGTH,
		pattern: '^[0-9]+$',
		icon: props.icon
	};

	const handlePostcodeInput = (e) => {
		setSelectedPostcode(e.target.value);
	};

	const showPreselectedAgency = preselectedAgency && !autoSelectPostcode;
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
						<Headline
							semanticLevel="5"
							text={
								showPreselectedAgency
									? translate(
											'registration.agencyPreselected.headline'
									  )
									: translate(
											'registration.agencySelection.headline'
									  )
							}
						/>
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
					{props.agencySelectionNote && (
						<div data-cy="registration-agency-selection-note">
							<Text
								className="agencySelection__note"
								text={props.agencySelectionNote}
								type="infoLargeAlternative"
								labelType={LABEL_TYPES.NOTICE}
							/>
						</div>
					)}
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
									<Notice
										className="agencySelection__proposedAgencies--warning"
										title={translate(
											'registration.agencySelection.postcode.unavailable.title'
										)}
									>
										<Text
											text={translate(
												'registration.agencySelection.postcode.unavailable.text'
											)}
											type="infoLargeAlternative"
										/>
										<a
											href={postcodeFallbackLink}
											target="_blank"
											rel="noreferrer"
										>
											{translate(
												'registration.agencySelection.postcode.search'
											)}
										</a>
									</Notice>
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
												type="smaller"
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
											<AgencyLanguages
												agencyId={agency.id}
												fixedLanguages={
													props.fixedLanguages
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
					fixedLanguages={props.fixedLanguages}
				/>
			)}
		</div>
	);
};
