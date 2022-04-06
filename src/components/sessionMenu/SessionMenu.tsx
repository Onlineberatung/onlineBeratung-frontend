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
import {
	generatePath,
	Link,
	Redirect,
	useLocation,
	useParams
} from 'react-router-dom';
import {
	AcceptedGroupIdContext,
	ActiveSessionType,
	AUTHORITIES,
	GroupChatItemInterface,
	hasUserAuthority,
	STATUS_FINISHED,
	UpdateSessionListContext,
	useConsultingType,
	UserDataContext,
	LegalLinkInterface
} from '../../globalState';
import {
	getChatItemForSession,
	getSessionListPathForLocation,
	getTypeOfLocation,
	isGroupChat,
	isLiveChat,
	isSessionChat,
	SESSION_LIST_TAB,
	typeIsEnquiry,
	typeIsTeamSession
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
	stopGroupChatSuccessOverlayItem
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
import { getVideoCallUrl } from '../../utils/videoCallHelpers';
import { removeAllCookies } from '../sessionCookie/accessSessionCookie';
import { history } from '../app/app';
import DeleteSession from '../session/DeleteSession';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';
import { Text } from '../text/Text';

export interface SessionMenuProps {
	hasUserInitiatedStopOrLeaveRequest: React.MutableRefObject<boolean>;
	isAskerInfoAvailable: boolean;
	legalLinks: Array<LegalLinkInterface>;
}

export const SessionMenu = (props: SessionMenuProps) => {
	const { rcGroupId: groupIdFromParam } = useParams();

	const { userData } = useContext(UserDataContext);
	const { setUpdateSessionList } = useContext(UpdateSessionListContext);
	const activeSession = useContext(ActiveSessionContext);
	const chatItem = getChatItemForSession(activeSession);
	const consultingType = useConsultingType(chatItem.consultingType);
	const [overlayItem, setOverlayItem] = useState(null);
	const [overlayActive, setOverlayActive] = useState(false);
	const [redirectToSessionsList, setRedirectToSessionsList] = useState(false);
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);
	const [sessionListTab] = useState(
		new URLSearchParams(useLocation().search).get('sessionListTab')
	);
	const getSessionListTab = () =>
		`${sessionListTab ? `?sessionListTab=${sessionListTab}` : ''}`;
	const { setAcceptedGroupId } = useContext(AcceptedGroupIdContext);

	useEffect(() => {
		document.addEventListener('mousedown', (e) => handleClick(e));
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const handleFlyout = () => {
		const dropdown = document.querySelector('.sessionMenu__content');
		dropdown.classList.toggle('sessionMenu__content--open');
	};

	const handleClick = (e) => {
		const menuIconH = document.getElementById('iconH');
		const menuIconV = document.getElementById('iconV');
		const flyoutMenu = document.getElementById('flyout');

		const dropdown = document.querySelector('.sessionMenu__content');
		if (
			dropdown &&
			dropdown.classList.contains('sessionMenu__content--open')
		) {
			if (
				!menuIconH.contains(e.target) &&
				!menuIconV.contains(e.target)
			) {
				if (flyoutMenu && !flyoutMenu.contains(e.target)) {
					handleFlyout();
				}
			}
		}
	};

	const handleStopGroupChat = () => {
		stopGroupChatSecurityOverlayItem.copy =
			isGroupChat(chatItem) && chatItem?.repetitive
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
		if (typeIsTeamSession(activeSession.type)) {
			archiveSessionSuccessOverlayItem.copy = translate(
				'archive.overlay.teamsession.success.copy'
			);
		}
		setOverlayItem(archiveSessionSuccessOverlayItem);
		setOverlayActive(true);
	};

	const handleDearchiveSession = () => {
		apiPutDearchive(chatItem.id)
			.then(() => {
				mobileListView();
				history.push(getSessionListPathForLocation());
				if (window.innerWidth >= 900) {
					setAcceptedGroupId(groupIdFromParam);
				}
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

			apiPutGroupChat(chatItem?.id, GROUP_CHAT_API.STOP)
				.then((response) => {
					setOverlayItem(stopGroupChatSuccessOverlayItem);
				})
				.catch((error) => {
					setOverlayItem(groupChatErrorOverlayItem);
					props.hasUserInitiatedStopOrLeaveRequest.current = false;
				})
				.finally(() => {
					setIsRequestInProgress(false);
				});
		} else if (buttonFunction === OVERLAY_FUNCTIONS.LEAVE_GROUP_CHAT) {
			// See comment above
			props.hasUserInitiatedStopOrLeaveRequest.current = true;

			apiPutGroupChat(chatItem?.id, GROUP_CHAT_API.LEAVE)
				.then((response) => {
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
			setUpdateSessionList(true);
		} else if (buttonFunction === OVERLAY_FUNCTIONS.LOGOUT) {
			logout();
		} else if (
			buttonFunction === OVERLAY_FUNCTIONS.FINISH_ANONYMOUS_CONVERSATION
		) {
			apiFinishAnonymousConversation(chatItem.id)
				.then((response) => {
					setIsRequestInProgress(false);

					if (
						hasUserAuthority(
							AUTHORITIES.ANONYMOUS_DEFAULT,
							userData
						)
					) {
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
				});
		} else if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECT_TO_URL) {
			window.location.href = config.urls.finishedAnonymousChatRedirect;
		} else if (buttonFunction === OVERLAY_FUNCTIONS.ARCHIVE) {
			apiPutArchive(chatItem.id)
				.then(() => {
					mobileListView();
					history.push(getSessionListPathForLocation());
					setUpdateSessionList(getTypeOfLocation());
				})
				.catch((error) => {
					console.error(error);
				})
				.finally(() => {
					setOverlayActive(false);
					setOverlayItem(null);
					setIsRequestInProgress(false);
				});
		}
	};

	const onSuccessDeleteSession = useCallback(() => {
		setRedirectToSessionsList(true);
		setUpdateSessionList(getTypeOfLocation());
	}, [setUpdateSessionList]);

	//TODO:
	//enquiries: only RS profil
	//sessions/peer/team: feedback (if u25), rs, docu
	//imprint/dataschutz all users all devices

	//dynamicly menut items in flyout:
	//rotate icon to vertical only if EVERY item in flyout
	//list item icons only shown on outside

	const baseUrl = `${getSessionListPathForLocation()}/:groupId/:id/:subRoute?/:extraPath?${getSessionListTab()}`;

	const groupChatInfoLink = generatePath(baseUrl, {
		...chatItem,
		subRoute: 'groupChatInfo'
	});
	const editGroupChatSettingsLink = generatePath(baseUrl, {
		...chatItem,
		subRoute: 'editGroupChat'
	});
	const monitoringPath = generatePath(baseUrl, {
		...chatItem,
		subRoute: 'userProfile',
		extraPath: 'monitoring'
	});
	const userProfileLink = generatePath(baseUrl, {
		...chatItem,
		subRoute: 'userProfile'
	});

	if (redirectToSessionsList) {
		mobileListView();
		return (
			<Redirect
				to={getSessionListPathForLocation() + getSessionListTab()}
			/>
		);
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
		isSessionChat(chatItem) &&
		!isLiveChat(chatItem) &&
		!typeIsEnquiry(getTypeOfLocation()) &&
		consultingType.isVideoCallAllowed;

	const handleStartVideoCall = (isVideoActivated: boolean = false) => {
		const videoCallWindow = window.open('', '_blank');
		apiStartVideoCall(chatItem?.id)
			.then((response) => {
				videoCallWindow.location.href = getVideoCallUrl(
					response.moderatorVideoCallUrl,
					isVideoActivated
				);
				videoCallWindow.focus();
			})
			.catch((error) => {
				console.log(error);
			});
	};

	return (
		<div className="sessionMenu__wrapper">
			{isLiveChat(chatItem) &&
				chatItem.status !== STATUS_FINISHED &&
				!typeIsEnquiry(getTypeOfLocation()) && (
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
				!typeIsEnquiry(getTypeOfLocation()) &&
				isSessionChat(chatItem) &&
				chatItem?.feedbackGroupId && (
					<Link
						to={generatePath(baseUrl, {
							...chatItem,
							groupId: chatItem.feedbackGroupId
						})}
						className="sessionInfo__feedbackButton"
					>
						<Button item={buttonFeedback} isLink={true} />
					</Link>
				)}

			{isGroupChat(chatItem) && (
				<SessionMenuGroup
					chatItem={chatItem}
					activeSession={activeSession}
					editGroupChatSettingsLink={editGroupChatSettingsLink}
					groupChatInfoLink={groupChatInfoLink}
					handleLeaveGroupChat={handleLeaveGroupChat}
					handleStopGroupChat={handleStopGroupChat}
				/>
			)}

			<span
				id="iconH"
				onClick={handleFlyout}
				className="sessionMenu__icon sessionMenu__icon--desktop"
			>
				<MenuHorizontalIcon />
			</span>
			<span
				id="iconV"
				onClick={handleFlyout}
				className="sessionMenu__icon sessionMenu__icon--mobile"
			>
				<MenuVerticalIcon />
			</span>

			<div id="flyout" className="sessionMenu__content">
				{isLiveChat(chatItem) &&
					chatItem.status !== STATUS_FINISHED &&
					!typeIsEnquiry(getTypeOfLocation()) && (
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
					isSessionChat(chatItem) &&
					chatItem?.feedbackGroupId && (
						<Link
							className="sessionMenu__item sessionMenu__item--mobile"
							to={generatePath(baseUrl, {
								...chatItem,
								groupId: chatItem.feedbackGroupId
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
					!typeIsEnquiry(getTypeOfLocation()) &&
					isSessionChat(chatItem) &&
					!isLiveChat(chatItem) && (
						<>
							{sessionListTab !== SESSION_LIST_TAB.ARCHIVE ? (
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
					!typeIsEnquiry(getTypeOfLocation()) &&
					isSessionChat(chatItem) &&
					!isLiveChat(chatItem) && (
						<DeleteSession
							chatId={chatItem.id}
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
					!typeIsEnquiry(getTypeOfLocation()) &&
					isSessionChat(chatItem) &&
					!isLiveChat(chatItem) &&
					chatItem?.monitoring && (
						<Link className="sessionMenu__item" to={monitoringPath}>
							{translate('chatFlyout.documentation')}
						</Link>
					)}

				{isGroupChat(chatItem) && (
					<SessionMenuFlyoutGroup
						chatItem={chatItem}
						activeSession={activeSession}
						editGroupChatSettingsLink={editGroupChatSettingsLink}
						groupChatInfoLink={groupChatInfoLink}
						handleLeaveGroupChat={handleLeaveGroupChat}
						handleStopGroupChat={handleStopGroupChat}
					/>
				)}

				<div className="legalInformationLinks--menu">
					{props.legalLinks.map((legalLink) => (
						<a href={legalLink.url} key={legalLink.url}>
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
	chatItem,
	activeSession,
	groupChatInfoLink,
	editGroupChatSettingsLink,
	handleStopGroupChat,
	handleLeaveGroupChat
}: {
	chatItem: GroupChatItemInterface;
	activeSession: ActiveSessionType;
	groupChatInfoLink: string;
	editGroupChatSettingsLink: string;
	handleStopGroupChat: MouseEventHandler;
	handleLeaveGroupChat: MouseEventHandler;
}) => {
	const { userData } = useContext(UserDataContext);

	return (
		<>
			{chatItem?.subscribed && (
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
			{chatItem?.subscribed &&
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

			{isGroupChatOwner(activeSession, userData) && !chatItem.active && (
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
	chatItem,
	activeSession,
	groupChatInfoLink,
	editGroupChatSettingsLink,
	handleLeaveGroupChat,
	handleStopGroupChat
}: {
	chatItem: GroupChatItemInterface;
	activeSession: ActiveSessionType;
	groupChatInfoLink: string;
	editGroupChatSettingsLink: string;
	handleStopGroupChat: MouseEventHandler;
	handleLeaveGroupChat: MouseEventHandler;
}) => {
	const { userData } = useContext(UserDataContext);

	return (
		<>
			{chatItem?.subscribed && (
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
			{chatItem?.subscribed &&
				hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) && (
					<div
						onClick={handleStopGroupChat}
						className="sessionMenu__item sessionMenu__item--mobile"
					>
						{translate('chatFlyout.stopGroupChat')}
					</div>
				)}
			{isGroupChatOwner(activeSession, userData) && !chatItem.active && (
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
