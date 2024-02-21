import React from 'react';
import { useTranslation } from 'react-i18next';
import { InfoTooltip } from '../../../../components/infoTooltip/InfoTooltip';
import { AgencyLanguages } from '../../../../components/agencySelection/AgencyLanguages';
import { RadioButton } from '../../../../components/radioButton/RadioButton';
import { AgencyDataInterface } from '../../../../globalState/interfaces';

interface AgencySelectionArgs {
	checkedValue: string;
	onChange: (value: string) => void;
	agency: AgencyDataInterface;
}

export const AgencySelection = ({
	checkedValue,
	onChange,
	agency
}: AgencySelectionArgs) => {
	const { t } = useTranslation(['common', 'consultingTypes']);
	const agencyId = agency.id.toString();
	const inputId = `agency-${agency.id.toString()}`;

	return (
		<div className="agencySelection__proposedAgency">
			<div className="agencySelection__proposedAgency__container">
				<RadioButton
					name="agencySelection"
					handleRadioButton={() => onChange(agencyId)}
					type="smaller"
					value={agencyId}
					checked={agencyId === checkedValue}
					inputId={inputId}
				>
					{t([`agency.${agency.id}.name`, agency.name], {
						ns: 'agencies'
					})}
				</RadioButton>

				<InfoTooltip
					translation={{
						ns: 'agencies',
						prefix: 'agency'
					}}
					info={agency}
					showTeamAgencyInfo={agency.teamAgency}
					isProfileView={false}
				/>
			</div>

			<div className="agencySelection__proposedAgency__content">
				{agency.agencyLogo && (
					<img
						className="agencySelection__proposedAgency__logo"
						src={agency.agencyLogo}
						alt={t([`agency.${agency.id}.name`, agency.name], {
							ns: 'agencies'
						})}
					/>
				)}
				<AgencyLanguages agencyId={agency.id} />
			</div>
		</div>
	);
};
