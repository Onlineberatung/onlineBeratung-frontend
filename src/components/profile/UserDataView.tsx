import * as React from 'react';
import { useContext } from 'react';
import {
	translate,
	handleNumericTranslation,
	getAddictiveDrugsString,
	getResortTranslation
} from '../../resources/scripts/i18n/translate';
import {
	SessionsDataContext,
	ActiveSessionGroupIdContext,
	getActiveSession,
	getContact
} from '../../globalState';
import {
	convertUserDataObjectToArray,
	getAddictiveDrugsTranslatable,
	getUserDataTranslateBase
} from './profileHelpers';

export const UserDataView = () => {
	const { sessionsData } = useContext(SessionsDataContext);
	const { activeSessionGroupId } = useContext(ActiveSessionGroupIdContext);
	const activeSession = getActiveSession(activeSessionGroupId, sessionsData);

	const resort = getResortTranslation(activeSession.session.consultingType);

	const userSessionData = getContact(activeSession).sessionData;
	const preparedUserSessionData = convertUserDataObjectToArray(
		userSessionData
	);
	const addictiveDrugs = userSessionData.addictiveDrugs
		? getAddictiveDrugsTranslatable(userSessionData.addictiveDrugs)
		: null;

	return (
		<div className="profile__content__item profile__data">
			<p className="profile__content__title">
				{translate('userProfile.data.title')}
			</p>

			<div className="profile__data__item">
				<p className="profile__data__label">
					{translate('userProfile.data.resort')}
				</p>
				<p className="profile__data__content">{resort}</p>
			</div>
			{activeSession.session.consultingType === 0 ? (
				<div className="profile__data__item">
					<p className="profile__data__label">
						{translate('userProfile.data.postcode')}
					</p>
					<p className="profile__data__content">
						{activeSession.session.postcode}
					</p>
				</div>
			) : null}
			{preparedUserSessionData.map((item, index) => (
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
								? getAddictiveDrugsString(addictiveDrugs)
								: handleNumericTranslation(
										getUserDataTranslateBase(
											activeSession.session.consultingType
										),
										item.type,
										item.value
								  )
							: translate('profile.noContent')}
					</p>
				</div>
			))}
		</div>
	);
};
