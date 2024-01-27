import * as React from 'react';
import {
	MouseEventHandler,
	useCallback,
	useContext,
	useEffect,
	useState
} from 'react';
import { generatePath, Link, Redirect, useHistory } from 'react-router-dom';
import {
	AnonymousConversationFinishedContext,
	AUTHORITIES,
	hasUserAuthority,
	SessionTypeContext,
	useConsultingType,
	UserDataContext,
	ActiveSessionContext
} from '../../globalState';
import {
	SessionItemInterface,
	STATUS_FINISHED
} from '../../globalState/interfaces';
import {
	SESSION_LIST_TAB,
	SESSION_LIST_TAB_ARCHIVE,
	SESSION_LIST_TYPES
} from '../session/sessionHelpers';
import { Overlay, OVERLAY_FUNCTIONS } from '../overlay/Overlay';
import {
	archiveSessionSuccessOverlayItem,
	finishAnonymousChatSecurityOverlayItem,
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
import { ReactComponent as CalendarMonthPlusIcon } from '../../resources/img/icons/calendar-plus.svg';
import { supportsE2EEncryptionVideoCall } from '../../utils/videoCallHelpers';
import DeleteSession from '../session/DeleteSession';
import { Text } from '../text/Text';
import { useSearchParam } from '../../hooks/useSearchParams';
import { useAppConfig } from '../../hooks/useAppConfig';
import { useTranslation } from 'react-i18next';
import { LegalLinksContext } from '../../globalState/provider/LegalLinksProvider';
import { RocketChatUsersOfRoomContext } from '../../globalState/provider/RocketChatUsersOfRoomProvider';

type TReducedSessionItemInterface = Omit<
	SessionItemInterface,
	'attachment' | 'topic' | 'e2eLastMessage' | 'videoCallMessageDTO'
>;

export interface SessionMenuProps {
	hasUserInitiatedStopOrLeaveRequest: React.MutableRefObject<boolean>;
	isAskerInfoAvailable: boolean;
	isJoinGroupChatView?: boolean;
	bannedUsers?: string[];
}

export const SessionMenu = (props: SessionMenuProps) => {
	const { t: translate } = useTranslation();
	const history = useHistory();

	const legalLinks = useContext(LegalLinksContext);
	const settings = useAppConfig();

	const { userData } = useContext(UserDataContext);
	const { type, path: listPath } = useContext(SessionTypeContext);
	const { setAnonymousConversationFinished } = useContext(
		AnonymousConversationFinishedContext
	);

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

	const [appointmentFeatureEnabled, setAppointmentFeatureEnabled] =
		useState(false);

	useEffect(() => {
		document.addEventListener('mousedown', (e) => handleClick(e));
		if (!hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData)) {
			const { appointmentFeatureEnabled } = userData;
			setAppointmentFeatureEnabled(appointmentFeatureEnabled);
		}
		if (!activeSession.item?.active || !activeSession.item?.subscribed) {
			// do not get group members for a chat that has not been started and user is not subscribed
			return;
		}
	}, [handleClick, activeSession, userData]);

	const handleBookingButton = () => {
		history.push('/booking/');
	};

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
				// Short timeout to wait for RC events finished
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
				}, 1000);
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
						setAnonymousConversationFinished('DONE');
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
			window.location.href = settings.urls.finishedAnonymousChatRedirect;
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
		...(activeSession.item as TReducedSessionItemInterface),
		subRoute: 'groupChatInfo'
	});
	const editGroupChatSettingsLink = generatePath(baseUrl, {
		...(activeSession.item as TReducedSessionItemInterface),
		subRoute: 'editGroupChat'
	});
	const userProfileLink = generatePath(baseUrl, {
		...(activeSession.item as TReducedSessionItemInterface),
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
		icon: (
			<CallOnIcon
				title={translate('videoCall.button.startCall')}
				aria-label={translate('videoCall.button.startCall')}
			/>
		)
	};

	const buttonStartVideoCall: ButtonItem = {
		type: BUTTON_TYPES.SMALL_ICON,
		title: translate('videoCall.button.startVideoCall'),
		smallIconBackgroundColor: 'green',
		icon: (
			<CameraOnIcon
				title={translate('videoCall.button.startVideoCall')}
				aria-label={translate('videoCall.button.startVideoCall')}
			/>
		)
	};

	const buttonFeedback: ButtonItem = {
		type: BUTTON_TYPES.SMALL_ICON,
		smallIconBackgroundColor: 'yellow',
		icon: (
			<FeedbackIcon
				title={translate('chatFlyout.feedback')}
				aria-label={translate('videoCall.button.feedback')}
			/>
		),
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
				const url = new URL(response.moderatorVideoCallUrl);
				videoCallWindow.location.href = generatePath(
					settings.urls.videoCall,
					{
						domain: url.host,
						jwt: url.searchParams.get('jwt'),
						e2e: userData.e2eEncryptionEnabled ? 1 : 0,
						video: isVideoActivated ? 1 : 0,
						username: userData.displayName
							? userData.displayName
							: userData.userName
					}
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
							...(activeSession.item as TReducedSessionItemInterface),
							groupId: activeSession.item.feedbackGroupId
						})}
						className="sessionInfo__feedbackButton"
					>
						<Button item={buttonFeedback} isLink={true} />
					</Link>
				)}

			{!activeSession.isEnquiry &&
				appointmentFeatureEnabled &&
				!activeSession.isLive &&
				!activeSession.isGroup && (
					<div
						className="sessionMenu__icon sessionMenu__icon--booking"
						onClick={handleBookingButton}
					>
						<CalendarMonthPlusIcon />
						<Text
							type="standard"
							text={translate('booking.mobile.calendar.label')}
						/>
					</div>
				)}

			<span
				id="iconH"
				onClick={() => setFlyoutOpen(!flyoutOpen)}
				className="sessionMenu__icon sessionMenu__icon--desktop"
			>
				<MenuHorizontalIcon
					title={translate('app.menu')}
					aria-label={translate('app.menu')}
				/>
			</span>
			<span
				id="iconV"
				onClick={() => setFlyoutOpen(!flyoutOpen)}
				className="sessionMenu__icon sessionMenu__icon--mobile"
			>
				<MenuVerticalIcon
					title={translate('app.menu')}
					aria-label={translate('app.menu')}
				/>
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
								...(activeSession.item as TReducedSessionItemInterface),
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

				{activeSession.isGroup && (
					<SessionMenuFlyoutGroup
						editGroupChatSettingsLink={editGroupChatSettingsLink}
						groupChatInfoLink={groupChatInfoLink}
						handleLeaveGroupChat={handleLeaveGroupChat}
						handleStopGroupChat={handleStopGroupChat}
						bannedUsers={props.bannedUsers}
					/>
				)}

				<div className="legalInformationLinks--menu">
					{legalLinks.map((legalLink) => (
						<a
							href={legalLink.getUrl({
								aid: activeSession?.agency?.id
							})}
							key={legalLink.getUrl({
								aid: activeSession?.agency?.id
							})}
							target="_blank"
							rel="noreferrer"
						>
							<Text
								type="infoLargeAlternative"
								text={translate(legalLink.label)}
							/>
						</a>
					))}
				</div>
			</div>
			{overlayActive && (
				<Overlay
					item={overlayItem}
					handleOverlay={handleOverlayAction}
				/>
			)}
		</div>
	);
};

const SessionMenuFlyoutGroup = ({
	groupChatInfoLink,
	editGroupChatSettingsLink,
	handleLeaveGroupChat,
	handleStopGroupChat,
	bannedUsers
}: {
	groupChatInfoLink: string;
	editGroupChatSettingsLink: string;
	handleStopGroupChat: MouseEventHandler;
	handleLeaveGroupChat: MouseEventHandler;
	bannedUsers: string[];
}) => {
	const { t: translate } = useTranslation();
	const { userData } = useContext(UserDataContext);
	const { activeSession } = useContext(ActiveSessionContext);
	const { moderators } = useContext(RocketChatUsersOfRoomContext);

	return (
		<>
			{activeSession.item.subscribed &&
				!bannedUsers?.includes(userData.userName) &&
				moderators.length > 1 && (
					<div
						onClick={handleLeaveGroupChat}
						className="sessionMenu__item sessionMenu__button"
					>
						<span className="sessionMenu__icon">
							<LeaveChatIcon
								title={translate('chatFlyout.leaveGroupChat')}
								aria-label={translate(
									'chatFlyout.leaveGroupChat'
								)}
							/>
							{translate('chatFlyout.leaveGroupChat')}
						</span>
					</div>
				)}
			{hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) && (
				<Link
					to={groupChatInfoLink}
					className="sessionMenu__item sessionMenu__button"
				>
					<span className="sessionMenu__icon">
						<GroupChatInfoIcon />
						{translate('chatFlyout.groupChatInfo')}
					</span>
				</Link>
			)}
			{activeSession.item.subscribed &&
				hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) && (
					<div
						onClick={handleStopGroupChat}
						className="sessionMenu__item sessionMenu__button"
					>
						<span className="sessionMenu__icon">
							<StopGroupChatIcon
								title={translate('chatFlyout.stopGroupChat')}
								aria-label={translate(
									'chatFlyout.stopGroupChat'
								)}
							/>
							{translate('chatFlyout.stopGroupChat')}
						</span>
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
						className="sessionMenu__item sessionMenu__button"
					>
						<span className="sessionMenu__icon">
							<EditGroupChatIcon
								title={translate('chatFlyout.editGroupChat')}
								aria-label={translate(
									'chatFlyout.editGroupChat'
								)}
							/>
							{translate('chatFlyout.editGroupChat')}
						</span>
					</Link>
				)}
		</>
	);
};
