import * as React from 'react';
import {
	MouseEventHandler,
	useCallback,
	useContext,
	useEffect,
	useState
} from 'react';
import { translate } from '../../utils/translate';
import { config } from '../../resources/scripts/config';
import { generatePath, Link, Redirect, useParams } from 'react-router-dom';
import {
	AUTHORITIES,
	ExtendedSessionInterface,
	hasUserAuthority,
	LegalLinkInterface,
	RocketChatContext,
	SessionTypeContext,
	STATUS_FINISHED,
	useConsultingType,
	UserDataContext
} from '../../globalState';
import {
	SESSION_LIST_TAB,
	SESSION_LIST_TAB_ARCHIVE,
	SESSION_LIST_TYPES
} from '../session/sessionHelpers';
import { Overlay, OVERLAY_FUNCTIONS, OverlayWrapper } from '../overlay/Overlay';
import {
	archiveSessionSuccessOverlayItem,
	finishAnonymousChatSecurityOverlayItem,
	finishAnonymousChatSuccessOverlayItem,
	groupChatErrorOverlayItem,
	leaveGroupChatSecurityOverlayItem,
	leaveGroupChatSuccessOverlayItem,
	stopGroupChatSecurityOverlayItem,
	stopGroupChatSuccessOverlayItem,
	videoCallErrorOverlayItem
} from './sessionMenuHelpers';
import {
	apiFinishAnonymousConversation,
	apiPutArchive,
	apiPutDearchive,
	apiPutGroupChat,
	apiStartVideoCall,
	GROUP_CHAT_API
} from '../../api';
import { logout } from '../logout/logout';
import { mobileListView } from '../app/navigationHandler';
import { isGroupChatOwner } from '../groupChat/groupChatHelpers';
import { ReactComponent as FeedbackIcon } from '../../resources/img/icons/pen-paper.svg';
import { ReactComponent as LeaveChatIcon } from '../../resources/img/icons/out.svg';
import { ReactComponent as GroupChatInfoIcon } from '../../resources/img/icons/i.svg';
import { ReactComponent as StopGroupChatIcon } from '../../resources/img/icons/x.svg';
import { ReactComponent as EditGroupChatIcon } from '../../resources/img/icons/gear.svg';
import { ReactComponent as MenuHorizontalIcon } from '../../resources/img/icons/stack-horizontal.svg';
import { ReactComponent as MenuVerticalIcon } from '../../resources/img/icons/stack-vertical.svg';
import '../sessionHeader/sessionHeader.styles';
import './sessionMenu.styles';
import { Button, BUTTON_TYPES, ButtonItem } from '../button/Button';
import { ReactComponent as CallOnIcon } from '../../resources/img/icons/call-on.svg';
import { ReactComponent as CameraOnIcon } from '../../resources/img/icons/camera-on.svg';
import {
	getVideoCallUrl,
	supportsE2EEncryptionVideoCall
} from '../../utils/videoCallHelpers';
import { removeAllCookies } from '../sessionCookie/accessSessionCookie';
import { history } from '../app/app';
import DeleteSession from '../session/DeleteSession';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';
import { Text } from '../text/Text';
import { apiRocketChatGroupMembers } from '../../api/apiRocketChatGroupMembers';
import { useSearchParam } from '../../hooks/useSearchParams';

export interface SessionMenuProps {
	hasUserInitiatedStopOrLeaveRequest: React.MutableRefObject<boolean>;
	isAskerInfoAvailable: boolean;
	legalLinks: Array<LegalLinkInterface>;
	isJoinGroupChatView?: boolean;
}

export const SessionMenu = (props: SessionMenuProps) => {
	const { rcGroupId: groupIdFromParam } = useParams();

	const { userData } = useContext(UserDataContext);
	const { type, path: listPath } = useContext(SessionTypeContext);
	const { close: closeWebsocket } = useContext(RocketChatContext);

	const { activeSession, reloadActiveSession } =
		useContext(ActiveSessionContext);
	const consultingType = useConsultingType(activeSession.item.consultingType);

	const [overlayItem, setOverlayItem] = useState(null);
	const [flyoutOpen, setFlyoutOpen] = useState(null);
	const [overlayActive, setOverlayActive] = useState(false);
	const [redirectToSessionsList, setRedirectToSessionsList] = useState(false);
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);

	const sessionListTab = useSearchParam<SESSION_LIST_TAB>('sessionListTab');
	const getSessionListTab = () =>
		`${sessionListTab ? `?sessionListTab=${sessionListTab}` : ''}`;

	const handleClick = useCallback(
		(e) => {
			const menuIconH = document.getElementById('iconH');
			const menuIconV = document.getElementById('iconV');
			const flyoutMenu = document.getElementById('flyout');

			const dropdown = document.querySelector('.sessionMenu__content');
			if (dropdown && flyoutOpen) {
				if (
					!menuIconH.contains(e.target) &&
					!menuIconV.contains(e.target)
				) {
					if (flyoutMenu && !flyoutMenu.contains(e.target)) {
						setFlyoutOpen(!flyoutOpen);
					}
				}
			}
		},
		[flyoutOpen]
	);

	useEffect(() => {
		document.addEventListener('mousedown', (e) => handleClick(e));

		if (!activeSession.item?.active || !activeSession.item?.subscribed) {
			// do not get group members for a chat that has not been started and user is not subscribed
			return;
		}
		// also make sure that the active session matches the url param
		if (groupIdFromParam === activeSession?.item?.groupId) {
			apiRocketChatGroupMembers(groupIdFromParam).then(({ members }) => {
				members.forEach((member) => {
					//console.log(member._id, decodeUsername(member.username));
				});
			});
		}
	}, [groupIdFromParam, handleClick, activeSession]);

	const handleStopGroupChat = () => {
		stopGroupChatSecurityOverlayItem.copy =
			activeSession.isGroup && activeSession.item.repetitive
				? translate('groupChat.stopChat.securityOverlay.copyRepeat')
				: translate('groupChat.stopChat.securityOverlay.copySingle');
		setOverlayItem(stopGroupChatSecurityOverlayItem);
		setOverlayActive(true);
	};

	const handleLeaveGroupChat = () => {
		setOverlayItem(leaveGroupChatSecurityOverlayItem);
		setOverlayActive(true);
	};

	const handleFinishAnonymousChat = () => {
		if (hasUserAuthority(AUTHORITIES.ANONYMOUS_DEFAULT, userData)) {
			finishAnonymousChatSecurityOverlayItem.copy = translate(
				'anonymous.overlay.finishChat.asker.copy'
			);
		}
		setOverlayItem(finishAnonymousChatSecurityOverlayItem);
		setOverlayActive(true);
	};

	const handleArchiveSession = () => {
		// location type
		if (type === SESSION_LIST_TYPES.TEAMSESSION) {
			archiveSessionSuccessOverlayItem.copy = translate(
				'archive.overlay.teamsession.success.copy'
			);
		}
		setOverlayItem(archiveSessionSuccessOverlayItem);
		setOverlayActive(true);
	};

	const handleDearchiveSession = () => {
		apiPutDearchive(activeSession.item.id)
			.then(() => {
				reloadActiveSession();
				setTimeout(() => {
					if (window.innerWidth >= 900) {
						history.push(
							`${listPath}/${activeSession.item.groupId}/${activeSession.item.id}}`
						);
					} else {
						mobileListView();
						history.push(listPath);
					}
					setFlyoutOpen(false);
				}, 500);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const handleOverlayAction = (buttonFunction: string) => {
		if (isRequestInProgress) {
			return null;
		}
		setIsRequestInProgress(true);
		if (buttonFunction === OVERLAY_FUNCTIONS.CLOSE) {
			setOverlayActive(false);
			setOverlayItem(null);
			setIsRequestInProgress(false);
		} else if (buttonFunction === OVERLAY_FUNCTIONS.STOP_GROUP_CHAT) {
			// In order to prevent a possible race condition between the user
			// service and Rocket.Chat in case of a successful request, this ref
			// is reset to `false` in the event handler that handles NOTIFY_USER
			// events.
			props.hasUserInitiatedStopOrLeaveRequest.current = true;

			apiPutGroupChat(activeSession.item.id, GROUP_CHAT_API.STOP)
				.then(() => {
					setOverlayItem(stopGroupChatSuccessOverlayItem);
				})
				.catch(() => {
					setOverlayItem(groupChatErrorOverlayItem);
					props.hasUserInitiatedStopOrLeaveRequest.current = false;
				})
				.finally(() => {
					setIsRequestInProgress(false);
				});
		} else if (buttonFunction === OVERLAY_FUNCTIONS.LEAVE_GROUP_CHAT) {
			// See comment above
			props.hasUserInitiatedStopOrLeaveRequest.current = true;

			apiPutGroupChat(activeSession.item.id, GROUP_CHAT_API.LEAVE)
				.then(() => {
					setOverlayItem(leaveGroupChatSuccessOverlayItem);
				})
				.catch((error) => {
					setOverlayItem(groupChatErrorOverlayItem);
					props.hasUserInitiatedStopOrLeaveRequest.current = false;
				})
				.finally(() => {
					setIsRequestInProgress(false);
				});
		} else if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECT) {
			setRedirectToSessionsList(true);
		} else if (buttonFunction === OVERLAY_FUNCTIONS.LOGOUT) {
			logout();
		} else if (
			buttonFunction === OVERLAY_FUNCTIONS.FINISH_ANONYMOUS_CONVERSATION
		) {
			apiFinishAnonymousConversation(activeSession.item.id)
				.then(() => {
					setIsRequestInProgress(false);

					if (
						hasUserAuthority(
							AUTHORITIES.ANONYMOUS_DEFAULT,
							userData
						)
					) {
						closeWebsocket();
						removeAllCookies();
						setOverlayItem(finishAnonymousChatSuccessOverlayItem);
					} else {
						setOverlayActive(false);
						setOverlayItem(null);
					}
				})
				.catch((error) => {
					console.error(error);
					setIsRequestInProgress(false);
					setOverlayActive(false);
					setOverlayItem(null);
				});
		} else if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECT_TO_URL) {
			window.location.href = config.urls.finishedAnonymousChatRedirect;
		} else if (buttonFunction === OVERLAY_FUNCTIONS.ARCHIVE) {
			apiPutArchive(activeSession.item.id)
				.then(() => {
					mobileListView();
					history.push(listPath);
				})
				.catch((error) => {
					console.error(error);
				})
				.finally(() => {
					setOverlayActive(false);
					setOverlayItem(null);
					setIsRequestInProgress(false);
					setFlyoutOpen(false);
				});
		} else if (buttonFunction === 'GOTO_MANUAL') {
			history.push('/profile/hilfe/videoCall');
		}
	};

	const onSuccessDeleteSession = useCallback(() => {
		setRedirectToSessionsList(true);
	}, []);

	//TODO:
	//enquiries: only RS profil
	//sessions/peer/team: feedback (if u25), rs, docu
	//imprint/dataschutz all users all devices

	//dynamicly menut items in flyout:
	//rotate icon to vertical only if EVERY item in flyout
	//list item icons only shown on outside

	const baseUrl = `${listPath}/:groupId/:id/:subRoute?/:extraPath?${getSessionListTab()}`;

	const groupChatInfoLink = generatePath(baseUrl, {
		...activeSession.item,
		subRoute: 'groupChatInfo'
	});
	const editGroupChatSettingsLink = generatePath(baseUrl, {
		...activeSession.item,
		subRoute: 'editGroupChat'
	});
	const monitoringPath = generatePath(baseUrl, {
		...activeSession.item,
		subRoute: 'userProfile',
		extraPath: 'monitoring'
	});
	const userProfileLink = generatePath(baseUrl, {
		...activeSession.item,
		subRoute: 'userProfile'
	});

	if (redirectToSessionsList) {
		mobileListView();
		return <Redirect to={listPath + getSessionListTab()} />;
	}

	const buttonStartCall: ButtonItem = {
		type: BUTTON_TYPES.SMALL_ICON,
		title: translate('videoCall.button.startCall'),
		smallIconBackgroundColor: 'green',
		icon: <CallOnIcon />
	};

	const buttonStartVideoCall: ButtonItem = {
		type: BUTTON_TYPES.SMALL_ICON,
		title: translate('videoCall.button.startVideoCall'),
		smallIconBackgroundColor: 'green',
		icon: <CameraOnIcon />
	};

	const buttonFeedback: ButtonItem = {
		type: BUTTON_TYPES.SMALL_ICON,
		smallIconBackgroundColor: 'yellow',
		icon: <FeedbackIcon />,
		label: translate('chatFlyout.feedback')
	};

	const hasVideoCallFeatures = () =>
		hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) &&
		activeSession.isSession &&
		!activeSession.isLive &&
		type !== SESSION_LIST_TYPES.ENQUIRY &&
		consultingType.isVideoCallAllowed;

	const handleStartVideoCall = (isVideoActivated: boolean = false) => {
		if (!supportsE2EEncryptionVideoCall(userData.e2eEncryptionEnabled)) {
			setOverlayItem(videoCallErrorOverlayItem);
			setOverlayActive(true);
			return;
		}

		const videoCallWindow = window.open('', '_blank');
		apiStartVideoCall(
			activeSession.item.id,
			userData.displayName ? userData.displayName : userData.userName
		)
			.then((response) => {
				videoCallWindow.location.href = getVideoCallUrl(
					response.moderatorVideoCallUrl,
					isVideoActivated,
					userData.displayName
						? userData.displayName
						: userData.userName,
					userData.e2eEncryptionEnabled ?? false
				);
				videoCallWindow.focus();
			})
			.catch((error) => {
				console.log(error);
			});
	};

	return (
		<div className="sessionMenu__wrapper">
			{activeSession.isLive &&
				activeSession.item.status !== STATUS_FINISHED &&
				type !== SESSION_LIST_TYPES.ENQUIRY && (
					<span
						onClick={handleFinishAnonymousChat}
						className="sessionMenu__item--desktop sessionMenu__button"
					>
						<span className="sessionMenu__icon">
							<LeaveChatIcon />
							{translate('anonymous.session.finishChat')}
						</span>
					</span>
				)}

			{hasVideoCallFeatures() && (
				<div
					className="sessionMenu__videoCallButtons"
					data-cy="session-header-video-call-buttons"
				>
					<Button
						buttonHandle={() => handleStartVideoCall(true)}
						item={buttonStartVideoCall}
					/>
					<Button
						buttonHandle={() => handleStartVideoCall()}
						item={buttonStartCall}
					/>
				</div>
			)}

			{!hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) &&
				type !== SESSION_LIST_TYPES.ENQUIRY &&
				activeSession.item.feedbackGroupId && (
					<Link
						to={generatePath(baseUrl, {
							...activeSession.item,
							groupId: activeSession.item.feedbackGroupId
						})}
						className="sessionInfo__feedbackButton"
					>
						<Button item={buttonFeedback} isLink={true} />
					</Link>
				)}

			{activeSession.isGroup && (
				<SessionMenuGroup
					activeSession={activeSession}
					editGroupChatSettingsLink={editGroupChatSettingsLink}
					groupChatInfoLink={groupChatInfoLink}
					handleLeaveGroupChat={handleLeaveGroupChat}
					handleStopGroupChat={handleStopGroupChat}
					isJoinGroupChatView={props.isJoinGroupChatView}
				/>
			)}

			<span
				id="iconH"
				onClick={() => setFlyoutOpen(!flyoutOpen)}
				className="sessionMenu__icon sessionMenu__icon--desktop"
			>
				<MenuHorizontalIcon />
			</span>
			<span
				id="iconV"
				onClick={() => setFlyoutOpen(!flyoutOpen)}
				className="sessionMenu__icon sessionMenu__icon--mobile"
			>
				<MenuVerticalIcon />
			</span>

			<div
				id="flyout"
				className={`sessionMenu__content ${
					flyoutOpen && 'sessionMenu__content--open'
				}`}
			>
				{activeSession.isLive &&
					activeSession.item.status !== STATUS_FINISHED &&
					type !== SESSION_LIST_TYPES.ENQUIRY && (
						<div
							className="sessionMenu__item sessionMenu__item--mobile"
							onClick={handleFinishAnonymousChat}
						>
							{translate('anonymous.session.finishChat')}
						</div>
					)}
				{hasVideoCallFeatures() && (
					<>
						<div
							className="sessionMenu__item sessionMenu__item--mobile"
							onClick={() => handleStartVideoCall(true)}
						>
							{translate('videoCall.button.startVideoCall')}
						</div>
						<div
							className="sessionMenu__item sessionMenu__item--mobile"
							onClick={() => handleStartVideoCall()}
						>
							{translate('videoCall.button.startCall')}
						</div>
					</>
				)}

				{!hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) &&
					activeSession.item.feedbackGroupId && (
						<Link
							className="sessionMenu__item sessionMenu__item--mobile"
							to={generatePath(baseUrl, {
								...activeSession.item,
								groupId: activeSession.item.feedbackGroupId
							})}
						>
							{translate('chatFlyout.feedback')}
						</Link>
					)}

				{props.isAskerInfoAvailable && (
					<Link className="sessionMenu__item" to={userProfileLink}>
						{translate('chatFlyout.askerProfil')}
					</Link>
				)}

				{!hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) &&
					type !== SESSION_LIST_TYPES.ENQUIRY &&
					activeSession.isSession &&
					!activeSession.isLive && (
						<>
							{sessionListTab !== SESSION_LIST_TAB_ARCHIVE ? (
								<div
									onClick={handleArchiveSession}
									className="sessionMenu__item"
								>
									{translate('chatFlyout.archive')}
								</div>
							) : (
								<div
									onClick={handleDearchiveSession}
									className="sessionMenu__item"
								>
									{translate('chatFlyout.dearchive')}
								</div>
							)}
						</>
					)}

				{hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) &&
					type !== SESSION_LIST_TYPES.ENQUIRY &&
					activeSession.isSession &&
					!activeSession.isLive && (
						<DeleteSession
							chatId={activeSession.item.id}
							onSuccess={onSuccessDeleteSession}
						>
							{(onClick) => (
								<div
									onClick={onClick}
									className="sessionMenu__item"
								>
									{translate('chatFlyout.remove')}
								</div>
							)}
						</DeleteSession>
					)}

				{!hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) &&
					type !== SESSION_LIST_TYPES.ENQUIRY &&
					activeSession.isSession &&
					!activeSession.isLive &&
					activeSession.item.monitoring && (
						<Link className="sessionMenu__item" to={monitoringPath}>
							{translate('chatFlyout.documentation')}
						</Link>
					)}

				{activeSession.isGroup && (
					<SessionMenuFlyoutGroup
						activeSession={activeSession}
						editGroupChatSettingsLink={editGroupChatSettingsLink}
						groupChatInfoLink={groupChatInfoLink}
						handleLeaveGroupChat={handleLeaveGroupChat}
						handleStopGroupChat={handleStopGroupChat}
					/>
				)}

				<div className="legalInformationLinks--menu">
					{props.legalLinks.map((legalLink) => (
						<a
							href={legalLink.url}
							key={legalLink.url}
							target="_blank"
							rel="noreferrer"
						>
							<Text
								type="infoLargeAlternative"
								text={legalLink.label}
							/>
						</a>
					))}
				</div>
			</div>
			{overlayActive && (
				<OverlayWrapper>
					<Overlay
						item={overlayItem}
						handleOverlay={handleOverlayAction}
					/>
				</OverlayWrapper>
			)}
		</div>
	);
};

const SessionMenuGroup = ({
	activeSession,
	groupChatInfoLink,
	editGroupChatSettingsLink,
	handleStopGroupChat,
	handleLeaveGroupChat,
	isJoinGroupChatView = false
}: {
	activeSession: ExtendedSessionInterface;
	groupChatInfoLink: string;
	editGroupChatSettingsLink: string;
	handleStopGroupChat: MouseEventHandler;
	handleLeaveGroupChat: MouseEventHandler;
	isJoinGroupChatView?: boolean;
}) => {
	const { userData } = useContext(UserDataContext);

	return (
		<>
			{activeSession.item.subscribed && !isJoinGroupChatView && (
				<span
					onClick={handleLeaveGroupChat}
					className="sessionMenu__item--desktop sessionMenu__button"
				>
					<span className="sessionMenu__icon">
						<LeaveChatIcon />
						{translate('chatFlyout.leaveGroupChat')}
					</span>
				</span>
			)}

			{hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) && (
				<Link
					to={groupChatInfoLink}
					className="sessionMenu__item--desktop sessionMenu__button"
				>
					<span className="sessionMenu__icon">
						<GroupChatInfoIcon />
						{translate('chatFlyout.groupChatInfo')}
					</span>
				</Link>
			)}
			{activeSession.item.subscribed &&
				hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) && (
					<span
						onClick={handleStopGroupChat}
						className="sessionMenu__item--desktop sessionMenu__button"
					>
						<span className="sessionMenu__icon">
							<StopGroupChatIcon />
							{translate('chatFlyout.stopGroupChat')}
						</span>
					</span>
				)}

			{isGroupChatOwner(activeSession, userData) &&
				!activeSession.item.active && (
					<Link
						to={{
							pathname: editGroupChatSettingsLink,
							state: { isEditMode: true, prevIsInfoPage: false }
						}}
						className="sessionMenu__item--desktop sessionMenu__button"
					>
						<span className="sessionMenu__icon">
							<EditGroupChatIcon />
							{translate('chatFlyout.editGroupChat')}
						</span>
					</Link>
				)}
		</>
	);
};

const SessionMenuFlyoutGroup = ({
	activeSession,
	groupChatInfoLink,
	editGroupChatSettingsLink,
	handleLeaveGroupChat,
	handleStopGroupChat
}: {
	activeSession: ExtendedSessionInterface;
	groupChatInfoLink: string;
	editGroupChatSettingsLink: string;
	handleStopGroupChat: MouseEventHandler;
	handleLeaveGroupChat: MouseEventHandler;
}) => {
	const { userData } = useContext(UserDataContext);

	return (
		<>
			{activeSession.item.subscribed && (
				<div
					onClick={handleLeaveGroupChat}
					className="sessionMenu__item sessionMenu__item--mobile"
				>
					{translate('chatFlyout.leaveGroupChat')}
				</div>
			)}
			{hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) && (
				<Link
					to={groupChatInfoLink}
					className="sessionMenu__item sessionMenu__item--mobile"
				>
					{translate('chatFlyout.groupChatInfo')}
				</Link>
			)}
			{activeSession.item.subscribed &&
				hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) && (
					<div
						onClick={handleStopGroupChat}
						className="sessionMenu__item sessionMenu__item--mobile"
					>
						{translate('chatFlyout.stopGroupChat')}
					</div>
				)}
			{isGroupChatOwner(activeSession, userData) &&
				!activeSession.item.active && (
					<Link
						to={{
							pathname: editGroupChatSettingsLink,
							state: {
								isEditMode: true,
								prevIsInfoPage: false
							}
						}}
						className="sessionMenu__item sessionMenu__item--mobile"
					>
						{translate('chatFlyout.editGroupChat')}
					</Link>
				)}
		</>
	);
};
