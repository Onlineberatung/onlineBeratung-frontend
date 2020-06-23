import * as React from 'react';
import { useContext } from 'react';
import { translate } from '../../../resources/ts/i18n/translate';
import { UserDataContext } from '../../../globalState';

export const ProfileDataView = () => {
	const { userData } = useContext(UserDataContext);

	return (
		<div className="profile__content__item profile__data">
			<p className="profile__content__title">
				{translate('profile.data.title')}
			</p>
			<div className="profile__data__item">
				<p className="profile__data__label">
					{translate('profile.data.userName')}
				</p>
				<p className="profile__data__content">{userData.userName}</p>
			</div>
			<div className="profile__data__item">
				<p className="profile__data__label">
					{translate('profile.data.firstName')}
				</p>
				<p
					className={
						userData.firstName
							? `profile__data__content`
							: `profile__data__content profile__data__content--empty`
					}
				>
					{userData.firstName
						? userData.firstName
						: translate('profile.noContent')}
				</p>
			</div>
			<div className="profile__data__item">
				<p className="profile__data__label">
					{translate('profile.data.lastName')}
				</p>
				<p
					className={
						userData.lastName
							? `profile__data__content`
							: `profile__data__content profile__data__content--empty`
					}
				>
					{userData.lastName
						? userData.lastName
						: translate('profile.noContent')}
				</p>
			</div>
			<div className="profile__data__item">
				<p className="profile__data__label">
					{translate('profile.data.email')}
				</p>
				<p
					className={
						userData.email
							? `profile__data__content`
							: `profile__data__content profile__data__content--empty`
					}
				>
					{userData.email
						? userData.email
						: translate('profile.noContent')}
				</p>
			</div>
			<div className="profile__data__item">
				<p className="profile__data__label">
					{translate('profile.data.agency')}
				</p>
				{userData.agencies.map((item, i) => {
					return (
						<p className="profile__data__content" key={i}>
							{item.name}
						</p>
					);
				})}
			</div>
		</div>
	);
};
