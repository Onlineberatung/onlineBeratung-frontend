import * as React from 'react';
import { useContext, useMemo } from 'react';
import { SESSION_LIST_TYPES } from '../session/sessionHelpers';
import {
	AUTHORITIES,
	hasUserAuthority,
	SessionTypeContext,
	TenantContext,
	UserDataContext,
	ActiveSessionContext
} from '../../globalState';
import { AskerInfoData } from './AskerInfoData';
import { AskerInfoAssign } from './AskerInfoAssign';
import '../profile/profile.styles';
import './askerInfo.styles';
import { AskerInfoTools } from './AskerInfoTools';
import { Box } from '../box/Box';

export const AskerInfoContent = () => {
	const { tenant } = useContext(TenantContext);
	const { activeSession } = useContext(ActiveSessionContext);
	const { userData } = useContext(UserDataContext);

	const { type } = useContext(SessionTypeContext);

	const isSessionAssignAvailable = useMemo(() => {
		const isPeerChat = activeSession.item.isPeerChat;
		const isLiveChat = activeSession.isLive;
		const isGroupChat = activeSession.isGroup;
		const isEnquiryListView = type === SESSION_LIST_TYPES.ENQUIRY;
		const isAsker = hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData);

		if (isAsker || isLiveChat || isGroupChat) {
			return false;
		}

		if (isEnquiryListView) {
			return (
				isPeerChat &&
				hasUserAuthority(
					AUTHORITIES.ASSIGN_CONSULTANT_TO_ENQUIRY,
					userData
				)
			);
		}

		return hasUserAuthority(
			isPeerChat
				? AUTHORITIES.ASSIGN_CONSULTANT_TO_PEER_SESSION
				: AUTHORITIES.ASSIGN_CONSULTANT_TO_SESSION,
			userData
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
			{isSessionAssignAvailable && (
				<Box>
					<div className="askerInfo__assign">
						<AskerInfoAssign />
					</div>
				</Box>
			)}
		</>
	);
};
