import React from 'react';
import { FieldContext } from 'rc-field-form';
import { ConsultingTypeBasicInterface } from '../../../globalState/interfaces/ConsultingTypeInterface';
import { translate } from '../../../utils/translate';
import { InputFormField } from '../InputFormField';
import { AgencySelection } from './AgencySelection';
import { AgencyDataInterface } from '../../../globalState';

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

	const { mainTopicId, gender, age } = field.getFieldsValue();

	return (
		<>
			{(mainTopicId && gender && age) ||
			preselectedAgencies.length > 0 ? (
				<AgencySelection
					consultingType={consultingType}
					preselectedAgencies={preselectedAgencies}
				/>
			) : (
				<div className="registrationFormDigi__AgencyMandatoryFields">
					{translate('registrationDigi.agency.fullFillAllFields')}
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
