import * as React from 'react';
import { useEffect, useState } from 'react';
import { useLocaleData, useTenant } from '../../globalState';
import {
	AgencyDataInterface,
	ConsultingTypeBasicInterface
} from '../../globalState/interfaces';
import { apiAgencySelection, FETCH_ERRORS } from '../../api';
import { InputField, InputFieldItem } from '../inputField/InputField';
import { VALID_POSTCODE_LENGTH } from './agencySelectionHelpers';
import './agencySelection.styles';
import '../profile/profile.styles';
import { DEFAULT_POSTCODE } from '../registration/prefillPostcode';
import { RadioButton } from '../radioButton/RadioButton';
import { Loading } from '../app/Loading';
import { Text, LABEL_TYPES } from '../text/Text';
import { InfoTooltip } from '../infoTooltip/InfoTooltip';
import { PreselectedAgency } from '../../containers/registration/components/PreSelectedAgency/PreselectedAgency';
import { Headline } from '../headline/Headline';
import { parsePlaceholderString } from '../../utils/parsePlaceholderString';
import { Notice } from '../notice/Notice';
import { AgencyLanguages } from './AgencyLanguages';
import {
	VALIDITY_INITIAL,
	VALIDITY_INVALID,
	VALIDITY_VALID
} from '../registration/registrationHelpers';
import { useTranslation } from 'react-i18next';
import { useAppConfig } from '../../hooks/useAppConfig';

export interface AgencySelectionProps {
	consultingType: ConsultingTypeBasicInterface;
	icon?: JSX.Element;
	onAgencyChange: Function;
	onValidityChange?: Function;
	preselectedAgency?: AgencyDataInterface;
	isProfileView?: boolean;
	mainTopicId?: number;
	agencySelectionNote?: string;
	initialPostcode?: string;
	hideExternalAgencies?: boolean;
	onKeyDown?: Function;
	age?: number;
	gender?: string;
}

export const AgencySelection = (props: AgencySelectionProps) => {
	const { t: translate } = useTranslation(['common', 'agencies']);
	const { locale } = useLocaleData();
	const tenantData = useTenant();
	const settings = useAppConfig();
	const [isLoading, setIsLoading] = useState(false);
	const [postcodeFallbackLink, setPostcodeFallbackLink] = useState('');
	const [proposedAgencies, setProposedAgencies] = useState<
		AgencyDataInterface[] | null
	>(null);
	const [selectedPostcode, setSelectedPostcode] = useState('');
	const [selectedAgency, setSelectedAgency] =
		useState<AgencyDataInterface | null>(null);
	const autoSelectAgency = props.consultingType.registration.autoSelectAgency;
	const autoSelectPostcode =
		props.consultingType.registration.autoSelectPostcode;
	const [preselectedAgency, setPreselectedAgency] =
		useState<AgencyDataInterface>(props.preselectedAgency);

	const validPostcode = () =>
		selectedPostcode?.length === VALID_POSTCODE_LENGTH;

	const isSelectedAgencyValidated = () =>
		validPostcode() && typeof selectedAgency?.id === 'number';
	const topicsAreRequired =
		tenantData?.settings?.topicsInRegistrationEnabled &&
		tenantData?.settings?.featureTopicsEnabled;

	useEffect(() => {
		setSelectedPostcode(props.initialPostcode || '');
		setPostcodeFallbackLink('');
		setSelectedAgency(null);
		setProposedAgencies(null);
		setPreselectedAgency(props.preselectedAgency);
	}, [props.preselectedAgency, props.consultingType, props.initialPostcode]);

	useEffect(() => {
		(async () => {
			try {
				if (autoSelectAgency) {
					const response = await apiAgencySelection({
						postcode: DEFAULT_POSTCODE,
						consultingType: props.consultingType.id,
						topicId: props?.mainTopicId,
						age: props?.age,
						gender: props?.gender
					});

					const defaultAgency = response[0];
					if (autoSelectPostcode) {
						setSelectedPostcode(defaultAgency.postcode);
					}
					setSelectedAgency(defaultAgency);
					setPreselectedAgency(defaultAgency);
				}
			} catch (err) {
				return null;
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		autoSelectAgency,
		props.consultingType.id,
		props?.mainTopicId,
		props?.age,
		props?.gender,
		locale
	]);

	useEffect(() => {
		if (isSelectedAgencyValidated()) {
			const agency = {
				...selectedAgency,
				postcode: selectedPostcode
			};
			props.onAgencyChange(agency);
			if (props.onValidityChange) {
				props.onValidityChange(VALIDITY_VALID);
			}
		} else if (preselectedAgency && !selectedAgency?.id) {
			setSelectedAgency(preselectedAgency);
			if (props.consultingType.registration.autoSelectPostcode) {
				setSelectedPostcode(preselectedAgency.postcode);
			}
		} else {
			props.onAgencyChange(null);
			if (props.onValidityChange) {
				props.onValidityChange(
					selectedPostcode ? VALIDITY_INVALID : VALIDITY_INITIAL
				);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedAgency, selectedPostcode, preselectedAgency]);

	useEffect(() => {
		if (!autoSelectAgency && !preselectedAgency) {
			(async () => {
				try {
					setIsLoading(true);
					setSelectedAgency(null);
					setPostcodeFallbackLink('');
					// When we have the topics in in registration enabled to prevent for us doing the request
					// we need to ensure that we've the mainTopicId is set
					const isValidWhenTopicInRegistrationIsActive =
						(topicsAreRequired && props.mainTopicId) ||
						!tenantData?.settings?.topicsInRegistrationEnabled;

					if (
						validPostcode() &&
						isValidWhenTopicInRegistrationIsActive
					) {
						const agencies = (
							await apiAgencySelection({
								postcode: selectedPostcode,
								consultingType: props.consultingType.id,
								topicId: props?.mainTopicId,
								age: props?.age,
								gender: props?.gender
							}).finally(() => setIsLoading(false))
						).filter(
							(agency) =>
								!props.hideExternalAgencies || !agency.external
						);

						setProposedAgencies(agencies);
						setSelectedAgency(agencies[0]);
					} else if (proposedAgencies) {
						setProposedAgencies(null);
					}
				} catch (err: any) {
					if (err.message === FETCH_ERRORS.EMPTY) {
						setProposedAgencies(null);
						if (props.consultingType.id !== null) {
							setPostcodeFallbackLink(
								parsePlaceholderString(
									settings.postcodeFallbackUrl,
									{
										url: props.consultingType.urls
											.registrationPostcodeFallbackUrl,
										postcode: selectedPostcode
									}
								)
							);
						}
					}
				}
			})();
		} else if (
			(autoSelectAgency || preselectedAgency) &&
			!validPostcode()
		) {
			props.onAgencyChange(null);
			if (props.onValidityChange) {
				props.onValidityChange(
					selectedPostcode ? VALIDITY_INVALID : VALIDITY_INITIAL
				);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		selectedPostcode,
		props.consultingType.id,
		props?.mainTopicId,
		props?.age,
		props?.gender
	]);

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
							type="standard"
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
								type="standard"
							/>
							<ul>
								{introItemsTranslations.map(
									(introItemTranslation, i) => (
										<li key={i}>
											<Text
												text={translate(
													introItemTranslation
												)}
												type="standard"
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
						onKeyDown={(e) =>
							props.onKeyDown ? props.onKeyDown(e, false) : null
						}
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
								) : isLoading ? (
									<Loading />
								) : (
									<Text
										text={translate(
											'registration.agencySelection.noAgencies'
										)}
										type="infoLargeAlternative"
									/>
								)
							) : (
								proposedAgencies?.map(
									(agency: AgencyDataInterface, index) => (
										<div
											key={index}
											className="agencySelection__proposedAgency"
										>
											<div className="agencySelection__proposedAgency__container">
												<RadioButton
													name="agencySelection"
													handleRadioButton={() =>
														setSelectedAgency(
															agency
														)
													}
													type="smaller"
													value={agency.id.toString()}
													checked={index === 0}
													inputId={agency.id.toString()}
												>
													{translate(
														[
															`agency.${agency.id}.name`,
															agency.name
														],
														{ ns: 'agencies' }
													)}
												</RadioButton>
												<InfoTooltip
													translation={{
														ns: 'agencies',
														prefix: 'agency'
													}}
													info={agency}
													showTeamAgencyInfo={
														agency.teamAgency
													}
													isProfileView={
														props.isProfileView
													}
												/>
											</div>
											<AgencyLanguages
												agencyId={agency.id}
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
