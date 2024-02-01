import React from 'react';
import { FieldContext } from 'rc-field-form';
import {
	ConsultingTypeBasicInterface,
	AgencyDataInterface
} from '../../../../globalState';
import { InputFormField } from '../InputFormField';
import { AgencySelection } from './AgencySelection';
import { useTranslation } from 'react-i18next';
import { Text } from '../../../../components/text/Text';

interface AgencySelectionFormFieldProps {
	preselectedAgencies: AgencyDataInterface[];
	consultingType: ConsultingTypeBasicInterface;
	value?: string;
}

export const AgencySelectionFormField = ({
	consultingType,
	preselectedAgencies
}: AgencySelectionFormFieldProps) => {
	const field = React.useContext(FieldContext);
	const { t: translate } = useTranslation();
	const { mainTopicId, gender, age, counsellingRelation } =
		field.getFieldsValue();

	return (
		<>
			{!!(
				Number(mainTopicId) >= 0 &&
				gender &&
				age &&
				counsellingRelation
			) || preselectedAgencies.length > 0 ? (
				<AgencySelection
					consultingType={consultingType}
					preselectedAgencies={preselectedAgencies}
				/>
			) : (
				<div className="registrationFormDigi__AgencyMandatoryFields">
					<Text
						type="standard"
						text={translate(
							'registrationDigi.agency.fullFillAllFields'
						)}
					/>
				</div>
			)}

			<InputFormField
				name="consultingTypeId"
				type="hidden"
				pattern={/^[0-9]+$/}
			/>
			<InputFormField name="postCode" type="hidden" />
			<InputFormField name="agencyId" type="hidden" />
		</>
	);
};
