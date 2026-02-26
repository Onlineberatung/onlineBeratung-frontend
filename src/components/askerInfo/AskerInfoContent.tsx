import * as React from 'react';
import { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { SESSION_LIST_TAB, SESSION_LIST_TYPES } from '../session/sessionHelpers';
import {
	AUTHORITIES,
	hasUserAuthority,
	SessionTypeContext,
	TenantContext,
	UserDataContext,
	ActiveSessionContext
} from '../../globalState';
import { useSearchParam } from '../../hooks/useSearchParams';
import { AskerInfoData } from './AskerInfoData';
import { AskerInfoAssign } from './AskerInfoAssign';
import '../profile/profile.styles.scss';
import './askerInfo.styles.scss';
import { AskerInfoTools } from './AskerInfoTools';
import { Box } from '../box/Box';

export const AskerInfoContent = () => {
	const { t: translate } = useTranslation();
	const { tenant } = useContext(TenantContext);
	const { activeSession } = useContext(ActiveSessionContext);
	const { userData } = useContext(UserDataContext);

	const { type, path: listPath } = useContext(SessionTypeContext);
	const sessionListTab = useSearchParam<SESSION_LIST_TAB>('sessionListTab');

	const documentLibraryLink = `${listPath}/${activeSession.item.groupId}/${
		activeSession.item.id
	}/documentLibrary${sessionListTab ? `?sessionListTab=${sessionListTab}` : ''}`;

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
			{!activeSession.isLive && (
				<Box>
					<Link
						to={documentLibraryLink}
						className="askerInfo__documentLibraryLink"
					>
						<FolderOpenIcon aria-hidden="true" />
						{translate('documentLibrary.title')}
					</Link>
				</Box>
			)}
		</>
	);
};
