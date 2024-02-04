import * as React from 'react';
import { useEffect, useState } from 'react';
import { ReactComponent as InfoIcon } from '../../resources/img/icons/i.svg';
import { isMobile } from 'react-device-detect';
import { Text } from '../text/Text';
import './infoTooltip.styles';
import { useTranslation } from 'react-i18next';

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

export const InfoTooltip = ({
	translation,
	isProfileView,
	showTeamAgencyInfo,
	info
}: DisplayInfoProps) => {
	const { t: translate } = useTranslation(['common', translation.ns]);
	const agencyInfoRef = React.useRef<HTMLDivElement>(null);
	const [displayInfo, setDisplayInfo] = useState<InfoInterface>(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				!agencyInfoRef.current?.contains(event.target) &&
				!event.target.getAttribute('data-info-id') &&
				!event.target.closest('[data-info-id]')
			) {
				setDisplayInfo(null);
			}
		};
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, [displayInfo]);

	return (
		<div className="agencyInfo__wrapper">
			<InfoIcon
				data-info-id={info.id}
				onClick={() =>
					displayInfo?.id === info.id
						? setDisplayInfo(null)
						: setDisplayInfo(info)
				}
				onMouseEnter={() => {
					if (!isMobile) {
						setDisplayInfo(info);
					}
				}}
				onMouseLeave={() => {
					if (!isMobile) {
						setDisplayInfo(null);
					}
				}}
				onFocus={() => {
					if (!isMobile) {
						setDisplayInfo(info);
					}
				}}
				onBlur={() => {
					if (!isMobile) {
						setDisplayInfo(null);
					}
				}}
				tabIndex={0}
				title={translate('notifications.info')}
				aria-label={translate('notifications.info')}
			/>
			{displayInfo && displayInfo?.id === info.id && (
				<div
					className={`agencyInfo ${
						isProfileView ? 'agencyInfo--above' : ''
					}`}
					ref={agencyInfoRef}
				>
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
					{displayInfo.name && (
						<Text
							className="agencyInfo__name"
							text={translate(
								[
									`${translation.prefix}.${displayInfo.id}.name`,
									displayInfo.name
								],
								{ ns: translation.ns }
							)}
							type="standard"
						/>
					)}
					{displayInfo.description && (
						<Text
							className="agencyInfo__description"
							text={translate(
								[
									`${translation.prefix}.${displayInfo.id}.description`,
									displayInfo.description
								],
								{ ns: translation.ns }
							)}
							type="infoSmall"
						/>
					)}
				</div>
			)}
		</div>
	);
};
