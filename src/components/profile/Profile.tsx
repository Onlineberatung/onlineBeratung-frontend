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
							userData.twoFactorAuth?.isEnabled && (
								<TwoFactorAuth />
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
