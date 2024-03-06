import React from 'react';
import { useTranslation } from 'react-i18next';
import './agencyRadioSelect.styles';
import { AgencyDataInterface } from '../../globalState/interfaces';
import { Headline } from '../headline/Headline';
import { RadioButton } from '../radioButton/RadioButton';
import { InfoTooltip } from '../infoTooltip/InfoTooltip';
import { AgencyLanguages } from './AgencyLanguages';
import clsx from 'clsx';

interface AgencyRadioSelectProps {
	agency: AgencyDataInterface;
	checkedValue: string;
	showTooltipAbove?: boolean;
	prefix?: string;
	onChange?: (agency: AgencyDataInterface) => void;
	onKeyDown?: (event: KeyboardEvent) => void;
}

export const AgencyRadioSelect = ({
	checkedValue,
	onChange,
	onKeyDown,
	agency,
	prefix,
	showTooltipAbove = false
}: AgencyRadioSelectProps) => {
	const { t } = useTranslation('agencies');
	const agencyIdAsString = agency.id.toString();

	return (
		<div className="agencyRadioSelect__wrapper">
			{prefix && (
				<Headline semanticLevel="4" styleLevel="5" text={prefix} />
			)}
			<div
				className={clsx('agencyRadioSelect__radioContainer', {
					'agencyRadioSelect__radioContainer--withHeadline': !!prefix
				})}
			>
				<RadioButton
					name="agencySelection"
					handleRadioButton={() => onChange && onChange(agency)}
					onKeyDown={(e: KeyboardEvent) => onKeyDown && onKeyDown(e)}
					type="smaller"
					value={agencyIdAsString}
					checked={agencyIdAsString === checkedValue}
					inputId={`agency-${agencyIdAsString}`}
				>
					{t([`agency.${agencyIdAsString}.name`, agency.name])}
				</RadioButton>

				<InfoTooltip
					translation={{
						ns: 'agencies',
						prefix: 'agency'
					}}
					info={agency}
					showTeamAgencyInfo={agency.teamAgency}
					isProfileView={showTooltipAbove}
				/>
			</div>

			<div className="agencyRadioSelect__content">
				{agency.agencyLogo && (
					<img
						className="agencyRadioSelect__logo"
						src={agency.agencyLogo}
						alt={t([
							`agency.${agencyIdAsString}.name`,
							agency.name
						])}
					/>
				)}
				<AgencyLanguages agencyId={agency.id} />
			</div>
		</div>
	);
};
