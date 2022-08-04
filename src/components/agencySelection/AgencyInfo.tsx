import * as React from 'react';
import { useEffect, useState } from 'react';
import { AgencyDataInterface } from '../../globalState';
import { ReactComponent as InfoIcon } from '../../resources/img/icons/i.svg';
import { translate } from '../../utils/translate';
import { isMobile } from 'react-device-detect';
import { Text } from '../text/Text';
import './agencyInfo.styles';

export interface DisplayAgencyInfoProps {
	agency: AgencyDataInterface;
	isProfileView?: boolean;
}

export const AgencyInfo = (props: DisplayAgencyInfoProps) => {
	const agencyInfoRef = React.useRef<HTMLDivElement>(null);
	const [displayAgencyInfo, setDisplayAgencyInfo] =
		useState<AgencyDataInterface>(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				!agencyInfoRef.current?.contains(event.target) &&
				!event.target.getAttribute('data-agency-info-id') &&
				!event.target.closest('[data-agency-info-id]')
			) {
				setDisplayAgencyInfo(null);
			}
		};
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, [displayAgencyInfo]);

	return (
		<div className="agencyInfo__wrapper">
			<InfoIcon
				data-agency-info-id={props.agency.id}
				onClick={() =>
					displayAgencyInfo?.id === props.agency.id
						? setDisplayAgencyInfo(null)
						: setDisplayAgencyInfo(props.agency)
				}
				onMouseEnter={() => {
					if (!isMobile) {
						setDisplayAgencyInfo(props.agency);
					}
				}}
				onMouseLeave={() => {
					if (!isMobile) {
						setDisplayAgencyInfo(null);
					}
				}}
				onFocus={() => {
					if (!isMobile) {
						setDisplayAgencyInfo(props.agency);
					}
				}}
				onBlur={() => {
					if (!isMobile) {
						setDisplayAgencyInfo(null);
					}
				}}
				tabIndex={0}
			/>
			{displayAgencyInfo && displayAgencyInfo?.id === props.agency.id && (
				<div
					className={`agencyInfo ${
						props.isProfileView ? 'agencyInfo--above' : ''
					}`}
					ref={agencyInfoRef}
				>
					{displayAgencyInfo.teamAgency && (
						<div className="agencyInfo__teamAgency">
							<InfoIcon />
							<Text
								text={translate(
									'registration.agency.preselected.isTeam'
								)}
								type="infoSmall"
							/>
						</div>
					)}
					{displayAgencyInfo.name && (
						<Text
							className="agencyInfo__name"
							text={displayAgencyInfo.name}
							type="standard"
						/>
					)}
					{displayAgencyInfo.description && (
						<Text
							className="agencyInfo__description"
							text={displayAgencyInfo.description}
							type="infoSmall"
						/>
					)}
				</div>
			)}
		</div>
	);
};
