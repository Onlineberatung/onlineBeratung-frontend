import * as React from 'react';
import { AgencyDataInterface } from '../../globalState';
import { Headline } from '../headline/Headline';
import { RadioButton } from '../radioButton/RadioButton';
import { AgencyInfo } from './AgencyInfo';
import { AgencyLanguages } from './AgencyLanguages';
import './preselectedAgency.styles';

export interface PreselectedAgencyProps {
	prefix: string;
	agencyData: AgencyDataInterface;
	isProfileView?: boolean;
}

export const PreselectedAgency = (props: PreselectedAgencyProps) => (
	<div className="preselectedAgency" data-cy="show-preselected-agency">
		<Headline semanticLevel="4" styleLevel="5" text={props.prefix} />
		<div className="preselectedAgency__item">
			<RadioButton
				name="agencySelection"
				type="smaller"
				value={props.agencyData.id.toString()}
				checked
				inputId={props.agencyData.id.toString()}
				label={props.agencyData.name}
				handleRadioButton={() => void 0}
			/>
			<AgencyInfo
				agency={props.agencyData}
				isProfileView={props.isProfileView}
			/>
			<AgencyLanguages agencyId={props.agencyData.id} />
		</div>
	</div>
);
