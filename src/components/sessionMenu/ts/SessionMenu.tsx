import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { translate } from '../../../resources/ts/i18n/translate';
import { config } from '../../../resources/ts/config';
import { Link, Redirect } from 'react-router-dom';
import {
	ActiveSessionGroupIdContext,
	getActiveSession,
	SessionsDataContext,
	UserDataContext,
	StoppedGroupChatContext,
	hasUserAuthority,
	AUTHORITIES
} from '../../../globalState';
import {
	typeIsEnquiry,
	getChatItemForSession,
	isGroupChatForSessionItem,
	getSessionListPathForLocation,
	getTypeOfLocation
} from '../../session/ts/sessionHelpers';
import { isGenericConsultingType } from '../../../resources/ts/helpers/resorts';
import {
	OverlayWrapper,
	Overlay,
	OVERLAY_FUNCTIONS
} from '../../overlay/ts/Overlay';
import {
	stopGroupChatSecurityOverlayItem,
	stopGroupChatSuccessOverlayItem,
	leaveGroupChatSecurityOverlayItem,
	groupChatErrorOverlayItem,
	leaveGroupChatSuccessOverlayItem
} from './sessionMenuHelpers';
import { ajaxCallPutGroupChat, GROUP_CHAT_API } from '../../apiWrapper/ts';
import { logout } from '../../logout/ts/logout';
import { mobileListView } from '../../app/ts/navigationHandler';
import { isGroupChatOwner } from '../../groupChat/ts/groupChatHelpers';

export const SessionMenu = () => {
	const { userData } = useContext(UserDataContext);
	const { sessionsData } = useContext(SessionsDataContext);
	const { activeSessionGroupId, setActiveSessionGroupId } = useContext(
		ActiveSessionGroupIdContext
	);
	const activeSession = getActiveSession(activeSessionGroupId, sessionsData);
	const { setStoppedGroupChat } = useContext(StoppedGroupChatContext);
	const chatItem = getChatItemForSession(activeSession);
	const isGroupChat = isGroupChatForSessionItem(activeSession);
	const [overlayItem, setOverlayItem] = useState(null);
	const [overlayActive, setOverlayActive] = useState(false);
	const [redirectToSessionsList, setRedirectToSessionsList] = useState(false);
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);

	useEffect(() => {
		document.addEventListener('mousedown', (e) => handleClick(e));
	}, []);

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
			ajaxCallPutGroupChat(chatItem.id, GROUP_CHAT_API.STOP)
				.then((response) => {
					setOverlayItem(stopGroupChatSuccessOverlayItem);
					setIsRequestInProgress(false);
				})
				.catch((error) => {
					setOverlayItem(groupChatErrorOverlayItem);
					setIsRequestInProgress(false);
				});
		} else if (buttonFunction === OVERLAY_FUNCTIONS.LEAVE_GROUP_CHAT) {
			ajaxCallPutGroupChat(chatItem.id, GROUP_CHAT_API.LEAVE)
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

	return (
		<div className="sessionMenu__wrapper">
			{!hasUserAuthority(AUTHORITIES.USER_DEFAULT, userData) &&
			!typeIsEnquiry(getTypeOfLocation()) &&
			chatItem.feedbackGroupId ? (
				<Link
					to={feedbackPath}
					className="sessionInfo__feedbackButton sessionMenu__item--desktop"
					role="button"
				>
					<img src="/resources/img/icons/pen-paper.svg" />
					<p>{translate('chatFlyout.feedback')}</p>
				</Link>
			) : null}

			{isGroupChat && chatItem.subscribed ? (
				<span
					onClick={handleLeaveGroupChat}
					className="sessionMenu__item--desktop sessionMenu__button"
				>
					<span className="sessionMenu__icon">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							xmlnsXlink="http://www.w3.org/1999/xlink"
							width="72"
							height="72"
							viewBox="0 0 72 72"
						>
							<defs>
								<path
									id="out-a"
									d="M41,6 L10,6 C8.8954305,6 8,6.8954305 8,8 L8,64 C8,65.1045695 8.8954305,66 10,66 L41,66 L41,6 Z M41,13 L41,59 L15,59 L15,13 L41,13 Z M50.2647746,21.5814976 L63.4416307,34.5863568 C63.8138769,34.9342368 64,35.3698996 64,35.8933452 C64,36.4167908 63.8138769,36.8524535 63.4416307,37.2003335 L50.2647746,50.2051928 C49.6959736,50.8055838 49.009679,50.9410511 48.2058908,50.6115946 C47.4416331,50.2821382 47.0595043,49.7110081 47.0595043,48.8982044 L47.0595043,41.467553 L33.8826482,41.467553 C33.373143,41.467553 32.9317184,41.2838593 32.5583741,40.9164721 C32.1850299,40.5490848 31.9989068,40.113422 32.0000048,39.6094837 L32.0000048,32.1788323 C32.0000048,31.6759777 32.1861279,31.2403149 32.5583741,30.8718439 C32.9306203,30.5033729 33.372045,30.3196792 33.8826482,30.320763 L47.0595043,30.320763 L47.0595043,22.8901115 C47.0595043,22.0773078 47.4416331,21.5061778 48.2058908,21.1767213 C49.009679,20.8456393 49.6959736,20.9811066 50.2647746,21.5814976 Z"
								/>
							</defs>
							<use xlinkHref="#out-a" />
						</svg>
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
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="72"
							height="72"
							viewBox="0 0 72 72"
						>
							<path d="M36,6 C52.5333333,6 66,19.4666667 66,36 C66,52.5333333 52.5333333,66 36,66 C19.4666667,66 6,52.5333333 6,36 C6,19.4666667 19.4666667,6 36,6 Z M29.3515625,50.4609375 L29.3515625,54.5625 L42.78125,54.5625 L42.78125,50.4609375 L39.5,49.7578125 L39.5,29.203125 L29,29.203125 L29,33.328125 L32.65625,34.03125 L32.65625,49.7578125 L29.3515625,50.4609375 Z M39.5,23.1328125 L39.5,18 L32.65625,18 L32.65625,23.1328125 L39.5,23.1328125 Z" />
						</svg>
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
						<svg
							width="72"
							height="72"
							viewBox="0 0 72 72"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path d="M45.6482 36.5772L65.5685 56.4975C66.3496 57.2785 66.3496 58.5449 65.5685 59.3259L59.3259 65.5685C58.5449 66.3496 57.2785 66.3496 56.4975 65.5685L36.5772 45.6482L16.6569 65.5685C15.8758 66.3496 14.6095 66.3496 13.8284 65.5685L7.58579 59.3259C6.80474 58.5449 6.80474 57.2785 7.58579 56.4975L27.5061 36.5772L7.58579 16.6569C6.80474 15.8758 6.80474 14.6095 7.58579 13.8284L13.8284 7.58579C14.6095 6.80474 15.8758 6.80474 16.6569 7.58579L36.5772 27.5061L56.4975 7.58579C57.2785 6.80474 58.5449 6.80474 59.3259 7.58579L65.5685 13.8284C66.3496 14.6095 66.3496 15.8758 65.5685 16.6569L45.6482 36.5772Z" />
						</svg>
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
						<svg
							width="72"
							height="72"
							viewBox="0 0 72 72"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path d="M63.8046 31.6311L57.8611 30.6396C57.4291 28.8735 56.7992 27.1852 55.979 25.6106L59.7838 20.8929C60.5931 19.8958 60.5563 18.4613 59.7031 17.499L57.3393 14.8386C56.4824 13.8773 55.0615 13.674 53.9776 14.3588L48.8948 17.554C46.6592 15.992 44.1268 14.8386 41.395 14.1693L40.4006 8.19369C40.192 6.92839 39.0971 6 37.8118 6H34.2495C32.9669 6 31.8683 6.92839 31.6643 8.19369L30.6644 14.1711C28.4059 14.7241 26.2882 15.6168 24.3557 16.7924L19.5218 13.3425C18.48 12.5982 17.0491 12.7146 16.14 13.6218L13.6233 16.1403C12.7161 17.0495 12.5997 18.4805 13.346 19.5223L16.8038 24.3656C15.6392 26.2836 14.7558 28.3892 14.2029 30.6278L8.19349 31.6312C6.93017 31.8399 6 32.9349 6 34.2203V37.7798C6 39.0651 6.93017 40.1602 8.19349 40.3689L14.2029 41.3723C14.657 43.2144 15.3161 44.9739 16.1923 46.6054L12.4047 51.2965C11.5983 52.2926 11.6321 53.7281 12.4853 54.6895L14.8473 57.35C15.7043 58.3131 17.1259 58.5127 18.2099 57.8297L23.366 54.5906C25.5477 56.0829 28.0159 57.1797 30.6644 57.8297L31.6643 63.8062C31.8684 65.0716 32.9669 66 34.2495 66H37.8118C39.0971 66 40.192 65.0717 40.4006 63.8063L41.3967 57.8297C43.6271 57.2842 45.7178 56.4071 47.6332 55.2516L52.6685 58.8479C53.7084 59.5949 55.1404 59.4777 56.0486 58.5676L58.5662 56.05C59.4724 55.1435 59.5951 53.7134 58.8426 52.6697L55.2577 47.6434C56.4256 45.719 57.3137 43.6096 57.8631 41.3611L63.8066 40.3687C65.0736 40.16 66 39.0649 66 37.7796V34.2201C65.9981 32.9349 65.0717 31.8399 63.8046 31.6311ZM36.8334 46C30.8516 46 26 41.1476 26 35.1667C26 29.1849 30.8516 24.3333 36.8334 24.3333C42.8142 24.3333 47.6667 29.1849 47.6667 35.1667C47.6667 41.1476 42.8142 46 36.8334 46Z" />
						</svg>
						{translate('chatFlyout.editGroupChat')}
					</span>
				</Link>
			) : null}

			<span
				id="iconH"
				onClick={handleFlyout}
				className="sessionMenu__icon sessionMenu__icon--desktop"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					xmlnsXlink="http://www.w3.org/1999/xlink"
					width="72"
					height="72"
					viewBox="0 0 72 72"
				>
					<defs>
						<path
							id="stack-horizontal-a"
							d="M30,6 L42,6 C43.1045695,6 44,6.8954305 44,8 L44,20 C44,21.1045695 43.1045695,22 42,22 L30,22 C28.8954305,22 28,21.1045695 28,20 L28,8 C28,6.8954305 28.8954305,6 30,6 Z M30,28 L42,28 C43.1045695,28 44,28.8954305 44,30 L44,42 C44,43.1045695 43.1045695,44 42,44 L30,44 C28.8954305,44 28,43.1045695 28,42 L28,30 C28,28.8954305 28.8954305,28 30,28 Z M30,50 L42,50 C43.1045695,50 44,50.8954305 44,52 L44,64 C44,65.1045695 43.1045695,66 42,66 L30,66 C28.8954305,66 28,65.1045695 28,64 L28,52 C28,50.8954305 28.8954305,50 30,50 Z"
						/>
					</defs>
					<use
						transform="rotate(90 36 36)"
						xlinkHref="#stack-horizontal-a"
					/>
				</svg>
			</span>
			<span
				id="iconV"
				onClick={handleFlyout}
				className="sessionMenu__icon sessionMenu__icon--mobile"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					xmlnsXlink="http://www.w3.org/1999/xlink"
					width="72"
					height="72"
					viewBox="0 0 72 72"
				>
					<defs>
						<path
							id="stack-vertical-a"
							d="M30,6 L42,6 C43.1045695,6 44,6.8954305 44,8 L44,20 C44,21.1045695 43.1045695,22 42,22 L30,22 C28.8954305,22 28,21.1045695 28,20 L28,8 C28,6.8954305 28.8954305,6 30,6 Z M30,28 L42,28 C43.1045695,28 44,28.8954305 44,30 L44,42 C44,43.1045695 43.1045695,44 42,44 L30,44 C28.8954305,44 28,43.1045695 28,42 L28,30 C28,28.8954305 28.8954305,28 30,28 Z M30,50 L42,50 C43.1045695,50 44,50.8954305 44,52 L44,64 C44,65.1045695 43.1045695,66 42,66 L30,66 C28.8954305,66 28,65.1045695 28,64 L28,52 C28,50.8954305 28.8954305,50 30,50 Z"
						/>
					</defs>
					<use xlinkHref="#stack-vertical-a" />
				</svg>
			</span>

			<div id="flyout" className="sessionMenu__content">
				{!hasUserAuthority(AUTHORITIES.USER_DEFAULT, userData) &&
				chatItem.feedbackGroupId ? (
					<Link
						className="sessionMenu__item sessionMenu__item--mobile"
						to={feedbackPath}
					>
						{translate('chatFlyout.feedback')}
					</Link>
				) : null}
				{!hasUserAuthority(AUTHORITIES.USER_DEFAULT, userData) &&
				!isGroupChat &&
				!isGenericConsultingType(chatItem.consultingType) ? (
					<Link className="sessionMenu__item" to={userProfileLink}>
						{translate('chatFlyout.askerProfil')}
					</Link>
				) : null}
				{!hasUserAuthority(AUTHORITIES.USER_DEFAULT, userData) &&
				chatItem.monitoring &&
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
					href={config.endpoints.caritasImprint}
				>
					{translate('chatFlyout.imprint')}
				</a>
				<a
					className="sessionMenu__item sessionMenu__item--fixed"
					target="_blank"
					href={config.endpoints.caritasDataprotection}
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
