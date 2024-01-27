import * as React from 'react';
import { useEffect, useState } from 'react';
import { AgencyDataInterface } from '../../globalState';
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
import { useTranslation } from 'react-i18next';
import { useAppConfig } from '../../hooks/useAppConfig';
import { useConsultantAgenciesAndConsultingTypes } from '../../containers/registration/hooks/useConsultantAgenciesAndConsultingTypes';

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
	const settings = useAppConfig();
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
	} = useConsultantAgenciesAndConsultingTypes();

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
		if (!selectedConsultingTypeOption) {
			setAgencyOptions([]);
			onChange(null);
			return;
		}

		const agencyOptions = settings.multitenancyWithSingleDomainEnabled
			? possibleAgencies
			: possibleAgencies.filter(
					(agency) =>
						agency.consultingType.toString() ===
						selectedConsultingTypeOption.value
				);

		setAgencyOptions(agencyOptions);
		if (agencyOptions.length >= 1) {
			onChange(agencyOptions[0]);
		}
	}, [
		onChange,
		possibleAgencies,
		selectedConsultingTypeOption,
		settings.multitenancyWithSingleDomainEnabled
	]);

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
							label={translate(
								[`agency.${agency.id}.name`, agency.name],
								{ ns: 'agencies' }
							)}
							onKeyDown={onKeyDown}
						/>
						<AgencyInfo agency={agency} />
					</div>
					<AgencyLanguages agencyId={agency.id} />
				</div>
			))}
		</div>
	);
};
