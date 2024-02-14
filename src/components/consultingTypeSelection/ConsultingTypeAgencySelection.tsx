import * as React from 'react';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AgencyDataInterface } from '../../globalState/interfaces';
import './consultingTypeAgencySelection.styles';
import '../profile/profile.styles';
import { RadioButton } from '../radioButton/RadioButton';
import { InfoTooltip } from '../infoTooltip/InfoTooltip';
import {
	VALIDITY_INVALID,
	VALIDITY_VALID
} from '../registration/registrationHelpers';
import {
	SelectDropdown,
	SelectDropdownItem,
	SelectOption
} from '../select/SelectDropdown';
import { Text } from '../text/Text';
import { AgencyLanguages } from '../agencySelection/AgencyLanguages';
import { useTranslation } from 'react-i18next';
import { useConsultantRegistrationData } from '../../containers/registration/hooks/useConsultantRegistrationData';
import { apiGetTopicsData } from '../../api/apiGetTopicsData';
import { useTenant } from '../../globalState';
import { UrlParamsContext } from '../../globalState/provider/UrlParamsProvider';

export interface ConsultingTypeAgencySelectionProps {
	onChange: Function;
	onValidityChange?: Function;
	agency?: any;
	onKeyDown?: Function;
}

export const ConsultingTypeAgencySelection = ({
	onChange,
	onValidityChange,
	agency,
	onKeyDown
}: ConsultingTypeAgencySelectionProps) => {
	const { t: translate } = useTranslation(['common', 'consultingTypes']);
	const tenantData = useTenant();
	const { agency: preselectedAgency, topic: preselectedTopic } =
		useContext(UrlParamsContext);

	const [selectedConsultingTypeOption, setSelectedConsultingTypeOption] =
		useState<SelectOption>(null);
	const [selectedTopicOption, setSelectedTopicOption] =
		useState<SelectOption>(null);
	const [consultingTypeOptions, setConsultingTypeOptions] = useState<
		SelectOption[]
	>([]);
	const [agencyOptions, setAgencyOptions] = useState<AgencyDataInterface[]>(
		[]
	);
	const [topicOptions, setTopicOptions] = useState<SelectOption[]>([]);

	const topicsAreRequired = useMemo(
		() =>
			tenantData?.settings?.topicsInRegistrationEnabled &&
			tenantData?.settings?.featureTopicsEnabled,
		[
			tenantData?.settings?.topicsInRegistrationEnabled,
			tenantData?.settings?.featureTopicsEnabled
		]
	);

	const {
		agencies: possibleAgencies,
		consultingTypes: possibleConsultingTypes,
		topicIds: possibleTopicIds
	} = useConsultantRegistrationData();

	useEffect(() => {
		apiGetTopicsData()
			// Filter topic by preselected topic
			.then((topics) =>
				topics.filter(
					(t) => !preselectedTopic || preselectedTopic.id === t.id
				)
			)
			// Filter topics by consultant topics
			.then((topics) =>
				topics.filter((t) => possibleTopicIds.includes(t.id))
			)
			// Filter topics by preselected agency
			.then((topics) =>
				topics.filter(
					(t) =>
						!preselectedAgency ||
						preselectedAgency.topicIds?.includes(t.id)
				)
			)
			.then((topics) =>
				topics.map((t) => ({
					value: t.id.toString(),
					label: t.name
				}))
			)
			.then(setTopicOptions);
	}, [possibleTopicIds, preselectedAgency, preselectedTopic]);

	useEffect(() => {
		const consultingTypeOptions = possibleConsultingTypes.map(
			(consultingType) => ({
				value: consultingType.id.toString(),
				label: translate(
					[
						`consultingType.${consultingType.id}.titles.long`,
						`consultingType.fallback.titles.long`,
						consultingType.titles.long
					],
					{ ns: 'consultingTypes' }
				)
			})
		);
		setConsultingTypeOptions(consultingTypeOptions);
		setSelectedConsultingTypeOption(consultingTypeOptions[0]);
	}, [possibleConsultingTypes, translate]);

	useEffect(() => {
		if (
			!selectedConsultingTypeOption ||
			(topicsAreRequired && !selectedTopicOption)
		) {
			setAgencyOptions([]);
			onChange(null);
			return;
		}

		const agencyOptions = possibleAgencies.filter(
			(agency) =>
				agency.consultingType.toString() ===
					selectedConsultingTypeOption.value &&
				agency.topicIds.includes(parseInt(selectedTopicOption.value))
		);

		setAgencyOptions(agencyOptions);
		if (agencyOptions.length >= 1) {
			onChange(agencyOptions[0]);
		}
	}, [
		onChange,
		possibleAgencies,
		selectedConsultingTypeOption,
		topicsAreRequired,
		selectedTopicOption
	]);

	useEffect(() => {
		if (!onValidityChange) {
			return;
		}
		onValidityChange(agency ? VALIDITY_VALID : VALIDITY_INVALID);
	}, [agency]); // eslint-disable-line react-hooks/exhaustive-deps

	const handleChange = useCallback(
		(agency) => {
			onChange({
				...agency,
				...(topicsAreRequired
					? { topicIds: [parseInt(selectedTopicOption?.value)] }
					: {})
			});
		},
		[onChange, selectedTopicOption?.value, topicsAreRequired]
	);

	const consultingTypeSelect: SelectDropdownItem = {
		id: 'consultingTypeSelection',
		selectedOptions: consultingTypeOptions,
		handleDropdownSelect: setSelectedConsultingTypeOption,
		selectInputLabel: translate(
			'registration.consultingTypeAgencySelection.consultingType.select.label'
		),
		menuPlacement: 'bottom',
		defaultValue: selectedConsultingTypeOption
	};

	const topicSelect: SelectDropdownItem = {
		id: 'topicSelection',
		selectedOptions: topicOptions,
		handleDropdownSelect: setSelectedTopicOption,
		selectInputLabel: translate(
			'registration.consultingTypeAgencySelection.topic.select.label'
		),
		menuPlacement: 'bottom',
		defaultValue: selectedTopicOption
	};

	if (possibleAgencies.length <= 1 && possibleConsultingTypes.length <= 1) {
		return null;
	}

	return (
		<div className="consultingTypeSelection">
			{topicOptions.length > 1 && (
				<div className="consultingTypeSelection__possibleTopics">
					<Text
						text={translate(
							'registration.consultingTypeAgencySelection.topic.infoText'
						)}
						type="standard"
					/>
					<SelectDropdown {...topicSelect} onKeyDown={onKeyDown} />
				</div>
			)}

			{consultingTypeOptions.length > 1 && (
				<div className="consultingTypeSelection__possibleConsultingTypes">
					<Text
						text={translate(
							'registration.consultingTypeAgencySelection.consultingType.infoText'
						)}
						type="standard"
					/>
					<SelectDropdown
						{...consultingTypeSelect}
						onKeyDown={onKeyDown}
					/>
				</div>
			)}

			{selectedConsultingTypeOption && agencyOptions.length > 1 && (
				<div className="agencySelection">
					{consultingTypeOptions.length <= 1 && (
						<Text
							text={translate(
								'registration.consultingTypeAgencySelection.agency.infoText'
							)}
							type="standard"
						/>
					)}
					<AgencySelection
						agencies={agencyOptions}
						onChange={handleChange}
						selectedAgency={agency}
					/>
				</div>
			)}
		</div>
	);
};

type AgencySelectionProps = {
	agencies: AgencyDataInterface[];
	selectedAgency?: AgencyDataInterface;
	onChange: Function;
	onKeyDown?: Function;
};

const AgencySelection = ({
	agencies,
	onChange,
	selectedAgency,
	onKeyDown
}: AgencySelectionProps) => {
	const { t: translate } = useTranslation(['agencies']);
	return (
		<div>
			{agencies.map((agency: AgencyDataInterface) => (
				<div
					key={agency.id}
					className="agencySelection__proposedAgency"
				>
					<div className="agencySelection__proposedAgency__container">
						<RadioButton
							name="agencySelection"
							handleRadioButton={() => onChange(agency)}
							type="default"
							value={agency.id.toString()}
							checked={
								selectedAgency &&
								agency.id === selectedAgency.id
							}
							inputId={agency.id.toString()}
							onKeyDown={onKeyDown}
						>
							{translate(
								[`agency.${agency.id}.name`, agency.name],
								{ ns: 'agencies' }
							)}
						</RadioButton>
						<InfoTooltip
							translation={{
								ns: 'agencies',
								prefix: 'agency'
							}}
							info={agency}
							showTeamAgencyInfo={agency.teamAgency}
						/>
					</div>
					<AgencyLanguages agencyId={agency.id} />
				</div>
			))}
		</div>
	);
};
