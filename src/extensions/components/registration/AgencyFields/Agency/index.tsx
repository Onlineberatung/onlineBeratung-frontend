import React from 'react';
import { AgencyDataInterface } from '../../../../../globalState/interfaces';
import { InfoTooltip } from '../../../../../components/infoTooltip/InfoTooltip';
import { AgencyLanguages } from '../../../../../components/agencySelection/AgencyLanguages';
import { RadioButton } from '../../../../../components/radioButton/RadioButton';

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
		>
			{agency.name}
		</RadioButton>
		<InfoTooltip
			translation={{
				ns: 'agencies',
				prefix: 'agency'
			}}
			info={agency}
			showTeamAgencyInfo={agency.teamAgency}
		/>
		<AgencyLanguages agencyId={agency.id} />
	</div>
);
