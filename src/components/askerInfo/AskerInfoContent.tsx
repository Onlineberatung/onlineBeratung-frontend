import * as React from 'react';
import { useCallback, useContext } from 'react';
import { SESSION_LIST_TYPES } from '../session/sessionHelpers';
import {
	AUTHORITIES,
	hasUserAuthority,
	SessionTypeContext,
	TenantContext,
	UserDataContext
} from '../../globalState';
import { AskerInfoData } from './AskerInfoData';
import { AskerInfoAssign } from './AskerInfoAssign';
import '../profile/profile.styles';
import './askerInfo.styles';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';
import { AskerInfoTools } from './AskerInfoTools';
import { Box } from '../box/Box';

export const AskerInfoContent = () => {
	const { tenant } = useContext(TenantContext);
	const { activeSession } = useContext(ActiveSessionContext);
	const { userData } = useContext(UserDataContext);

	const { type } = useContext(SessionTypeContext);

	const isSessionAssignAvailable = useCallback(() => {
		const isPeerChat = activeSession.item.isPeerChat;
		return (
			!hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) &&
			!activeSession.isLive &&
			!activeSession.isGroup &&
			((type === SESSION_LIST_TYPES.ENQUIRY &&
				hasUserAuthority(
					AUTHORITIES.ASSIGN_CONSULTANT_TO_ENQUIRY,
					userData
				) &&
				isPeerChat) ||
				(type !== SESSION_LIST_TYPES.ENQUIRY &&
					((isPeerChat &&
						hasUserAuthority(
							AUTHORITIES.ASSIGN_CONSULTANT_TO_PEER_SESSION,
							userData
						)) ||
						(!isPeerChat &&
							hasUserAuthority(
								AUTHORITIES.ASSIGN_CONSULTANT_TO_SESSION,
								userData
							)))))
		);
	}, [activeSession, type, userData]);

	return (
		<>
			<Box>
				<AskerInfoData />
			</Box>
			{tenant?.settings?.featureToolsEnabled && (
				<Box>
					<AskerInfoTools />
				</Box>
			)}
			{isSessionAssignAvailable() && (
				<Box>
					<div className="askerInfo__assign">
						<AskerInfoAssign />
					</div>
				</Box>
			)}
		</>
	);
};
