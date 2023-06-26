import { useState, useContext, useEffect } from 'react';
import * as React from 'react';
import { Banner } from '../banner/Banner';
import './E2EEncryptionSupportBanner.styles.scss';
import {
	hasVideoCallAbility,
	supportsE2EEncryptionVideoCall
} from '../../utils/videoCallHelpers';
import { useTranslation } from 'react-i18next';
import {
	AUTHORITIES,
	ConsultingTypesContext,
	hasUserAuthority,
	SessionsDataContext,
	STATUS_EMPTY,
	UserDataContext
} from '../../globalState';
import { Link } from 'react-router-dom';

export const E2EEncryptionSupportBanner = () => {
	const [showBanner, setShowBanner] = useState<boolean>(false);
	const { t: translate } = useTranslation();
	const { consultingTypes } = useContext(ConsultingTypesContext);
	const { userData } = useContext(UserDataContext);
	const { sessions } = useContext(SessionsDataContext);

	useEffect(() => {
		if (
			hasVideoCallAbility(userData, consultingTypes) &&
			// don't show banner when user enters first message
			!(
				hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) &&
				(sessions.length === 0 ||
					(sessions.length === 1 &&
						sessions[0]?.session?.status === STATUS_EMPTY))
			)
		) {
			setShowBanner(
				!supportsE2EEncryptionVideoCall() &&
					!sessionStorage.getItem('hideEncryptionBanner')
			);
		}
	}, [userData, consultingTypes, sessions]);

	useEffect(() => {
		const fn = showBanner ? 'add' : 'remove';
		document.body.classList[fn]('banner-open');
	}, [showBanner]);

	if (!showBanner) {
		return null;
	}

	return (
		<Banner
			className="encryption-banner"
			onClose={() => {
				sessionStorage.setItem('hideEncryptionBanner', 'true');
				setShowBanner(false);
			}}
		>
			<svg
				width="21"
				height="20"
				viewBox="0 0 21 20"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M9.84969 11.5505V14.8745C9.84969 15.1585 9.99129 15.3337 10.2745 15.4001C10.5585 15.4665 10.7669 15.3749 10.8997 15.1253L13.8997 9.25009C13.9837 9.06689 13.9753 8.88769 13.8745 8.71249C13.7753 8.53729 13.6173 8.44969 13.4005 8.44969H11.3005V5.05009C11.3005 4.76689 11.1629 4.58769 10.8877 4.51249C10.6125 4.43729 10.4081 4.53329 10.2745 4.80049L7.12569 10.7501C7.02489 10.9333 7.02889 11.1125 7.13769 11.2877C7.24569 11.4629 7.39969 11.5505 7.59969 11.5505H9.84969ZM10.5001 19.9997C9.11689 19.9997 7.81689 19.7373 6.60009 19.2125C5.38329 18.6877 4.32489 17.9753 3.42489 17.0753C2.52489 16.1753 1.81249 15.1169 1.28769 13.9001C0.762888 12.6833 0.500488 11.3833 0.500488 10.0001C0.500488 8.61689 0.762888 7.31689 1.28769 6.10009C1.81249 4.88329 2.52489 3.82489 3.42489 2.92489C4.32489 2.02489 5.38329 1.31249 6.60009 0.787688C7.81689 0.262888 9.11689 0.000488281 10.5001 0.000488281C11.8833 0.000488281 13.1833 0.262888 14.4001 0.787688C15.6169 1.31249 16.6753 2.02489 17.5753 2.92489C18.4753 3.82489 19.1877 4.88329 19.7125 6.10009C20.2373 7.31689 20.4997 8.61689 20.4997 10.0001C20.4997 11.3833 20.2373 12.6833 19.7125 13.9001C19.1877 15.1169 18.4753 16.1753 17.5753 17.0753C16.6753 17.9753 15.6169 18.6877 14.4001 19.2125C13.1833 19.7373 11.8833 19.9997 10.5001 19.9997Z"
					fill="black"
				/>
			</svg>
			<p>
				{translate('help.videoCall.banner.content')}{' '}
				<Link to="/profile/hilfe/videoCall">
					{translate('help.videoCall.banner.more')}
				</Link>
			</p>
		</Banner>
	);
};
