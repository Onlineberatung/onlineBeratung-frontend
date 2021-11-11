import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import {
	translate,
	handleNumericTranslation,
	getAddictiveDrugsString
} from '../../utils/translate';
import { mobileListView } from '../app/navigationHandler';
import {
	UserDataContext,
	SessionsDataContext,
	ActiveSessionGroupIdContext,
	getActiveSession,
	getContact,
	AUTHORITIES,
	hasUserAuthority,
	isAnonymousSession,
	useConsultingType
} from '../../globalState';
import { useLocation, Link } from 'react-router-dom';
import {
	getViewPathForType,
	getChatItemForSession,
	isGroupChatForSessionItem,
	getTypeOfLocation,
	getSessionListPathForLocation,
	typeIsEnquiry
} from '../session/sessionHelpers';
import { SessionMenu } from '../sessionMenu/SessionMenu';
import {
	convertUserDataObjectToArray,
	getAddictiveDrugsTranslatable
} from '../profile/profileHelpers';
import { getGroupChatDate } from '../session/sessionDateHelpers';
import { apiGetGroupMembers } from '../../api';
import { decodeUsername } from '../../utils/encryptionHelpers';
import { ReactComponent as BackIcon } from '../../resources/img/icons/arrow-left.svg';
import './sessionHeader.styles';
import './sessionHeader.yellowTheme.styles';

export interface SessionHeaderProps {
	consultantAbsent?: {
		absenceMessage: string;
		absent: boolean;
		username: string;
	};
	hasUserInitiatedStopOrLeaveRequest?: React.MutableRefObject<boolean>;
}

export const SessionHeaderComponent = (props: SessionHeaderProps) => {
	const { userData } = useContext(UserDataContext);
	const { sessionsData } = useContext(SessionsDataContext);
	const { activeSessionGroupId, setActiveSessionGroupId } = useContext(
		ActiveSessionGroupIdContext
	);
	let activeSession = getActiveSession(activeSessionGroupId, sessionsData);
	const isLiveChat = isAnonymousSession(activeSession?.session);
	const chatItem = getChatItemForSession(activeSession);
	const consultingType = useConsultingType(chatItem.consultingType);

	const username = getContact(activeSession).username;
	const userSessionData = getContact(activeSession).sessionData;
	const preparedUserSessionData =
		hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) &&
		userSessionData &&
		!isLiveChat
			? convertUserDataObjectToArray(userSessionData)
			: null;
	const addictiveDrugs =
		hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) &&
		userSessionData
			? getAddictiveDrugsTranslatable(userSessionData.addictiveDrugs)
			: null;
	const translateBase =
		chatItem?.consultingType === 0 ? 'user.userAddiction' : 'user.userU25';

	const [isSubscriberFlyoutOpen, setIsSubscriberFlyoutOpen] = useState(false);
	const [subscriberList, setSubscriberList] = useState([]);
	const [sessionListTab] = useState(
		new URLSearchParams(useLocation().search).get('sessionListTab')
	);
	const getSessionListTab = () =>
		`${sessionListTab ? `?sessionListTab=${sessionListTab}` : ''}`;
	const sessionListType = getTypeOfLocation();

	useEffect(() => {
		if (isSubscriberFlyoutOpen) {
			document.addEventListener('mousedown', (event) =>
				handleWindowClick(event)
			);
		}
	}, [isSubscriberFlyoutOpen]);

	const sessionView = getViewPathForType(getTypeOfLocation());
	const userProfileLink = `/sessions/consultant/${sessionView}/${
		chatItem?.groupId
	}/${chatItem?.id}/userProfile${getSessionListTab()}`;

	const handleBackButton = () => {
		mobileListView();
		setActiveSessionGroupId(null);
	};

	const handleFlyout = (e) => {
		if (!isSubscriberFlyoutOpen) {
			apiGetGroupMembers(activeSession.chat.id)
				.then((response) => {
					const subscribers = response.members.map(
						(member) => member.username
					);
					setSubscriberList(subscribers);
					setIsSubscriberFlyoutOpen(true);
				})
				.catch((error) => {
					console.error(error);
				});
		} else if (e.target.id === 'subscriberButton') {
			setIsSubscriberFlyoutOpen(false);
		}
	};

	const handleWindowClick = (event) => {
		const flyoutElement = document.querySelector(
			'.sessionInfo__metaInfo__flyout'
		);
		if (
			flyoutElement &&
			!flyoutElement.contains(event.target) &&
			event.target.id !== 'subscriberButton'
		) {
			setIsSubscriberFlyoutOpen(false);
		}
	};

	const isGroupChat = isGroupChatForSessionItem(activeSession);
	const isAskerInfoAvailable = () =>
		!hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) &&
		consultingType.showAskerProfile &&
		!isLiveChat &&
		!isGroupChat &&
		((typeIsEnquiry(sessionListType) &&
			Object.entries(userSessionData).length !== 0) ||
			!typeIsEnquiry(sessionListType));

	if (isGroupChat) {
		return (
			<div className="sessionInfo">
				<div className="sessionInfo__headerWrapper">
					<Link
						to={
							getSessionListPathForLocation() +
							getSessionListTab()
						}
						onClick={handleBackButton}
						className="sessionInfo__backButton"
					>
						<BackIcon />
					</Link>
					<div className="sessionInfo__username sessionInfo__username--deactivate sessionInfo__username--groupChat">
						{hasUserAuthority(
							AUTHORITIES.CONSULTANT_DEFAULT,
							userData
						) ? (
							<Link
								to={`/sessions/consultant/${sessionView}/${
									chatItem.groupId
								}/${
									chatItem.id
								}/groupChatInfo${getSessionListTab()}`}
							>
								<h3>{chatItem.topic}</h3>
							</Link>
						) : (
							<h3>{chatItem.topic}</h3>
						)}
					</div>
					<SessionMenu
						hasUserInitiatedStopOrLeaveRequest={
							props.hasUserInitiatedStopOrLeaveRequest
						}
						isAskerInfoAvailable={isAskerInfoAvailable()}
					/>
				</div>
				<div className="sessionInfo__metaInfo">
					<div className="sessionInfo__metaInfo__content">
						{getGroupChatDate(chatItem, true)}
					</div>
					{activeSession.chat.active && chatItem.subscribed ? (
						<div
							className="sessionInfo__metaInfo__content sessionInfo__metaInfo__content--clickable"
							id="subscriberButton"
							onClick={(e) => handleFlyout(e)}
						>
							{translate(
								'groupChat.active.sessionInfo.subscriber'
							)}
							{isSubscriberFlyoutOpen ? (
								<div className="sessionInfo__metaInfo__flyout">
									<ul>
										{subscriberList.map(
											(subscriber, index) => (
												<li key={index}>
													{decodeUsername(subscriber)}
												</li>
											)
										)}
									</ul>
								</div>
							) : null}
						</div>
					) : null}
				</div>
			</div>
		);
	}

	if (activeSession?.isFeedbackSession) {
		return (
			<div className="sessionInfo">
				<div className="sessionInfo__feedbackHeaderWrapper">
					<Link
						to={{
							pathname: `${getSessionListPathForLocation()}/${
								activeSession.session.groupId
							}/${activeSession.session.id}}`,
							search: getSessionListTab()
						}}
						className="sessionInfo__feedbackBackButton"
					>
						<BackIcon />
					</Link>
					<div className="sessionInfo__username">
						<h3>{translate('session.feedback.label')}</h3>
					</div>
				</div>
				<div className="sessionInfo__feedbackMetaInfo">
					{activeSession.user.username ? (
						<div className="sessionInfo__metaInfo__content">
							{activeSession.user.username}
						</div>
					) : null}
				</div>
			</div>
		);
	}

	return (
		<div className="sessionInfo">
			<div className="sessionInfo__headerWrapper">
				<Link
					to={getSessionListPathForLocation() + getSessionListTab()}
					onClick={handleBackButton}
					className="sessionInfo__backButton"
				>
					<BackIcon />
				</Link>
				<div
					className={clsx('sessionInfo__username', {
						'sessionInfo__username--deactivate':
							!isAskerInfoAvailable()
					})}
				>
					{hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) ? (
						<h3>
							{activeSession?.isTeamSession
								? translate('sessionList.teamsession')
								: username}
						</h3>
					) : null}
					{hasUserAuthority(
						AUTHORITIES.CONSULTANT_DEFAULT,
						userData
					) ? (
						isAskerInfoAvailable() ? (
							<Link to={userProfileLink}>
								<h3>{username}</h3>
							</Link>
						) : (
							<h3>{username}</h3>
						)
					) : null}
					{hasUserAuthority(
						AUTHORITIES.ANONYMOUS_DEFAULT,
						userData
					) && <h3>{username}</h3>}
				</div>
				<SessionMenu
					hasUserInitiatedStopOrLeaveRequest={
						props.hasUserInitiatedStopOrLeaveRequest
					}
					isAskerInfoAvailable={isAskerInfoAvailable()}
				/>
			</div>
			{!activeSession?.isTeamSession ||
			hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) ? (
				<div className="sessionInfo__metaInfo">
					{!activeSession?.agency ? (
						<div className="sessionInfo__metaInfo__content">
							{consultingType.titles.short}
						</div>
					) : null}
					{preparedUserSessionData
						? preparedUserSessionData.map((item, index) =>
								item.value ? (
									<div
										className="sessionInfo__metaInfo__content"
										key={index}
									>
										{item.type === 'addictiveDrugs'
											? getAddictiveDrugsString(
													addictiveDrugs
											  )
											: handleNumericTranslation(
													translateBase,
													item.type,
													item.value
											  )}
									</div>
								) : null
						  )
						: null}
					{activeSession?.agency && activeSession?.agency.name ? (
						<div className="sessionInfo__metaInfo__content">
							{' '}
							{activeSession.agency.name}{' '}
						</div>
					) : null}
					{activeSession?.agency ? (
						<div className="sessionInfo__metaInfo__content">
							{translate('consultant.jobTitle')}
						</div>
					) : null}
				</div>
			) : null}

			{activeSession?.isTeamSession &&
			hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) ? (
				<div className="sessionInfo__metaInfo">
					<div className="sessionInfo__metaInfo__content">
						{username}
						{getContact(activeSession).consultantAbsent.absent ? (
							<span>
								{translate(
									'session.teamConsultant.isAbsentPrefix'
								)}
								<span className="sessionInfo__metaInfo__content--red">
									{translate(
										'session.teamConsultant.isAbsent'
									)}
								</span>
							</span>
						) : username ===
						  translate('sessionList.user.consultantUnknown') ? (
							''
						) : (
							translate('session.header.consultants.suffix')
						)}
					</div>
				</div>
			) : null}

			{!activeSession?.isTeamSession &&
			hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) ? (
				<div className="sessionInfo__metaInfo">
					<div
						className={
							props.consultantAbsent?.absent
								? `sessionInfo__metaInfo__content sessionInfo__metaInfo__content--red`
								: `sessionInfo__metaInfo__content`
						}
					>
						{getContact(activeSession).consultantAbsent?.absent
							? translate('session.consultant.isAbsent')
							: null}
					</div>
				</div>
			) : null}
		</div>
	);
};
