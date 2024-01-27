import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { AgencyDataInterface } from '../../../../globalState/interfaces';
import { Headline } from '../../../../components/headline/Headline';
import { RadioButton } from '../../../../components/radioButton/RadioButton';
import { AgencyInfo } from '../../../../components/agencySelection/AgencyInfo';
import { AgencyLanguages } from '../../../../components/agencySelection/AgencyLanguages';
import './preselectedAgency.styles';

export interface PreselectedAgencyProps {
	prefix: string;
	agencyData: AgencyDataInterface;
	isProfileView?: boolean;
	onKeyDown?: Function;
}

export const PreselectedAgency = (props: PreselectedAgencyProps) => {
	const { t: translate } = useTranslation(['agencies']);

	return (
		<div className="preselectedAgency" data-cy="show-preselected-agency">
			{props.prefix && (
				<Headline
					semanticLevel="4"
					styleLevel="5"
					text={props.prefix}
				/>
			)}
			<div className="preselectedAgency__item">
				<div className="preselectedAgency__item__container">
					<RadioButton
						name="agencySelection"
						type="smaller"
						value={props.agencyData.id.toString()}
						checked
						inputId={props.agencyData.id.toString()}
						label={translate(
							[
								`agency.${props.agencyData.id}.name`,
								props.agencyData.name
							],
							{ ns: 'agencies' }
						)}
						handleRadioButton={() => void 0}
						onKeyDown={(e) =>
							props.onKeyDown ? props.onKeyDown(e) : null
						}
					/>
					<AgencyInfo
						agency={props.agencyData}
						isProfileView={props.isProfileView}
					/>
				</div>
				<AgencyLanguages agencyId={props.agencyData.id} />
			</div>
		</div>
	);
};
