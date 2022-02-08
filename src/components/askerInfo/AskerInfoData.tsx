import * as React from 'react';
import { useContext } from 'react';
import {
	translate,
	handleNumericTranslation,
	getAddictiveDrugsString
} from '../../utils/translate';
import {
	getContact,
	isAnonymousSession,
	useConsultingType
} from '../../globalState';
import {
	convertUserDataObjectToArray,
	getAddictiveDrugsTranslatable,
	getUserDataTranslateBase
} from '../profile/profileHelpers';
import { Text } from '../text/Text';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';

export const AskerInfoData = () => {
	const activeSession = useContext(ActiveSessionContext);
	const isLiveChat = isAnonymousSession(activeSession?.session);

	const consultingType = useConsultingType(
		activeSession?.session.consultingType
	);

	const userSessionData = getContact(activeSession).sessionData;
	const preparedUserSessionData =
		convertUserDataObjectToArray(userSessionData);
	const addictiveDrugs = userSessionData.addictiveDrugs
		? getAddictiveDrugsTranslatable(userSessionData.addictiveDrugs)
		: null;

	return (
		<>
			<Text text={translate('userProfile.data.title')} type="divider" />
			<div className="profile__data__item">
				<p className="profile__data__label">
					{translate('userProfile.data.resort')}
				</p>
				<p className="profile__data__content">
					{consultingType.titles.default}
				</p>
			</div>
			{activeSession?.session.consultingType === 0 && !isLiveChat && (
				<div className="profile__data__item">
					<p className="profile__data__label">
						{translate('userProfile.data.postcode')}
					</p>
					<p className="profile__data__content">
						{activeSession.session.postcode}
					</p>
				</div>
			)}
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
		</>
	);
};
