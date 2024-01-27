import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '../../../../components/text/Text';
import {
	SelectDropdown,
	SelectDropdownItem
} from '../../../../components/select/SelectDropdown';
import { ConsultingTypeInterface } from '../../../../globalState';

interface ConsultingTypeSelectionArgs {
	value: string;
	onChange: (value: string) => void;
	onKeyDown?: (ev: KeyboardEvent) => void;
	consultingTypes: ConsultingTypeInterface[];
}

export const ConsultingTypeSelection = ({
	consultingTypes,
	value,
	onChange,
	onKeyDown
}: ConsultingTypeSelectionArgs) => {
	const { t } = useTranslation(['common', 'consultingTypes']);

	const consultingTypeOptions = useMemo(
		() =>
			consultingTypes.map((consultingType) => ({
				value: consultingType.id.toString(),
				label: t(
					[
						`consultingType.${consultingType.id}.titles.long`,
						`consultingType.fallback.titles.long`,
						consultingType.titles.long
					],
					{ ns: 'consultingTypes' }
				)
			})),
		[consultingTypes, t]
	);

	const consultingTypeSelect: SelectDropdownItem = {
		id: 'consultingTypeSelection',
		selectedOptions: consultingTypeOptions,
		handleDropdownSelect: (selectedOption) =>
			onChange(selectedOption.value),
		selectInputLabel: t(
			'registration.consultingTypeAgencySelection.consultingType.select.label'
		),
		menuPlacement: 'bottom',
		// find by the value or set as default the first one
		defaultValue:
			consultingTypeOptions.find((cTO) => cTO.value === value) ||
			consultingTypeOptions[0]
	};

	return (
		<div className="consultingTypeSelection__possibleConsultingTypes">
			<Text
				text={t(
					'registration.consultingTypeAgencySelection.consultingType.infoText'
				)}
				type="standard"
			/>
			<SelectDropdown {...consultingTypeSelect} onKeyDown={onKeyDown} />
		</div>
	);
};
