import * as React from 'react';
import { useContext } from 'react';
import {
	translate,
	getResortTranslation,
	getAddictiveDrugsString,
	handleNumericTranslation
} from '../../resources/scripts/i18n/translate';
import { UserDataContext } from '../../globalState';
import {
	getAddictiveDrugsTranslatable,
	getUserDataTranslateBase,
	consultingTypeSelectOptionsSet
} from './profileHelpers';
import { AskerNewRegistration } from './AskerNewRegistration';

export const ProfileDataViewAsker = () => {
	const { userData } = useContext(UserDataContext);

	const preparedUserData = Object.keys(userData.consultingTypes).map(
		(key) => {
			return userData.consultingTypes[key];
		}
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

			{preparedUserData.map((resort, index) =>
				resort.isRegistered && resort.agency ? (
					<div className="profile__data__itemWrapper" key={index}>
						<p className="profile__content__title">
							{getResortTranslation(index)}
						</p>
						{resort.sessionData
							? Object.keys(resort.sessionData).map(
									(item, itemIndex) => (
										<div
											className="profile__data__item"
											key={itemIndex}
										>
											<p className="profile__data__label">
												{translate(
													'userProfile.data.' + item
												)}
											</p>
											<p
												className={
													resort.sessionData[item]
														? `profile__data__content`
														: `profile__data__content profile__data__content--empty`
												}
											>
												{resort.sessionData[item]
													? item === 'addictiveDrugs'
														? getAddictiveDrugsString(
																getAddictiveDrugsTranslatable(
																	resort
																		.sessionData[
																		item
																	]
																)
														  )
														: handleNumericTranslation(
																getUserDataTranslateBase(
																	parseInt(
																		resort
																			.agency
																			.consultingType
																	)
																),
																item,
																resort
																	.sessionData[
																	item
																]
														  )
													: translate(
															'profile.noContent'
													  )}
											</p>
										</div>
									)
							  )
							: null}
						<div className="profile__data__item">
							<p className="profile__data__label">
								{translate('profile.data.agency')}
							</p>
							<p className="profile__data__content">
								{resort.agency.name} <br />
								{resort.agency.postcode}
								{resort.agency.city
									? ' ' + resort.agency.city
									: ''}
							</p>
						</div>
					</div>
				) : null
			)}
			{userData.consultingTypes[15].isRegistered ||
			consultingTypeSelectOptionsSet(userData).length === 0 ? null : (
				<AskerNewRegistration></AskerNewRegistration>
			)}
		</div>
	);
};
