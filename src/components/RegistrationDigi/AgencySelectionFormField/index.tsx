import React from 'react';
import { Field, FieldContext } from 'rc-field-form';
import { ConsultingTypeBasicInterface } from '../../../globalState/interfaces/ConsultingTypeInterface';
import { PinIcon } from '../../../resources/img/icons';
import { AgencySelection } from '../../agencySelection/AgencySelection';
import { InputFormField } from '../InputFormField';

interface AgencySelectionFormFieldProps {
	mainTopicId: number;
	consultingType: ConsultingTypeBasicInterface;
	value?: string;
}
const LocalAgencySelection = ({
	mainTopicId,
	consultingType
}: AgencySelectionFormFieldProps) => {
	const field = React.useContext(FieldContext);
	return (
		<AgencySelection
			consultingType={consultingType}
			icon={<PinIcon />}
			initialPostcode={''}
			preselectedAgency={null}
			onAgencyChange={(agency) => {
				if (agency) {
					field.setFieldsValue({
						agencyId: agency?.id,
						consultingTypeId: agency?.consultingType,
						postcode: agency?.postcode
					});
				}
			}}
			hideExternalAgencies
			onValidityChange={() => null}
			agencySelectionNote={''}
			mainTopicId={mainTopicId}
		/>
	);
};

export const AgencySelectionFormField = ({
	mainTopicId,
	consultingType
}: AgencySelectionFormFieldProps) => (
	<>
		<Field name="agencyId">
			<LocalAgencySelection
				mainTopicId={mainTopicId}
				consultingType={consultingType}
			/>
		</Field>
		<InputFormField name="consultingTypeId" type="hidden" pattern={/\d+/} />
		<InputFormField name="postcode" type="hidden" />
	</>
);
