import * as React from 'react';
import { useContext } from 'react';
import { translate } from '../../utils/translate';
import {
	UserDataContext,
	hasUserAuthority,
	AUTHORITIES
} from '../../globalState';
import { SessionAssign } from '../sessionAssign/SessionAssign';
import { Text } from '../text/Text';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';

export const AskerInfoAssign = () => {
	const activeSession = useContext(ActiveSessionContext);
	const { userData } = useContext(UserDataContext);

	return (
		!activeSession.isLive &&
		hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) && (
			<>
				<Text
					text={translate('userProfile.reassign.title')}
					type="divider"
				/>
				<Text
					className="asker-info-assign__description"
					text={translate('userProfile.reassign.description')}
					type="infoSmall"
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
