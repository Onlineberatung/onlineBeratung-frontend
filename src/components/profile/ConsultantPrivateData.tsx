import * as React from 'react';
import { useContext } from 'react';
import { UserDataContext } from '../../globalState';
import { translate } from '../../resources/scripts/i18n/translate';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';

export const ConsultantPrivateData = () => {
	const { userData } = useContext(UserDataContext);

	return (
		<div>
			<div className="profile__content__title">
				<Headline
					text={translate('profile.data.title.private')}
					semanticLevel="5"
				/>
				<Text
					text={translate('profile.data.info.private')}
					type="infoLargeAlternative"
				/>
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
		</div>
	);
};
