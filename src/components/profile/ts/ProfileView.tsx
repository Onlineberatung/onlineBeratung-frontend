import * as React from 'react';
import { useContext, useEffect } from 'react';
import { translate } from '../../../resources/ts/i18n/translate';
import { ProfileDataViewConsultant } from './ProfileDataViewConsultant';
import { ProfileFunctions } from './ProfileFunctions';
import { logout } from '../../logout/ts/logout';
import { config } from '../../../resources/ts/config';
import {
	UserDataContext,
	hasUserAuthority,
	AUTHORITIES
} from '../../../globalState';
import { ProfileDataViewAsker } from './ProfileDataViewAsker';

export const ProfileView = () => {
	const { userData } = useContext(UserDataContext);

	useEffect(() => {
		setProfileWrapperActive();
	});

	const handleLogout = () => {
		logout();
	};

	const setProfileWrapperActive = () => {
		document
			.querySelector('.contentWrapper__list')
			.setAttribute('style', 'display: none');
		document
			.querySelector('.contentWrapper__detail')
			.setAttribute('style', 'display: none');
		document
			.querySelector('.contentWrapper__profile')
			.setAttribute('style', 'display: block');
	};

	return (
		<div className="profile__wrapper">
			<div className="profile__header">
				<div className="profile__header__wrapper">
					<h3 className="profile__header__title">
						{translate('profile.header.title')}
					</h3>
					<a
						onClick={handleLogout}
						className="profile__header__logout"
					>
						<img src="/resources/img/icons/out.svg" />
					</a>
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
					<div className="profile__icon profile__icon--user"></div>
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
					<ProfileFunctions />
					{hasUserAuthority(
						AUTHORITIES.CONSULTANT_DEFAULT,
						userData
					) ? (
						<ProfileDataViewConsultant />
					) : (
						<ProfileDataViewAsker />
					)}
				</div>
				<div className="profile__footer">
					<a
						href={config.endpoints.caritasImprint}
						target="_blank"
						className="profile__footer__item"
					>
						{translate('profile.footer.imprint')}
					</a>
					<a
						href={config.endpoints.caritasDataprotection}
						target="_blank"
						className="profile__footer__item"
					>
						{translate('profile.footer.dataprotection')}
					</a>
				</div>
			</div>
		</div>
	);
};
