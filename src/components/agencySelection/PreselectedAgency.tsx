import * as React from 'react';
import { Text } from '../text/Text';
import { AgencyDataInterface } from '../../globalState';
import { Headline } from '../headline/Headline';
import { AgencyInfo } from './AgencyInfo';
import './preselectedAgency.styles';
import { AgencyLanguages } from './AgencyLanguages';

export interface PreselectedAgencyProps {
	prefix: string;
	agencyData: AgencyDataInterface;
	isProfileView?: boolean;
}

export const PreselectedAgency = (props: PreselectedAgencyProps) => (
	<div className="preselectedAgency" data-cy="show-preselected-agency">
		<Headline semanticLevel="4" styleLevel="5" text={props.prefix} />
		<div className="preselectedAgency__item">
			<Text text={props.agencyData.name} type="standard" />
			<AgencyInfo
				agency={props.agencyData}
				isProfileView={props.isProfileView}
			/>
		</div>
		<div>
			<AgencyLanguages agencyId={props.agencyData.id} />
		</div>
	</div>
);
