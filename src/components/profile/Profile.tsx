import * as React from 'react';
import { useContext, useEffect } from 'react';
import { translate } from '../../utils/translate';
import { logout } from '../logout/logout';
import { config } from '../../resources/scripts/config';
import {
	UserDataContext,
	hasUserAuthority,
	AUTHORITIES,
	useConsultingTypes
} from '../../globalState';
import { ConsultantPrivateData } from './ConsultantPrivateData';
import { ConsultantPublicData } from './ConsultantPublicData';
import { consultingTypeSelectOptionsSet } from './profileHelpers';
import { AskerAboutMeData } from './AskerAboutMeData';
import { AskerConsultingTypeData } from './AskerConsultingTypeData';
import { AskerRegistration } from './AskerRegistration';
import { setProfileWrapperInactive } from '../app/navigationHandler';
import { ReactComponent as PersonIcon } from '../../resources/img/icons/person.svg';
import { ReactComponent as LogoutIcon } from '../../resources/img/icons/out.svg';
import { DeleteAccount } from './DeleteAccount';
import { AbsenceFormular } from '../absenceFormular/AbsenceFormular';
import { PasswordReset } from '../passwordReset/PasswordReset';
import { Text } from '../text/Text';
import { TwoFactorAuth } from './TwoFactorAuth';
import './profile.styles';

export const Profile = () => {
	const { userData } = useContext(UserDataContext);
	//TODO: remove mockdata
	const mock2faData = {
		twoFactorAuth: {
			isEnabled: true,
			isActive: false,
			secret: '7Tp1e6pA2aVLSxBOcD3I',
			qrCode:
				'iVBORw0KGgoAAAANSUhEUgAAAPYAAAD2AQAAAADNaUdlAAACxElEQVR4Xu2Wsa4jMQhF3fmX3ZmOX6ZYyXsPTjI7U7xqjfSkWMko4bhAcLlMWz+eP+0ZuZ8vf0bu58ufkfv5Fdxa6zaXTZsxV7Qx5nKCRdz1CUHXM0Z3t9E6wSpuiq3oCiike9Z0y7hSx631GKSn+rQ2ZjVfVIeuTK7NDFZxPqHEFF2m0ujiDtZwpOjP89DvE/9Pnsf5qkzWlarzj1PCrakxQ/KMQaaa0GljXv05zT0lqbYMXWJAdSEklHd+pzm4M5ZMhb56DKVYxrGlbZDBjCqAVapRRTx2M5gKzHlQnM6VIr7Ij1hsX5ZWlCrNquFGf9yRRpBplqsblarhVISdqPBLqVqT8/KnwzzQpdCeUN2lWNSoiDOfE1/OTilZTamu3fzhJJcVNxJCoJ45dnwyLn2c5SvVmXVhUmK7gxpUxRfZTBpkA19MWMqzLpPPSnkgzssfjnOlFtRFImVXsSE0JquKe2aHTzAiSIX0yrjnCwFLaWyb4oa21Fufp7l8cVGTwYgayoiUShWnJN3576lRiYMfH32c5urLYDYVyjcF2VNa9CriKo7K40yHJpPuDGzSqzhDQZUUUmIrzXngVEU8bYH+SJICFEtvJ3oWcV6KGsOhRe0MCD3idxEnsHCE7AsKHTQs3vmd5iqNlmPOplwy52KpTsI1HH3OlMfCKLUcx8QkZhEPlvNLFbRqrwg6VcNRxAwcgpei181//fswV34ic/uDIQ/el3od32nJoxdbUvYojer/pz+nuX6pHCkKRyyMaoqlhisjZyNJoLJKmIaElVXEORIju5HnRC36efnHYU4u6Q1OnjgD82FX/oe554jIj/KGzErScKJV3DDjHBBjMILlyBtrIUeeNMgwaPLzqz8VfOsxmMvOeK5KzhUNBhmqMcGC0Ld/+nOYZ26YMz6x0h6VJ48a/sP58mfkfr78GbmfX8//AoifMamdzb9IAAAAAElFTkSuQmCC'
		},
		...userData
	};
	const consultingTypes = useConsultingTypes();

	useEffect(() => {
		setProfileWrapperActive();
		return () => {
			setProfileWrapperInactive();
		};
	}, []);

	const handleLogout = () => {
		logout();
	};

	const setProfileWrapperActive = () => {
		document
			.querySelector('.contentWrapper__list')
			?.setAttribute('style', 'display: none');
		document
			.querySelector('.contentWrapper__detail')
			?.setAttribute('style', 'display: none');
		document
			.querySelector('.contentWrapper__profile')
			?.setAttribute('style', 'display: block');
	};

	return (
		<div className="profile__wrapper">
			<div className="profile__header">
				<div className="profile__header__wrapper">
					<h3 className="profile__header__title">
						{translate('profile.header.title')}
					</h3>
					<span
						onClick={handleLogout}
						className="profile__header__logout"
					>
						<LogoutIcon />
					</span>
				</div>
				<div className="profile__header__metaInfo">
					<p className="profile__header__username">
						{hasUserAuthority(
							AUTHORITIES.CONSULTANT_DEFAULT,
							userData
						)
							? `${userData.firstName} ${userData.lastName}`
							: userData.userName}
					</p>
				</div>
			</div>
			<div className="profile__innerWrapper">
				<div className="profile__user">
					<div className="profile__icon">
						<PersonIcon className="profile__icon--user" />
					</div>
					<h2>
						{hasUserAuthority(
							AUTHORITIES.CONSULTANT_DEFAULT,
							userData
						)
							? `${userData.firstName} ${userData.lastName}`
							: userData.userName}
					</h2>
				</div>
				<div className="profile__content">
					<div className="profile__content__item profile__functions">
						<Text
							text={translate('profile.functions.title')}
							type="divider"
						/>
						{hasUserAuthority(
							AUTHORITIES.CONSULTANT_DEFAULT,
							userData
						) && <AbsenceFormular />}
						<PasswordReset />
						{hasUserAuthority(
							AUTHORITIES.CONSULTANT_DEFAULT,
							userData
						) &&
							mock2faData.twoFactorAuth.isEnabled && (
								<TwoFactorAuth {...mock2faData} />
							)}
					</div>
					{hasUserAuthority(
						AUTHORITIES.CONSULTANT_DEFAULT,
						userData
					) ? (
						<div className="profile__content__item profile__data">
							<Text
								text={translate('profile.data.title')}
								type="divider"
							/>
							<ConsultantPrivateData />
							<ConsultantPublicData />
						</div>
					) : (
						<div className="profile__content__item profile__data">
							<AskerAboutMeData />
							<AskerConsultingTypeData />
							{consultingTypeSelectOptionsSet(
								userData,
								consultingTypes
							).length > 0 && <AskerRegistration />}
						</div>
					)}
					{hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) && (
						<DeleteAccount />
					)}
				</div>
				<div className="profile__footer">
					<a
						href={config.urls.imprint}
						target="_blank"
						rel="noreferrer"
						className="profile__footer__item"
					>
						{translate('profile.footer.imprint')}
					</a>
					<a
						href={config.urls.privacy}
						target="_blank"
						rel="noreferrer"
						className="profile__footer__item"
					>
						{translate('profile.footer.dataprotection')}
					</a>
				</div>
			</div>
		</div>
	);
};
