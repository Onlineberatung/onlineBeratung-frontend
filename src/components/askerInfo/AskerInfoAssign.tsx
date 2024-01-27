import * as React from 'react';
import { useContext } from 'react';
import {
	UserDataContext,
	hasUserAuthority,
	AUTHORITIES
} from '../../globalState';
import { RequestSessionAssign } from '../sessionAssign/RequestSessionAssign';
import { Text } from '../text/Text';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';
import { useTranslation } from 'react-i18next';

export const AskerInfoAssign = ({
	title = 'userProfile.reassign.title'
}: {
	title?: string | null;
}) => {
	const { t: translate } = useTranslation();
	const { activeSession } = useContext(ActiveSessionContext);
	const { userData } = useContext(UserDataContext);

	return (
		!activeSession.isLive &&
		hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) && (
			<>
				<Text text={title && translate(title)} type="divider" />
				<Text
					className="asker-info-assign__description"
					text={translate('userProfile.reassign.description')}
					type="infoSmall"
				/>
				<RequestSessionAssign
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
