import * as React from 'react';
import { useState } from 'react';
import { Tooltip, ClickAwayListener } from '@mui/material';
import InfoIcon from '../../resources/img/icons/i.svg?react';
import { isMobile } from 'react-device-detect';
import { Text } from '../text/Text';
import { useTranslation } from 'react-i18next';
import './infoTooltip.styles.scss';

interface InfoInterface {
	id: number;
	name: string;
	description: string;
}

export interface DisplayInfoProps {
	info: InfoInterface;
	translation: {
		prefix: string;
		ns: string;
	};
	isProfileView?: boolean;
	showTeamAgencyInfo?: boolean;
}

/**
 * MUI-based InfoTooltip component
 * Uses MUI Tooltip for desktop hover behavior
 * Uses ClickAwayListener for mobile click behavior
 */
export const InfoTooltipMui = ({
	translation,
	isProfileView,
	showTeamAgencyInfo,
	info
}: DisplayInfoProps) => {
	const { t: translate } = useTranslation(['common', translation.ns]);
	const [open, setOpen] = useState(false);

	const handleToggle = () => {
		setOpen(!open);
	};

	const handleClose = () => {
		setOpen(false);
	};

	// Tooltip content component
	const tooltipContent = (
		<div className="agencyInfo__content">
			{showTeamAgencyInfo && (
				<div className="agencyInfo__teamAgency">
					<InfoIcon aria-hidden="true" focusable="false" />
					<Text
						text={translate(
							`registration.${translation.prefix}.preselected.isTeam`
						)}
						type="standard"
					/>
				</div>
			)}
			{info.name && (
				<Text
					className="agencyInfo__name"
					text={translate(
						[
							`${translation.prefix}.${info.id}.name`,
							info.name
						],
						{ ns: translation.ns }
					)}
					type="standard"
				/>
			)}
			{info.description && (
				<Text
					className="agencyInfo__description"
					text={translate(
						[
							`${translation.prefix}.${info.id}.description`,
							info.description
						],
						{ ns: translation.ns }
					)}
					type="infoSmall"
				/>
			)}
		</div>
	);

	// Mobile: Use ClickAwayListener for click behavior
	if (isMobile) {
		return (
			<ClickAwayListener onClickAway={handleClose}>
				<div className="agencyInfo__wrapper">
					<InfoIcon
						onClick={handleToggle}
						tabIndex={0}
						title={translate('notifications.info')}
						aria-label={translate('notifications.info')}
					/>
					{open && (
						<div
							className={`agencyInfo ${
								isProfileView ? 'agencyInfo--above' : ''
							}`}
						>
							{tooltipContent}
						</div>
					)}
				</div>
			</ClickAwayListener>
		);
	}

	// Desktop: Use MUI Tooltip for hover behavior
	return (
		<div className="agencyInfo__wrapper">
			<Tooltip
				title={tooltipContent}
				arrow
				placement={isProfileView ? 'top' : 'bottom'}
				classes={{
					tooltip: 'agencyInfo',
					arrow: 'agencyInfo__arrow'
				}}
			>
				<InfoIcon
					tabIndex={0}
					title={translate('notifications.info')}
					aria-label={translate('notifications.info')}
				/>
			</Tooltip>
		</div>
	);
};
