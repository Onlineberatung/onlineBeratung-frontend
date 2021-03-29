import * as React from 'react';
import { useEffect, useState } from 'react';
import { AgencyDataInterface } from '../../globalState';
import { ReactComponent as InfoIcon } from '../../resources/img/icons/i.svg';
import { translate } from '../../resources/scripts/i18n/translate';
import { isMobile } from 'react-device-detect';
import './agencyInfo.styles';

export interface DisplayAgencyInfoProps {
	agency: AgencyDataInterface;
	isProfileView?: boolean;
}

export const AgencyInfo = (props: DisplayAgencyInfoProps) => {
	const agencyInfoRef = React.useRef<HTMLDivElement>(null);
	const [displayAgencyInfo, setDisplayAgencyInfo] = useState<
		AgencyDataInterface
	>(null);

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
							{translate(
								'registration.agency.preselected.isTeam'
							)}
						</div>
					)}
					{displayAgencyInfo.name && (
						<div className="agencyInfo__name">
							{displayAgencyInfo.name}
						</div>
					)}
					{displayAgencyInfo.description && (
						<div
							className="agencyInfo__description"
							dangerouslySetInnerHTML={{
								__html: displayAgencyInfo.description
							}}
						></div>
					)}
				</div>
			)}
		</div>
	);
};
