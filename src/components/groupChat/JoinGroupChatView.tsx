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
	AUTHORITIES,
	AcceptedGroupIdContext
} from '../../globalState';
import { mobileDetailView, mobileListView } from '../app/navigationHandler';
import { SessionHeaderComponent } from '../sessionHeader/SessionHeaderComponent';
import {
	getChatItemForSession,
	getSessionListPathForLocation
} from '../session/sessionHelpers';
import {
	apiPutGroupChat,
	apiGetGroupChatInfo,
	groupChatInfoData,
	GROUP_CHAT_API,
	FETCH_ERRORS
} from '../../api';
import {
	OverlayWrapper,
	Overlay,
	OVERLAY_FUNCTIONS,
	OverlayItem
} from '../overlay/Overlay';
import { translate } from '../../resources/scripts/i18n/translate';
import { history } from '../app/app';
import {
	startButtonItem,
	joinButtonItem,
	startJoinGroupChatErrorOverlay,
	joinGroupChatClosedErrorOverlay
} from './joinGroupChatHelpers';
import { Button } from '../button/Button';
import { logout } from '../logout/logout';
import { Redirect } from 'react-router-dom';
import { ReactComponent as WarningIcon } from '../../resources/img/icons/i.svg';
import './joinChat.styles';
import {
	getResortKeyForConsultingType,
	groupChatRuleTexts,
	isGroupChatConsultingType
} from '../../resources/scripts/helpers/resorts';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';

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
	const { setAcceptedGroupId } = useContext(AcceptedGroupIdContext);
	const [overlayItem, setOverlayItem] = useState<OverlayItem>(null);
	const [overlayActive, setOverlayActive] = useState(false);
	const [redirectToSessionsList, setRedirectToSessionsList] = useState(false);

	const [buttonItem, setButtonItem] = useState(joinButtonItem);
	const [isButtonDisabled, setIsButtonDisabled] = useState(false);
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
			hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) ||
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
	}, [activeSession]); // eslint-disable-line react-hooks/exhaustive-deps

	const updateGroupChatInfo = () => {
		if (
			chatItem.groupId === activeSessionGroupId &&
			isGroupChatConsultingType(chatItem.consultingType)
		) {
			apiGetGroupChatInfo(chatItem.id)
				.then((response: groupChatInfoData) => {
					if (chatItem.active !== response.active) {
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
		apiPutGroupChat(chatItem.id, groupChatApiCall)
			.then(() => {
				if (
					hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData)
				) {
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
				}
				setAcceptedGroupId(chatItem.groupId);
				history.push(getSessionListPathForLocation());
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
				<Headline
					text={translate('groupChat.join.content.headline')}
					semanticLevel="4"
				/>
				{groupChatRuleTexts[
					getResortKeyForConsultingType(chatItem.consultingType)
				]?.map((groupChatRuleText, i) => (
					<Text text={groupChatRuleText} type="standard" key={i} />
				))}
			</div>
			<div className="joinChat__button-container">
				{!hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) &&
					!chatItem.active && (
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
					/>
				</OverlayWrapper>
			)}
		</div>
	);
};
