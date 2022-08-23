import React from 'react';
import { AgencyDataInterface } from '../../../../globalState';
import { AgencyInfo } from '../../../agencySelection/AgencyInfo';
import { AgencyLanguages } from '../../../agencySelection/AgencyLanguages';
import { RadioButton } from '../../../radioButton/RadioButton';

interface AgencySelectionFormFieldProps {
	onChange: (value: number) => void;
	value?: number;
	agency: AgencyDataInterface;
}

export const AgencyRadioButtonForm = ({
	agency,
	value,
	onChange
}: AgencySelectionFormFieldProps) => (
	<div className="agencySelection__proposedAgency">
		<RadioButton
			name="agencySelection"
			handleRadioButton={() => onChange(agency?.id)}
			type="smaller"
			value={agency.id.toString()}
			checked={value === agency?.id}
			inputId={agency.id.toString()}
			label={agency.name}
		/>
		<AgencyInfo agency={agency} />
		<AgencyLanguages agencyId={agency.id} />
	</div>
);
