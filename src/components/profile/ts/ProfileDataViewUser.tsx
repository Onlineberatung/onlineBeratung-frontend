import * as React from 'react';
import { useContext } from 'react';
import {
	translate,
	getResortTranslation,
	getAddictiveDrugsString,
	handleNumericTranslation
} from '../../../resources/ts/i18n/translate';
import { UserDataContext } from '../../../globalState';
import {
	convertUserDataObjectToArray,
	getAddictiveDrugsTranslatable,
	getUserDataTranslateBase
} from './profiles';

export const ProfileDataViewUser = () => {
	const { userData } = useContext(UserDataContext);
	const userSessionsData = userData.sessionData;
	const preparedUserSessionsData = convertUserDataObjectToArray(
		userSessionsData
	);

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

			{preparedUserSessionsData.map((resort, index) =>
				resort.value && Object.keys(resort.value).length > 0 ? (
					<div className="profile__data__itemWrapper" key={index}>
						<p className="profile__content__title">
							{getResortTranslation(parseInt(resort.type))}
						</p>
						{resort.value.map((item, index) => (
							<div className="profile__data__item" key={index}>
								<p className="profile__data__label">
									{translate('userProfile.data.' + item.type)}
								</p>
								<p
									className={
										item.value
											? `profile__data__content`
											: `profile__data__content profile__data__content--empty`
									}
								>
									{item.value
										? item.type === 'addictiveDrugs'
											? getAddictiveDrugsString(
													getAddictiveDrugsTranslatable(
														item.value
													)
											  )
											: handleNumericTranslation(
													getUserDataTranslateBase(
														parseInt(resort.type)
													),
													item.type,
													item.value
											  )
										: translate('profile.noContent')}
								</p>
							</div>
						))}
					</div>
				) : null
			)}
		</div>
	);
};
