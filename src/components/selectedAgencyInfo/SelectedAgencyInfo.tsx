import * as React from 'react';
import { translate } from '../../resources/scripts/i18n/translate';
import { autoselectAgencyForConsultingType } from '../agencySelection/agencySelectionHelpers';
import { InfoText } from '../infoText/InfoText';
import { ReactComponent as InfoIcon } from '../../resources/img/icons/i.svg';
import './selectedAgencyInfo.styles';
import { AgencyDataInterface } from '../../globalState';

export interface SelectedAgencyInfoProps {
	prefix: string;
	agencyData: AgencyDataInterface;
	className?: string;
	consultingType?: number;
}

export const SelectedAgencyInfo = (props: SelectedAgencyInfoProps) => {
	const isAutoSelectedAgency =
		props.consultingType &&
		autoselectAgencyForConsultingType(props.consultingType);
	const hideAllInfo = isAutoSelectedAgency && !props.agencyData.teamAgency;
	const onlyShowTeamAgencyInfo =
		isAutoSelectedAgency && props.agencyData.teamAgency;
	if (hideAllInfo) {
		return null;
	} else if (onlyShowTeamAgencyInfo) {
		return (
			<div
				className={`selectedAgencyInfo ${
					props.className ? props.className : ''
				}`}
			>
				<div className="selectedAgencyInfo__teamAgency">
					<InfoIcon className="selectedAgencyInfo__icon" />
					<InfoText
						text={translate('registration.agency.prefilled.isTeam')}
						className="selectedAgencyInfo__text"
					/>
				</div>
			</div>
		);
	}

	return (
		<div
			className={`selectedAgencyInfo ${
				props.className ? props.className : ''
			}`}
		>
			<InfoText
				text={props.prefix}
				className="selectedAgencyInfo__text"
			/>
			<p className="selectedAgencyInfo__agencyName">
				{props.agencyData.name}
			</p>
			{props.agencyData.teamAgency && (
				<div className="selectedAgencyInfo__teamAgency">
					<InfoIcon className="selectedAgencyInfo__icon" />
					<InfoText
						text={translate('registration.agency.prefilled.isTeam')}
						className="selectedAgencyInfo__text"
					/>
				</div>
			)}
		</div>
	);
};
