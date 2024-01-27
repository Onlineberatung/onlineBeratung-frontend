import React from 'react';
import { useTranslation } from 'react-i18next';
import { AgencyInfo } from '../../../../components/agencySelection/AgencyInfo';
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
					label={t([`agency.${agency.id}.name`, agency.name], {
						ns: 'agencies'
					})}
				/>
				<AgencyInfo agency={agency} isProfileView={false} />
			</div>
			<AgencyLanguages agencyId={agency.id} />
		</div>
	);
};
