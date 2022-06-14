import * as React from 'react';
import { useEffect, useContext, useState, useCallback } from 'react';
import {
	UserDataContext,
	hasUserAuthority,
	AUTHORITIES,
	useConsultingType,
	LegalLinkInterface,
	UPDATE_SESSIONS,
	SessionsDataContext,
	E2EEContext
} from '../../globalState';
import { mobileListView } from '../app/navigationHandler';
import { SessionHeaderComponent } from '../sessionHeader/SessionHeaderComponent';
import { getSessionListPathForLocation } from '../session/sessionHelpers';
import {
	apiPutGroupChat,
	apiGetGroupChatInfo,
	GROUP_CHAT_API,
	FETCH_ERRORS
} from '../../api';
import {
	OverlayWrapper,
	Overlay,
	OVERLAY_FUNCTIONS,
	OverlayItem
} from '../overlay/Overlay';
import { translate } from '../../utils/translate';
import {
	startButtonItem,
	joinButtonItem,
	startJoinGroupChatErrorOverlay,
	joinGroupChatClosedErrorOverlay
} from './joinGroupChatHelpers';
import { Button } from '../button/Button';
import { logout } from '../logout/logout';
import { Redirect, useLocation } from 'react-router-dom';
import { ReactComponent as WarningIcon } from '../../resources/img/icons/i.svg';
import './joinChat.styles';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';
import { bannedUserOverlay } from '../banUser/banUserHelper';
import { useE2EE } from '../../hooks/useE2EE';
import {
	createGroupKey,
	encryptForParticipant
} from '../../utils/encryptionHelpers';
import { apiRocketChatUpdateGroupKey } from '../../api/apiRocketChatUpdateGroupKey';
import { apiRocketChatSetRoomKeyID } from '../../api/apiRocketChatSetRoomKeyID';
import { getValueFromCookie } from '../sessionCookie/accessSessionCookie';
import {
	ALIAS_MESSAGE_TYPES,
	apiSendAliasMessage
} from '../../api/apiSendAliasMessage';
import { useWatcher } from '../../hooks/useWatcher';
import { apiGetSessionRooms } from '../../api/apiGetSessionRooms';

interface JoinGroupChatViewProps {
	forceBannedOverlay?: boolean;
	bannedUsers?: string[];
	legalLinks: Array<LegalLinkInterface>;
}

export const JoinGroupChatView = ({
	legalLinks,
	forceBannedOverlay = false,
	bannedUsers = []
}: JoinGroupChatViewProps) => {
	const activeSession = useContext(ActiveSessionContext);
	const { userData } = useContext(UserDataContext);
	const { dispatch } = useContext(SessionsDataContext);
	const [overlayItem, setOverlayItem] = useState<OverlayItem>(null);
	const [overlayActive, setOverlayActive] = useState(false);
	const [redirectToSessionsList, setRedirectToSessionsList] = useState(false);
	const consultingType = useConsultingType(activeSession.item.consultingType);

	const [buttonItem, setButtonItem] = useState(joinButtonItem);

	const [isButtonDisabled, setIsButtonDisabled] = useState(false);

	const [isRequestInProgress, setIsRequestInProgress] = useState(false);
	const [sessionListTab] = useState(
		new URLSearchParams(useLocation().search).get('sessionListTab')
	);
	const getSessionListTab = () =>
		`${sessionListTab ? `?sessionListTab=${sessionListTab}` : ''}`;

	/* E2EE START */
	const [groupKeyID, setGroupKeyID] = useState(null);
	const [sessionGroupKeyExportedString, setSessionGroupKeyExportedString] =
		useState(null);
	const { isE2eeEnabled } = useContext(E2EEContext);
	const { encrypted } = useE2EE(activeSession.rid);

	// create the groupkeys once, if e2ee feature is enabled
	useEffect(() => {
		if (!isE2eeEnabled || encrypted || activeSession?.item?.active) {
			console.log('room already encrypted');
			return;
		}

		createGroupKey().then(
			({
				keyID: groupKeyID,
				key: groupKey,
				sessionKeyExportedString: sessionGroupKeyExportedString
			}) => {
				console.log(
					groupKey,
					groupKeyID,
					sessionGroupKeyExportedString
				);
				setGroupKeyID(groupKeyID);
				setSessionGroupKeyExportedString(sessionGroupKeyExportedString);
			}
		);
	}, [encrypted, activeSession, isE2eeEnabled]);

	const handleEncryptRoom = useCallback(async () => {
		if (!isE2eeEnabled || encrypted || activeSession?.item?.active) {
			console.log('room already encrypted');
			return;
		}

		const rcUserId = getValueFromCookie('rc_uid');

		const userKey = await encryptForParticipant(
			getValueFromCookie('public_key'),
			groupKeyID,
			sessionGroupKeyExportedString
		);

		await apiRocketChatUpdateGroupKey(rcUserId, activeSession.rid, userKey);

		// Set Room Key ID at the very end because if something failed before it will still be repairable
		// After room key is set the room is encrypted and the room key could not be set again.
		try {
			await apiRocketChatSetRoomKeyID(activeSession.rid, groupKeyID);
			await apiSendAliasMessage({
				rcGroupId: activeSession.rid,
				type: ALIAS_MESSAGE_TYPES.E2EE_ACTIVATED
			});
		} catch (e) {
			console.error(e);
			return;
		}

		console.log('Start writing encrypted messages!');
	}, [
		isE2eeEnabled,
		encrypted,
		activeSession?.item?.active,
		activeSession.rid,
		groupKeyID,
		sessionGroupKeyExportedString
	]);
	/* E2EE END */

	const updateGroupChatInfo = useCallback(() => {
		return apiGetGroupChatInfo(activeSession.item.id)
			.then((res) => {
				if (activeSession.item.active !== res.active) {
					apiGetSessionRooms([activeSession.rid]).then(
						({ sessions }) => {
							dispatch({
								type: UPDATE_SESSIONS,
								sessions: sessions
							});
						}
					);
				}
			})
			.catch((error) => {
				if (error.message === FETCH_ERRORS.NO_MATCH) {
					setOverlayItem(joinGroupChatClosedErrorOverlay);
					setOverlayActive(true);
				}
			});
	}, [activeSession, dispatch]);

	const [startWatcher, stopWatcher, isWatcherRunning] = useWatcher(
		updateGroupChatInfo,
		5000
	);

	useEffect(() => {
		if (consultingType.groupChat.isGroupChat) {
			//startWatcher();
		}

		return () => {
			if (isWatcherRunning) {
				stopWatcher();
			}
		};
	}, [
		consultingType.groupChat.isGroupChat,
		isWatcherRunning,
		startWatcher,
		stopWatcher
	]);

	useEffect(() => {
		if (
			hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) &&
			!activeSession.item.active
		) {
			setButtonItem(startButtonItem);
		} else {
			setButtonItem(joinButtonItem);
		}
	}, [activeSession.item.active, userData]);

	useEffect(() => {
		if (hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData)) {
			setIsButtonDisabled(
				!activeSession.item.active ||
					bannedUsers.includes(userData.username)
			);
		}
	}, [activeSession.item.active, bannedUsers, userData]);

	const handleOverlayClose = () => {
		setOverlayActive(false);
	};

	const handleButtonClick = () => {
		if (bannedUsers.includes(userData.userName)) {
			setOverlayItem(bannedUserOverlay);
			setOverlayActive(true);
			return;
		}
		if (isRequestInProgress) {
			return;
		}
		setIsRequestInProgress(true);
		const groupChatApiCall =
			hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) &&
			!activeSession.item.active
				? GROUP_CHAT_API.START
				: GROUP_CHAT_API.JOIN;
		apiPutGroupChat(activeSession.item.id, groupChatApiCall)
			.then(async () => {
				await handleEncryptRoom();
			})
			.catch(() => {
				setOverlayItem(startJoinGroupChatErrorOverlay);
				setOverlayActive(true);
			});
	};

	const handleOverlayAction = (buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.CLOSE) {
			setOverlayActive(false);
			setOverlayItem({});
		} else if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECT) {
			setRedirectToSessionsList(true);
		} else if (buttonFunction === OVERLAY_FUNCTIONS.LOGOUT) {
			logout();
		}
		setIsRequestInProgress(false);
	};

	useEffect(() => {
		if (forceBannedOverlay) {
			setOverlayItem(bannedUserOverlay);
			setOverlayActive(true);
		}
	}, [forceBannedOverlay]);

	if (redirectToSessionsList) {
		mobileListView();
		return (
			<Redirect
				to={getSessionListPathForLocation() + getSessionListTab()}
			/>
		);
	}

	return (
		<div className="session joinChat">
			<SessionHeaderComponent
				legalLinks={legalLinks}
				isJoinGroupChatView={true}
				bannedUsers={bannedUsers}
			/>
			<div className="joinChat__content session__content">
				<Headline
					text={translate('groupChat.join.content.headline')}
					semanticLevel="4"
				/>
				{consultingType.groupChat?.groupChatRules?.map(
					(groupChatRuleText, i) => (
						<Text
							text={groupChatRuleText}
							type="standard"
							key={i}
						/>
					)
				)}
			</div>
			<div className="joinChat__button-container">
				{!hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) &&
					!activeSession.item.active && (
						<p className="joinChat__warning-message">
							<WarningIcon />
							{translate('groupChat.join.warning.message')}
						</p>
					)}
				<Button
					item={buttonItem}
					buttonHandle={handleButtonClick}
					disabled={isButtonDisabled}
				/>
			</div>
			{overlayActive && (
				<OverlayWrapper>
					<Overlay
						item={overlayItem}
						handleOverlay={handleOverlayAction}
						handleOverlayClose={handleOverlayClose}
					/>
				</OverlayWrapper>
			)}
		</div>
	);
};
