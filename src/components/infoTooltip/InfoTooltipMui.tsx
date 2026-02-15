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
		<div style={{ padding: '12px 20px', textAlign: 'left' }}>
			{showTeamAgencyInfo && (
				<div style={{ display: 'flex', marginBottom: '8px' }}>
					<InfoIcon aria-hidden="true" focusable="false" style={{ marginRight: '8px' }} />
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
					style={{ fontWeight: 'bold' }}
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
					style={{ marginTop: '8px' }}
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
				<div style={{ position: 'relative', height: '24px', verticalAlign: 'middle', display: 'flex' }}>
					<InfoIcon
						onClick={handleToggle}
						tabIndex={0}
						aria-label={translate('notifications.info')}
						style={{ width: '24px', height: '24px', cursor: 'pointer' }}
					/>
					{open && (
						<div
							style={{
								position: 'absolute',
								top: isProfileView ? 'auto' : '50px',
								bottom: isProfileView ? '40px' : 'auto',
								right: '-12px',
								width: '266px',
								textAlign: 'left',
								zIndex: 20,
								boxSizing: 'border-box',
								background: 'white',
								padding: '16px 20px',
								border: '1px solid rgba(0, 0, 0, 0.05)',
								borderRadius: '4px',
								boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
							}}
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
		<div style={{ position: 'relative', height: '24px', verticalAlign: 'middle', display: 'flex' }}>
			<Tooltip
				title={tooltipContent}
				arrow
				placement={isProfileView ? 'top' : 'bottom'}
			>
				<InfoIcon
					tabIndex={0}
					aria-label={translate('notifications.info')}
					style={{ width: '24px', height: '24px', cursor: 'pointer' }}
				/>
			</Tooltip>
		</div>
	);
};
