import * as React from 'react';
import { useEffect, useState } from 'react';
import {
	AgencyDataInterface,
	ConsultantDataInterface,
	ConsultingTypeInterface
} from '../../globalState';
import { translate } from '../../utils/translate';
import './consultingTypeAgencySelection.styles';
import '../profile/profile.styles';
import { RadioButton } from '../radioButton/RadioButton';
import { AgencyInfo } from '../agencySelection/AgencyInfo';
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

export interface ConsultingTypeAgencySelectionProps {
	consultant: ConsultantDataInterface;
	onChange: Function;
	onValidityChange?: Function;
	agency?: any;
	preselectedConsultingType?: ConsultingTypeInterface;
	preselectedAgency?: any;
}

export const useConsultingTypeAgencySelection = (
	consultant: ConsultantDataInterface,
	consultingType: ConsultingTypeInterface,
	agency: AgencyDataInterface
) => {
	const [consultingTypes, setConsultingTypes] = useState<
		ConsultingTypeInterface[]
	>([]);
	const [agencies, setAgencies] = useState<AgencyDataInterface[]>([]);

	useEffect(() => {
		if (!consultant) {
			return;
		}

		const consultingTypes = consultant.agencies
			// Remove consultingType duplicates
			.reduce((acc: ConsultingTypeInterface[], { consultingTypeRel }) => {
				if (
					!acc.find(
						(consultingType) =>
							consultingType.id === consultingTypeRel.id
					)
				) {
					acc.push(consultingTypeRel);
				}
				return acc;
			}, [])
			// If consultingType was preselected by url slug
			.filter((c) => !consultingType || c.id === consultingType.id);

		if (agency) {
			const consultingTypeIds = consultingTypes.map((c) => c.id);
			const preselectedAgency = consultant.agencies.find(
				(a) =>
					a.id === agency.id &&
					consultingTypeIds.indexOf(a.consultingType) >= 0
			);
			if (preselectedAgency) {
				setAgencies([preselectedAgency]);
				setConsultingTypes([preselectedAgency.consultingTypeRel]);
				return;
			}
		}

		if (consultingTypes.length === 1) {
			const possibleAgencies = consultant.agencies.filter(
				(agency) => agency.consultingType === consultingTypes[0].id
			);
			setAgencies(possibleAgencies);
		} else {
			setAgencies(consultant.agencies);
		}

		setConsultingTypes(consultingTypes);
	}, [consultant, consultingType, agency]);

	return { agencies, consultingTypes };
};

export const ConsultingTypeAgencySelection = ({
	consultant,
	onChange,
	onValidityChange,
	agency,
	preselectedConsultingType,
	preselectedAgency
}: ConsultingTypeAgencySelectionProps) => {
	const [selectedConsultingTypeOption, setSelectedConsultingTypeOption] =
		useState<SelectOption>(null);
	const [consultingTypeOptions, setConsultingTypeOptions] = useState<
		SelectOption[]
	>([]);
	const [agencyOptions, setAgencyOptions] = useState<AgencyDataInterface[]>(
		[]
	);

	const {
		agencies: possibleAgencies,
		consultingTypes: possibleConsultingTypes
	} = useConsultingTypeAgencySelection(
		consultant,
		preselectedConsultingType,
		preselectedAgency
	);

	useEffect(() => {
		const consultingTypeOptions = possibleConsultingTypes.map(
			(consultingType) => ({
				value: consultingType.id.toString(),
				label: consultingType.titles.long
			})
		);
		setConsultingTypeOptions(consultingTypeOptions);
		setSelectedConsultingTypeOption(consultingTypeOptions[0]);
	}, [possibleConsultingTypes]);

	useEffect(() => {
		if (!selectedConsultingTypeOption) {
			setAgencyOptions([]);
			onChange(null);
			return;
		}

		const agencyOptions = possibleAgencies.filter(
			(agency) =>
				agency.consultingType.toString() ===
				selectedConsultingTypeOption.value
		);

		setAgencyOptions(agencyOptions);
		if (agencyOptions.length >= 1) {
			onChange(agencyOptions[0]);
		}
	}, [onChange, possibleAgencies, selectedConsultingTypeOption]);

	useEffect(() => {
		if (!onValidityChange) {
			return;
		}
		onValidityChange(agency ? VALIDITY_VALID : VALIDITY_INVALID);
	}, [agency]); // eslint-disable-line react-hooks/exhaustive-deps

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

	if (possibleAgencies.length <= 1 && possibleConsultingTypes.length <= 1) {
		return null;
	}

	return (
		<div className="consultingTypeSelection">
			{consultingTypeOptions.length > 1 && (
				<div className="consultingTypeSelection__possibleConsultingTypes">
					<Text
						text={translate(
							'registration.consultingTypeAgencySelection.consultingType.infoText'
						)}
						type="infoLargeAlternative"
					/>
					<SelectDropdown {...consultingTypeSelect} />
				</div>
			)}

			{selectedConsultingTypeOption && agencyOptions.length > 1 && (
				<div className="agencySelection">
					{consultingTypeOptions.length <= 1 && (
						<Text
							text={translate(
								'registration.consultingTypeAgencySelection.agency.infoText'
							)}
							type="infoLargeAlternative"
						/>
					)}
					<AgencySelection
						agencies={agencyOptions}
						onChange={onChange}
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
};

const AgencySelection = ({
	agencies,
	onChange,
	selectedAgency
}: AgencySelectionProps) => {
	return (
		<div>
			{agencies.map((agency: AgencyDataInterface) => (
				<div
					key={agency.id}
					className="agencySelection__proposedAgency"
				>
					<RadioButton
						name="agencySelection"
						handleRadioButton={() => onChange(agency)}
						type="default"
						value={agency.id.toString()}
						checked={
							selectedAgency && agency.id === selectedAgency.id
						}
						inputId={agency.id.toString()}
						label={agency.name}
					/>
					<AgencyInfo agency={agency} />
					<AgencyLanguages agencyId={agency.id} />
				</div>
			))}
		</div>
	);
};
