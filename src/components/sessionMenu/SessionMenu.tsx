import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { translate } from '../../utils/translate';
import { config } from '../../resources/scripts/config';
import { Link, Redirect } from 'react-router-dom';
import {
	ActiveSessionGroupIdContext,
	getActiveSession,
	SessionsDataContext,
	UserDataContext,
	StoppedGroupChatContext,
	hasUserAuthority,
	isAnonymousSession,
	AUTHORITIES,
	useConsultingType
} from '../../globalState';
import {
	typeIsEnquiry,
	getChatItemForSession,
	isGroupChatForSessionItem,
	getSessionListPathForLocation,
	getTypeOfLocation
} from '../session/sessionHelpers';
import { OverlayWrapper, Overlay, OVERLAY_FUNCTIONS } from '../overlay/Overlay';
import {
	stopGroupChatSecurityOverlayItem,
	stopGroupChatSuccessOverlayItem,
	leaveGroupChatSecurityOverlayItem,
	groupChatErrorOverlayItem,
	leaveGroupChatSuccessOverlayItem
} from './sessionMenuHelpers';
import { apiPutGroupChat, apiStartVideoCall, GROUP_CHAT_API } from '../../api';
import { logout } from '../logout/logout';
import { mobileListView } from '../app/navigationHandler';
import { isGroupChatOwner } from '../groupChat/groupChatHelpers';
import { ReactComponent as FeedbackIcon } from '../../resources/img/icons/pen-paper.svg';
import { ReactComponent as LeaveGroupChatIcon } from '../../resources/img/icons/out.svg';
import { ReactComponent as GroupChatInfoIcon } from '../../resources/img/icons/i.svg';
import { ReactComponent as StopGroupChatIcon } from '../../resources/img/icons/x.svg';
import { ReactComponent as EditGroupChatIcon } from '../../resources/img/icons/gear.svg';
import { ReactComponent as MenuHorizontalIcon } from '../../resources/img/icons/stack-horizontal.svg';
import { ReactComponent as MenuVerticalIcon } from '../../resources/img/icons/stack-vertical.svg';
import '../sessionHeader/sessionHeader.styles';
import './sessionMenu.styles';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import { ReactComponent as CallOnIcon } from '../../resources/img/icons/call-on.svg';
import { ReactComponent as CameraOnIcon } from '../../resources/img/icons/camera-on.svg';
import { getVideoCallUrl } from '../../utils/videoCallHelpers';

export const SessionMenu = () => {
	const { userData } = useContext(UserDataContext);
	const { sessionsData } = useContext(SessionsDataContext);
	const { activeSessionGroupId, setActiveSessionGroupId } = useContext(
		ActiveSessionGroupIdContext
	);
	const { setStoppedGroupChat } = useContext(StoppedGroupChatContext);
	const activeSession = getActiveSession(activeSessionGroupId, sessionsData);
	const chatItem = getChatItemForSession(activeSession);
	const consultingType = useConsultingType(chatItem.consultingType);
	const isGroupChat = isGroupChatForSessionItem(activeSession);
	const isLiveChat = isAnonymousSession(activeSession?.session);
	const [overlayItem, setOverlayItem] = useState(null);
	const [overlayActive, setOverlayActive] = useState(false);
	const [redirectToSessionsList, setRedirectToSessionsList] = useState(false);
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);

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
		stopGroupChatSecurityOverlayItem.copy = chatItem.repetitive
			? translate('groupChat.stopChat.securityOverlay.copyRepeat')
			: translate('groupChat.stopChat.securityOverlay.copySingle');
		setOverlayItem(stopGroupChatSecurityOverlayItem);
		setOverlayActive(true);
	};

	const handleLeaveGroupChat = () => {
		setOverlayItem(leaveGroupChatSecurityOverlayItem);
		setOverlayActive(true);
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
			apiPutGroupChat(chatItem.id, GROUP_CHAT_API.STOP)
				.then((response) => {
					setOverlayItem(stopGroupChatSuccessOverlayItem);
					setIsRequestInProgress(false);
				})
				.catch((error) => {
					setOverlayItem(groupChatErrorOverlayItem);
					setIsRequestInProgress(false);
				});
		} else if (buttonFunction === OVERLAY_FUNCTIONS.LEAVE_GROUP_CHAT) {
			apiPutGroupChat(chatItem.id, GROUP_CHAT_API.LEAVE)
				.then((response) => {
					setOverlayItem(leaveGroupChatSuccessOverlayItem);
					setIsRequestInProgress(false);
				})
				.catch((error) => {
					setOverlayItem(groupChatErrorOverlayItem);
					setIsRequestInProgress(false);
				});
		} else if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECT) {
			setRedirectToSessionsList(true);
			setStoppedGroupChat(true);
		} else if (buttonFunction === OVERLAY_FUNCTIONS.LOGOUT) {
			logout();
		}
	};

	//TODO:
	//enquiries: only RS profil
	//sessions/peer/team: feedback (if u25), rs, docu
	//imprint/dataschutz all users all devices

	//dynamicly menut items in flyout:
	//rotate icon to vertical only if EVERY item in flyout
	//list item icons only shown on outside

	const feedbackPath = `${getSessionListPathForLocation()}/${
		chatItem.feedbackGroupId
	}/${chatItem.id}`;
	const monitoringPath = `${getSessionListPathForLocation()}/${
		chatItem.groupId
	}/${chatItem.id}/userProfile/monitoring`;
	const userProfileLink = `${getSessionListPathForLocation()}/${
		chatItem.groupId
	}/${chatItem.id}/userProfile`;
	const groupChatInfoLink = `${getSessionListPathForLocation()}/${
		chatItem.groupId
	}/${chatItem.id}/groupChatInfo`;
	const editGroupChatSettingsLink = `${getSessionListPathForLocation()}/${
		chatItem.groupId
	}/${chatItem.id}/editGroupChat`;

	if (redirectToSessionsList) {
		mobileListView();
		setActiveSessionGroupId(null);
		return <Redirect to={getSessionListPathForLocation()} />;
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

	const hasVideoCallFeatures = () => false;
	// TODO: reimplement on videocall release
	// !isGroupChat &&
	// !typeIsEnquiry(getTypeOfLocation()) &&
	// hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData);

	const handleStartVideoCall = (isVideoActivated: boolean = false) => {
		const videoCallWindow = window.open('', '_blank');
		apiStartVideoCall(chatItem.id)
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
			chatItem.feedbackGroupId ? (
				<Link to={feedbackPath} className="sessionInfo__feedbackButton">
					<Button item={buttonFeedback} isLink={true} />
				</Link>
			) : null}

			{isGroupChat && chatItem.subscribed ? (
				<span
					onClick={handleLeaveGroupChat}
					className="sessionMenu__item--desktop sessionMenu__button"
				>
					<span className="sessionMenu__icon">
						<LeaveGroupChatIcon />
						{translate('chatFlyout.leaveGroupChat')}
					</span>
				</span>
			) : null}

			{isGroupChat &&
			hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) ? (
				<Link
					to={groupChatInfoLink}
					className="sessionMenu__item--desktop sessionMenu__button"
				>
					<span className="sessionMenu__icon">
						<GroupChatInfoIcon />
						{translate('chatFlyout.groupChatInfo')}
					</span>
				</Link>
			) : null}

			{isGroupChat &&
			chatItem.subscribed &&
			hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) ? (
				<span
					onClick={handleStopGroupChat}
					className="sessionMenu__item--desktop sessionMenu__button"
				>
					<span className="sessionMenu__icon">
						<StopGroupChatIcon />
						{translate('chatFlyout.stopGroupChat')}
					</span>
				</span>
			) : null}

			{isGroupChat &&
			isGroupChatOwner(activeSession, userData) &&
			!activeSession.chat.active ? (
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
			) : null}

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
				{hasVideoCallFeatures() && (
					<div
						className="sessionMenu__item sessionMenu__item--mobile"
						onClick={() => handleStartVideoCall(true)}
					>
						{translate('videoCall.button.startVideoCall')}
					</div>
				)}
				{hasVideoCallFeatures() && (
					<div
						className="sessionMenu__item sessionMenu__item--mobile"
						onClick={() => handleStartVideoCall()}
					>
						{translate('videoCall.button.startCall')}
					</div>
				)}
				{!hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) &&
				chatItem.feedbackGroupId ? (
					<Link
						className="sessionMenu__item sessionMenu__item--mobile"
						to={feedbackPath}
					>
						{translate('chatFlyout.feedback')}
					</Link>
				) : null}
				{!hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) &&
				!isGroupChat &&
				consultingType.showAskerProfile &&
				!isLiveChat ? (
					<Link className="sessionMenu__item" to={userProfileLink}>
						{translate('chatFlyout.askerProfil')}
					</Link>
				) : null}
				{!hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) &&
				chatItem.monitoring &&
				!isLiveChat &&
				!typeIsEnquiry(getTypeOfLocation()) ? (
					<Link className="sessionMenu__item" to={monitoringPath}>
						{translate('chatFlyout.documentation')}
					</Link>
				) : null}

				{isGroupChat && chatItem.subscribed ? (
					<div
						onClick={handleLeaveGroupChat}
						className="sessionMenu__item sessionMenu__item--mobile"
					>
						{translate('chatFlyout.leaveGroupChat')}
					</div>
				) : null}
				{isGroupChat &&
				hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) ? (
					<Link
						to={groupChatInfoLink}
						className="sessionMenu__item sessionMenu__item--mobile"
					>
						{translate('chatFlyout.groupChatInfo')}
					</Link>
				) : null}
				{isGroupChat &&
				chatItem.subscribed &&
				hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) ? (
					<div
						onClick={handleStopGroupChat}
						className="sessionMenu__item sessionMenu__item--mobile"
					>
						{translate('chatFlyout.stopGroupChat')}
					</div>
				) : null}
				{isGroupChat &&
				isGroupChatOwner(activeSession, userData) &&
				!activeSession.chat.active ? (
					<Link
						to={{
							pathname: editGroupChatSettingsLink,
							state: { isEditMode: true, prevIsInfoPage: false }
						}}
						className="sessionMenu__item sessionMenu__item--mobile"
					>
						{translate('chatFlyout.editGroupChat')}
					</Link>
				) : null}

				<a
					className="sessionMenu__item sessionMenu__item--fixed sessionMenu__item--border"
					target="_blank"
					rel="noreferrer"
					href={config.urls.imprint}
				>
					{translate('chatFlyout.imprint')}
				</a>
				<a
					className="sessionMenu__item sessionMenu__item--fixed"
					target="_blank"
					rel="noreferrer"
					href={config.urls.privacy}
				>
					{translate('chatFlyout.dataProtection')}
				</a>
			</div>
			{overlayActive ? (
				<OverlayWrapper>
					<Overlay
						item={overlayItem}
						handleOverlay={handleOverlayAction}
					/>
				</OverlayWrapper>
			) : null}
		</div>
	);
};
