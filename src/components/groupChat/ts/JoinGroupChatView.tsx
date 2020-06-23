import * as React from 'react';
import { useEffect, useContext, useState } from 'react';
import {
	UserDataContext,
	ActiveSessionGroupIdContext,
	getActiveSession,
	SessionsDataContext,
	getSessionsDataWithChangedValue,
	StoppedGroupChatContext,
	hasUserAuthority,
	AUTHORITIES
} from '../../../globalState';
import {
	mobileDetailView,
	mobileListView
} from '../../app/ts/navigationHandler';
import { SessionHeaderComponent } from '../../sessionHeader/ts/SessionHeaderComponent';
import {
	getChatItemForSession,
	getSessionListPathForLocation
} from '../../session/ts/sessionHelpers';
import {
	ajaxCallPutGroupChat,
	ajaxCallGetGroupChatInfo,
	groupChatInfoData,
	GROUP_CHAT_API
} from '../../apiWrapper/ts';
import {
	OverlayWrapper,
	Overlay,
	OVERLAY_FUNCTIONS
} from '../../overlay/ts/Overlay';
import { translate } from '../../../resources/ts/i18n/translate';
import { history } from '../../app/ts/app';
import {
	startButtonItem,
	joinButtonItem,
	startJoinGroupChatErrorOverlay,
	joinGroupChatClosedErrorOverlay
} from './joinGroupChatHelpers';
import { Button } from '../../button/ts/Button';
import { FETCH_ERRORS } from '../../apiWrapper/ts/fetchData';
import { logout } from '../../logout/ts/logout';
import { Redirect } from 'react-router';

export const JoinGroupChatView = () => {
	const { userData } = useContext(UserDataContext);
	const { sessionsData, setSessionsData } = useContext(SessionsDataContext);
	const { setStoppedGroupChat } = useContext(StoppedGroupChatContext);
	const { activeSessionGroupId, setActiveSessionGroupId } = useContext(
		ActiveSessionGroupIdContext
	);
	const activeSession = getActiveSession(activeSessionGroupId, sessionsData);
	if (!activeSession) {
		history.push(getSessionListPathForLocation());
	}
	const chatItem = getChatItemForSession(activeSession);

	const [overlayItem, setOverlayItem] = useState(null);
	const [overlayActive, setOverlayActive] = useState(false);
	const [redirectToSessionsList, setRedirectToSessionsList] = useState(false);

	const [buttonItem, setButtonItem] = useState(joinButtonItem);
	const [isButtonDisabled, setIsButtonDisabled] = useState(null);
	const timeout = 5000;
	let timeoutId;

	const [isRequestInProgress, setIsRequestInProgress] = useState(false);

	useEffect(() => {
		mobileDetailView();
		if (
			hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) &&
			!chatItem.active
		) {
			setButtonItem(startButtonItem);
		} else if (
			hasUserAuthority(AUTHORITIES.USER_DEFAULT, userData) ||
			!chatItem.subscribed
		) {
			setButtonItem(joinButtonItem);
			if (!chatItem.active) {
				setIsButtonDisabled(true);
			} else {
				setIsButtonDisabled(false);
			}
		}

		updateGroupChatInfo();
		return function stopTimeout() {
			window.clearTimeout(timeoutId);
		};
	}, []);

	const updateGroupChatInfo = () => {
		if (chatItem.groupId === activeSessionGroupId) {
			ajaxCallGetGroupChatInfo(chatItem.id)
				.then((response: groupChatInfoData) => {
					if (chatItem.active != response.active) {
						let changedSessionsData = getSessionsDataWithChangedValue(
							sessionsData,
							activeSession,
							'active',
							response.active
						);
						setSessionsData(changedSessionsData);
						history.push(
							`${getSessionListPathForLocation()}/${
								chatItem.groupId
							}/${chatItem.id}`
						);
					}
				})
				.catch((error) => {
					if (error.message === FETCH_ERRORS.NO_MATCH) {
						setOverlayItem(joinGroupChatClosedErrorOverlay);
						setOverlayActive(true);
						window.clearTimeout(timeoutId);
					}
				});
			timeoutId = window.setTimeout(() => {
				updateGroupChatInfo();
			}, timeout);
		}
	};

	const handleButtonClick = () => {
		if (isRequestInProgress) {
			return null;
		}
		setIsRequestInProgress(true);
		const groupChatApiCall =
			hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) &&
			!chatItem.active
				? GROUP_CHAT_API.START
				: GROUP_CHAT_API.JOIN;
		ajaxCallPutGroupChat(chatItem.id, groupChatApiCall)
			.then(() => {
				let changedSessionsData = getSessionsDataWithChangedValue(
					sessionsData,
					activeSession,
					'active',
					true
				);
				changedSessionsData = getSessionsDataWithChangedValue(
					changedSessionsData,
					activeSession,
					'subscribed',
					true
				);
				setSessionsData(changedSessionsData);
				history.push(
					`${getSessionListPathForLocation()}/${chatItem.groupId}/${
						chatItem.id
					}`
				);
			})
			.catch(() => {
				setOverlayItem(startJoinGroupChatErrorOverlay);
				setOverlayActive(true);
			});
	};

	const handleOverlayAction = (buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.CLOSE) {
			setOverlayActive(false);
			setOverlayItem(null);
		} else if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECT) {
			setStoppedGroupChat(true);
			setRedirectToSessionsList(true);
		} else if (buttonFunction === OVERLAY_FUNCTIONS.LOGOUT) {
			logout();
		}
		setIsRequestInProgress(false);
	};

	if (redirectToSessionsList) {
		mobileListView();
		setActiveSessionGroupId(null);
		return <Redirect to={getSessionListPathForLocation()} />;
	}

	return (
		<div className="session joinChat">
			<SessionHeaderComponent />
			<div className="joinChat__content session__content">
				<h4>{translate('groupChat.join.content.headline')}</h4>
				<p>{translate('groupChat.join.content.rules.1')}</p>
				<p>{translate('groupChat.join.content.rules.2')}</p>
				<p>{translate('groupChat.join.content.rules.3')}</p>
			</div>
			<div className="joinChat__button-container">
				{!hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) &&
				!chatItem.active ? (
					<p className="joinChat__warning-message">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 72 72"
						>
							<path d="M36,6 C52.5333333,6 66,19.4666667 66,36 C66,52.5333333 52.5333333,66 36,66 C19.4666667,66 6,52.5333333 6,36 C6,19.4666667 19.4666667,6 36,6 Z M29.3515625,50.4609375 L29.3515625,54.5625 L42.78125,54.5625 L42.78125,50.4609375 L39.5,49.7578125 L39.5,29.203125 L29,29.203125 L29,33.328125 L32.65625,34.03125 L32.65625,49.7578125 L29.3515625,50.4609375 Z M39.5,23.1328125 L39.5,18 L32.65625,18 L32.65625,23.1328125 L39.5,23.1328125 Z" />
						</svg>
						{translate('groupChat.join.warning.message')}
					</p>
				) : null}

				<Button
					item={buttonItem}
					buttonHandle={handleButtonClick}
					disabled={isButtonDisabled}
				/>
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
