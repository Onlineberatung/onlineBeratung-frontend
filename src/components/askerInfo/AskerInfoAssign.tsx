import * as React from 'react';
import { useContext } from 'react';
import { translate } from '../../utils/translate';
import {
	getActiveSession,
	SessionsDataContext,
	ActiveSessionGroupIdContext,
	UserDataContext,
	hasUserAuthority,
	AUTHORITIES,
	isAnonymousSession
} from '../../globalState';
import { SessionAssign } from '../sessionAssign/SessionAssign';
import { Text } from '../text/Text';

export const AskerInfoAssign = () => {
	const { sessionsData } = useContext(SessionsDataContext);
	const { activeSessionGroupId } = useContext(ActiveSessionGroupIdContext);
	const activeSession = getActiveSession(activeSessionGroupId, sessionsData);
	const isLiveChat = isAnonymousSession(activeSession?.session);
	const { userData } = useContext(UserDataContext);

	return (
		!isLiveChat &&
		hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) && (
			<>
				<Text
					text={translate('userProfile.reassign.title')}
					type="divider"
				/>
				<SessionAssign
					value={
						activeSession.consultant
							? activeSession.consultant.id
							: null
					}
				/>
			</>
		)
	);
};
