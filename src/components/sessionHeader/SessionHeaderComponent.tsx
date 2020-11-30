import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { history } from '../app/app';
import {
	translate,
	handleNumericTranslation,
	getAddictiveDrugsString,
	getResortTranslation
} from '../../resources/scripts/i18n/translate';
import { mobileListView } from '../app/navigationHandler';
import {
	UserDataContext,
	SessionsDataContext,
	ActiveSessionGroupIdContext,
	getActiveSession,
	getContact,
	AUTHORITIES,
	hasUserAuthority
} from '../../globalState';
import { Link } from 'react-router-dom';
import {
	getViewPathForType,
	getChatItemForSession,
	isGroupChatForSessionItem,
	getTypeOfLocation,
	getSessionListPathForLocation
} from '../session/sessionHelpers';
import { SessionMenu } from '../sessionMenu/SessionMenu';
import {
	convertUserDataObjectToArray,
	getAddictiveDrugsTranslatable
} from '../profile/profileHelpers';
import { isGenericConsultingType } from '../../resources/scripts/helpers/resorts';
import { getGroupChatDate } from '../session/sessionDateHelpers';
import { getGroupMembers } from '../apiWrapper';
import { decodeUsername } from '../../resources/scripts/helpers/encryptionHelpers';
import './sessionHeader.styles';
import './sessionHeader.yellowTheme.styles';

export interface SessionHeaderProps {
	consultantAbsent?: boolean;
}

export const SessionHeaderComponent = (props: SessionHeaderProps) => {
	const { userData } = useContext(UserDataContext);
	const { sessionsData } = useContext(SessionsDataContext);
	const { activeSessionGroupId, setActiveSessionGroupId } = useContext(
		ActiveSessionGroupIdContext
	);
	let activeSession = getActiveSession(activeSessionGroupId, sessionsData);
	const chatItem = getChatItemForSession(activeSession);

	const username = getContact(activeSession).username;
	const userSessionData = getContact(activeSession).sessionData;
	const preparedUserSessionData =
		hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) &&
		userSessionData
			? convertUserDataObjectToArray(userSessionData)
			: null;
	const addictiveDrugs =
		hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) &&
		userSessionData
			? getAddictiveDrugsTranslatable(userSessionData.addictiveDrugs)
			: null;
	const translateBase =
		chatItem.consultingType === 0 ? 'user.userAddiction' : 'user.userU25';

	const [isSubscriberFlyoutOpen, setIsSubscriberFlyoutOpen] = useState(false);
	const [subscriberList, setSubscriberList] = useState([]);

	useEffect(() => {
		if (isSubscriberFlyoutOpen) {
			document.addEventListener('mousedown', (event) =>
				handleWindowClick(event)
			);
		}
	}, [isSubscriberFlyoutOpen]);

	const sessionView = getViewPathForType(getTypeOfLocation());
	const userProfileLink = `/sessions/consultant/${sessionView}/${chatItem.groupId}/${chatItem.id}/userProfile`;

	const handleBackButton = () => {
		mobileListView();
		setActiveSessionGroupId(null);
		history.push(getSessionListPathForLocation());
	};

	const handleFlyout = (e) => {
		if (!isSubscriberFlyoutOpen) {
			getGroupMembers(activeSession.chat.id)
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
	if (isGroupChat) {
		return (
			<div className="sessionInfo">
				<div className="sessionInfo__headerWrapper">
					<span
						onClick={handleBackButton}
						className="sessionInfo__backButton"
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
									id="arrow-left-a"
									d="M45.0252206,6.96804002 C45.4962829,6.4969777 46.0611408,6.26144654 46.7197943,6.26144654 C47.3784479,6.26144654 47.9433058,6.4969777 48.4143681,6.96804002 L54.5548531,13.1460432 C55.0259154,13.6171055 55.2614465,14.1757104 55.2614465,14.8218578 C55.2614465,15.4680053 55.0259154,16.0266102 54.5548531,16.4976725 L34.791079,36.2614465 L54.5548531,56.0252206 C55.0259154,56.4962829 55.2614465,57.0548878 55.2614465,57.7010352 C55.2614465,58.3471827 55.0259154,58.9057875 54.5548531,59.3768499 L48.4143681,65.5548531 C47.9433058,66.0259154 47.3784479,66.2614465 46.7197943,66.2614465 C46.0611408,66.2614465 45.4962829,66.0259154 45.0252206,65.5548531 L17.4451469,37.9372612 C16.9740846,37.4661988 16.7385535,36.907594 16.7385535,36.2614465 C16.7385535,35.6152991 16.9740846,35.0566942 17.4451469,34.5856319 L45.0252206,6.96804002 Z"
								/>
							</defs>
							<use xlinkHref="#arrow-left-a" />
						</svg>
					</span>
					<div className="sessionInfo__username sessionInfo__username--deactivate sessionInfo__username--groupChat">
						{hasUserAuthority(
							AUTHORITIES.CONSULTANT_DEFAULT,
							userData
						) ? (
							<Link
								to={`/sessions/consultant/${sessionView}/${chatItem.groupId}/${chatItem.id}/groupChatInfo`}
							>
								<h3>{chatItem.topic}</h3>
							</Link>
						) : (
							<h3>{chatItem.topic}</h3>
						)}
					</div>
					<SessionMenu />
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

	if (activeSession.isFeedbackSession) {
		return (
			<div className="sessionInfo">
				<div className="sessionInfo__feedbackHeaderWrapper">
					<Link
						to={{
							pathname: `/sessions/consultant/${sessionView}/${chatItem.groupId}/${chatItem.id}`
						}}
						className="sessionInfo__feedbackBackButton"
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
									id="arrow-left-a"
									d="M45.0252206,6.96804002 C45.4962829,6.4969777 46.0611408,6.26144654 46.7197943,6.26144654 C47.3784479,6.26144654 47.9433058,6.4969777 48.4143681,6.96804002 L54.5548531,13.1460432 C55.0259154,13.6171055 55.2614465,14.1757104 55.2614465,14.8218578 C55.2614465,15.4680053 55.0259154,16.0266102 54.5548531,16.4976725 L34.791079,36.2614465 L54.5548531,56.0252206 C55.0259154,56.4962829 55.2614465,57.0548878 55.2614465,57.7010352 C55.2614465,58.3471827 55.0259154,58.9057875 54.5548531,59.3768499 L48.4143681,65.5548531 C47.9433058,66.0259154 47.3784479,66.2614465 46.7197943,66.2614465 C46.0611408,66.2614465 45.4962829,66.0259154 45.0252206,65.5548531 L17.4451469,37.9372612 C16.9740846,37.4661988 16.7385535,36.907594 16.7385535,36.2614465 C16.7385535,35.6152991 16.9740846,35.0566942 17.4451469,34.5856319 L45.0252206,6.96804002 Z"
								/>
							</defs>
							<use xlinkHref="#arrow-left-a" />
						</svg>
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
				<span
					onClick={handleBackButton}
					className="sessionInfo__backButton"
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
								id="arrow-left-a"
								d="M45.0252206,6.96804002 C45.4962829,6.4969777 46.0611408,6.26144654 46.7197943,6.26144654 C47.3784479,6.26144654 47.9433058,6.4969777 48.4143681,6.96804002 L54.5548531,13.1460432 C55.0259154,13.6171055 55.2614465,14.1757104 55.2614465,14.8218578 C55.2614465,15.4680053 55.0259154,16.0266102 54.5548531,16.4976725 L34.791079,36.2614465 L54.5548531,56.0252206 C55.0259154,56.4962829 55.2614465,57.0548878 55.2614465,57.7010352 C55.2614465,58.3471827 55.0259154,58.9057875 54.5548531,59.3768499 L48.4143681,65.5548531 C47.9433058,66.0259154 47.3784479,66.2614465 46.7197943,66.2614465 C46.0611408,66.2614465 45.4962829,66.0259154 45.0252206,65.5548531 L17.4451469,37.9372612 C16.9740846,37.4661988 16.7385535,36.907594 16.7385535,36.2614465 C16.7385535,35.6152991 16.9740846,35.0566942 17.4451469,34.5856319 L45.0252206,6.96804002 Z"
							/>
						</defs>
						<use xlinkHref="#arrow-left-a" />
					</svg>
				</span>
				<div
					className={
						hasUserAuthority(AUTHORITIES.USER_DEFAULT, userData) ||
						isGenericConsultingType(chatItem.consultingType)
							? `sessionInfo__username sessionInfo__username--deactivate`
							: `sessionInfo__username`
					}
				>
					{hasUserAuthority(AUTHORITIES.USER_DEFAULT, userData) ? (
						<h3>
							{activeSession.teamSession
								? translate('sessionList.teamsession')
								: username}
						</h3>
					) : null}
					{hasUserAuthority(
						AUTHORITIES.CONSULTANT_DEFAULT,
						userData
					) ? (
						!isGenericConsultingType(chatItem.consultingType) ? (
							<Link to={userProfileLink}>
								<h3>{username}</h3>
							</Link>
						) : (
							<h3>{username}</h3>
						)
					) : null}
				</div>
				<SessionMenu />
			</div>
			{!activeSession.teamSession ||
			hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) ? (
				<div className="sessionInfo__metaInfo">
					{!activeSession.agency ? (
						<div className="sessionInfo__metaInfo__content">
							{getResortTranslation(
								chatItem.consultingType,
								true
							)}
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
					{activeSession.agency && activeSession.agency.name ? (
						<div className="sessionInfo__metaInfo__content">
							{' '}
							{activeSession.agency.name}{' '}
						</div>
					) : null}
					{activeSession.agency ? (
						<div className="sessionInfo__metaInfo__content">
							{translate('consultant.jobTitle')}
						</div>
					) : null}
				</div>
			) : null}

			{activeSession.teamSession &&
			hasUserAuthority(AUTHORITIES.USER_DEFAULT, userData) ? (
				<div className="sessionInfo__metaInfo">
					<div className="sessionInfo__metaInfo__content">
						{username}
						{getContact(activeSession).consultantAbsent ? (
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

			{!activeSession.teamSession &&
			hasUserAuthority(AUTHORITIES.USER_DEFAULT, userData) ? (
				<div className="sessionInfo__metaInfo">
					<div
						className={
							props.consultantAbsent
								? `sessionInfo__metaInfo__content sessionInfo__metaInfo__content--red`
								: `sessionInfo__metaInfo__content`
						}
					>
						{getContact(activeSession).consultantAbsent
							? translate('session.consultant.isAbsent')
							: null}
					</div>
				</div>
			) : null}
		</div>
	);
};
