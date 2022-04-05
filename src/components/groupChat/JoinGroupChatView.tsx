import * as React from 'react';
import { useEffect, useContext, useState } from 'react';
import {
	UserDataContext,
	SessionsDataContext,
	getSessionsDataWithChangedValue,
	hasUserAuthority,
	AUTHORITIES,
	AcceptedGroupIdContext,
	useConsultingType,
	GroupChatItemInterface,
	UpdateSessionListContext,
	LegalLinkInterface
} from '../../globalState';
import { mobileListView } from '../app/navigationHandler';
import { SessionHeaderComponent } from '../sessionHeader/SessionHeaderComponent';
import { getSessionListPathForLocation } from '../session/sessionHelpers';
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
import { translate } from '../../utils/translate';
import { history } from '../app/app';
import {
	startButtonItem,
	joinButtonItem,
	startJoinGroupChatErrorOverlay,
	joinGroupChatClosedErrorOverlay
} from './joinGroupChatHelpers';
import { Button } from '../button/Button';
import { logout } from '../logout/logout';
import { Redirect, useLocation, useParams } from 'react-router-dom';
import { ReactComponent as WarningIcon } from '../../resources/img/icons/i.svg';
import './joinChat.styles';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';
import { bannedUserOverlay } from '../banUser/banUserHelper';

interface JoinGroupChatViewProps {
	chatItem: GroupChatItemInterface;
	forceBannedOverlay?: boolean;
	bannedUsers?: string[];
	legalLinks: Array<LegalLinkInterface>;
}

export const JoinGroupChatView = ({
	legalLinks,
	chatItem,
	forceBannedOverlay = false,
	bannedUsers = []
}: JoinGroupChatViewProps) => {
	const { rcGroupId: groupIdFromParam } = useParams();

	const activeSession = useContext(ActiveSessionContext);
	const { userData } = useContext(UserDataContext);
	const { sessionsData, setSessionsData } = useContext(SessionsDataContext);
	const { setUpdateSessionList } = useContext(UpdateSessionListContext);
	const { setAcceptedGroupId } = useContext(AcceptedGroupIdContext);
	const [overlayItem, setOverlayItem] = useState<OverlayItem>(null);
	const [overlayActive, setOverlayActive] = useState(false);
	const [redirectToSessionsList, setRedirectToSessionsList] = useState(false);
	const consultingType = useConsultingType(chatItem.consultingType);

	const [buttonItem, setButtonItem] = useState(joinButtonItem);
	const [isButtonDisabled, setIsButtonDisabled] = useState(false);
	const timeout = 5000;
	let timeoutId;

	const [isRequestInProgress, setIsRequestInProgress] = useState(false);
	const [sessionListTab] = useState(
		new URLSearchParams(useLocation().search).get('sessionListTab')
	);
	const getSessionListTab = () =>
		`${sessionListTab ? `?sessionListTab=${sessionListTab}` : ''}`;

	useEffect(() => {
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
			if (!chatItem.active || bannedUsers.includes(userData.username)) {
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

	useEffect(() => {
		if (bannedUsers.includes(userData.userName)) {
			setIsButtonDisabled(true);
		}
	}, [bannedUsers, userData.userName]);

	const updateGroupChatInfo = () => {
		if (
			chatItem.groupId === groupIdFromParam &&
			consultingType.groupChat.isGroupChat
		) {
			apiGetGroupChatInfo(chatItem.id)
				.then((response: groupChatInfoData) => {
					if (chatItem.active !== response.active) {
						let changedSessionsData =
							getSessionsDataWithChangedValue(
								sessionsData,
								activeSession,
								'active',
								response.active
							);
						setSessionsData(changedSessionsData);
						history.push(
							`${getSessionListPathForLocation()}/${
								chatItem.groupId
							}/${chatItem.id}${getSessionListTab()}`
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

	const handleOverlayClose = () => {
		setOverlayActive(false);
	};

	const handleButtonClick = () => {
		if (bannedUsers.includes(userData.userName)) {
			setOverlayItem(bannedUserOverlay);
			setOverlayActive(true);
			return null;
		}
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
				history.push(
					getSessionListPathForLocation() + getSessionListTab()
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
			setOverlayItem({});
		} else if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECT) {
			setUpdateSessionList(true);
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
						handleOverlayClose={handleOverlayClose}
					/>
				</OverlayWrapper>
			)}
		</div>
	);
};
