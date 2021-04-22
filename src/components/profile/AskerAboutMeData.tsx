import * as React from 'react';
import { useContext } from 'react';
import { UserDataContext } from '../../globalState';
import { translate } from '../../resources/scripts/i18n/translate';
import { Text } from '../text/Text';

export const AskerAboutMeData = () => {
	const { userData } = useContext(UserDataContext);

	return (
		<div>
			<Text text={translate('profile.data.title')} type="divider" />
			<div className="profile__data__item">
				<p className="profile__data__label">
					{translate('profile.data.userName')}
				</p>
				<p className="profile__data__content">{userData.userName}</p>
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
