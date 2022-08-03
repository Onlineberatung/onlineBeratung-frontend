import React from 'react';
import { FieldContext } from 'rc-field-form';
import { ConsultingTypeBasicInterface } from '../../../globalState/interfaces/ConsultingTypeInterface';
import { translate } from '../../../utils/translate';
import { InputFormField } from '../InputFormField';
import { AgencySelection } from './AgencySelection';

interface AgencySelectionFormFieldProps {
	consultingType: ConsultingTypeBasicInterface;
	value?: string;
}

export const AgencySelectionFormField = ({
	consultingType
}: AgencySelectionFormFieldProps) => {
	const field = React.useContext(FieldContext);

	const { mainTopicId, gender, age } = field.getFieldsValue();

	return (
		<>
			{mainTopicId && gender && age ? (
				<AgencySelection consultingType={consultingType} />
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
