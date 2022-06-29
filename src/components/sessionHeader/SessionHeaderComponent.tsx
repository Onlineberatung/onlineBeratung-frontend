import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import clsx from 'clsx';
import {
	translate,
	handleNumericTranslation,
	getAddictiveDrugsString
} from '../../utils/translate';
import { mobileListView } from '../app/navigationHandler';
import {
	UserDataContext,
	getContact,
	AUTHORITIES,
	hasUserAuthority,
	useConsultingType,
	SessionConsultantInterface,
	LegalLinkInterface
} from '../../globalState';
import {
	getViewPathForType,
	getChatItemForSession,
	getTypeOfLocation,
	getSessionListPathForLocation,
	typeIsEnquiry,
	isGroupChat,
	isLiveChat,
	isSessionChat,
	isUserModerator
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
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';
import { getValueFromCookie } from '../sessionCookie/accessSessionCookie';
import { FlyoutMenu } from '../flyoutMenu/FlyoutMenu';
import { BanUser } from '../banUser/BanUser';
import { Tag } from '../tag/Tag';
import './sessionHeader.styles';
import './sessionHeader.yellowTheme.styles';

export interface SessionHeaderProps {
	consultantAbsent?: SessionConsultantInterface;
	hasUserInitiatedStopOrLeaveRequest?: React.MutableRefObject<boolean>;
	legalLinks: Array<LegalLinkInterface>;
	isJoinGroupChatView?: boolean;
	bannedUsers: string[];
}

export const SessionHeaderComponent = (props: SessionHeaderProps) => {
	const activeSession = useContext(ActiveSessionContext);
	const { userData } = useContext(UserDataContext);
	const chatItem = getChatItemForSession(activeSession);
	const consultingType = useConsultingType(chatItem?.consultingType);
	const [flyoutOpenId, setFlyoutOpenId] = useState('');

	const username = getContact(activeSession).username;
	const displayName = getContact(activeSession).displayName;
	const userSessionData = getContact(activeSession).sessionData;
	const preparedUserSessionData =
		hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) &&
		userSessionData &&
		!isLiveChat(chatItem)
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
	};

	const handleFlyout = (e) => {
		if (!isSubscriberFlyoutOpen) {
			apiGetGroupMembers(activeSession.chat.id)
				.then((response) => {
					const subscribers = response.members.map((member) => ({
						isModerator: isUserModerator({
							chatItem: activeSession.chat,
							rcUserId: member._id
						}),
						...member
					}));
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
			setFlyoutOpenId('');
			setIsSubscriberFlyoutOpen(false);
		}
	};

	const isCurrentUserModerator = isUserModerator({
		chatItem: activeSession?.chat,
		rcUserId: getValueFromCookie('rc_uid')
	});

	const isAskerInfoAvailable = () =>
		!hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) &&
		consultingType.showAskerProfile &&
		isSessionChat(chatItem) &&
		!isLiveChat(chatItem) &&
		((typeIsEnquiry(sessionListType) &&
			Object.entries(userSessionData).length !== 0) ||
			!typeIsEnquiry(sessionListType));

	if (isGroupChat(chatItem)) {
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
						legalLinks={props.legalLinks}
						isJoinGroupChatView={props.isJoinGroupChatView}
					/>
				</div>
				<div className="sessionInfo__metaInfo">
					<div className="sessionInfo__metaInfo__content">
						{getGroupChatDate(chatItem, true)}
					</div>
					{activeSession.chat.active &&
					chatItem.subscribed &&
					!props.isJoinGroupChatView ? (
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
												<li
													className={
														isCurrentUserModerator &&
														!props.bannedUsers.includes(
															subscriber.username
														) &&
														!subscriber.isModerator
															? 'has-flyout'
															: ''
													}
													key={index}
													onClick={() => {
														if (
															!props.bannedUsers.includes(
																subscriber.username
															)
														) {
															setFlyoutOpenId(
																subscriber._id
															);
														}
													}}
												>
													<span>
														{subscriber.displayName
															? decodeUsername(
																	subscriber.displayName
															  )
															: decodeUsername(
																	subscriber.username
															  )}
													</span>
													{isCurrentUserModerator &&
														!subscriber.isModerator && (
															<FlyoutMenu
																isHidden={props.bannedUsers.includes(
																	subscriber.username
																)}
																position={
																	window.innerWidth <=
																	520
																		? 'left'
																		: 'right'
																}
																isOpen={
																	flyoutOpenId ===
																	subscriber._id
																}
																handleClose={() => {
																	setFlyoutOpenId(
																		null
																	);
																}}
															>
																<BanUser
																	userName={decodeUsername(
																		subscriber.username
																	)}
																	rcUserId={
																		subscriber._id
																	}
																	chatId={
																		activeSession
																			?.chat
																			?.id
																	}
																/>
															</FlyoutMenu>
														)}
													{isCurrentUserModerator &&
														props.bannedUsers.includes(
															subscriber.username
														) && (
															<Tag
																className="bannedUserTag"
																color="red"
																text={translate(
																	'banUser.is.banned'
																)}
															/>
														)}
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
					{hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) && (
						<h3>{displayName || username}</h3>
					)}
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
					) && <h3>{displayName || username}</h3>}
				</div>
				<SessionMenu
					hasUserInitiatedStopOrLeaveRequest={
						props.hasUserInitiatedStopOrLeaveRequest
					}
					isAskerInfoAvailable={isAskerInfoAvailable()}
					legalLinks={props.legalLinks}
				/>
			</div>

			{(hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) ||
				hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData)) && (
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
					{activeSession?.agency && activeSession?.agency.name && (
						<div className="sessionInfo__metaInfo__content">
							{' '}
							{activeSession.agency.name}{' '}
						</div>
					)}
					{activeSession?.agency && (
						<div className="sessionInfo__metaInfo__content">
							{translate('consultant.jobTitle')}
						</div>
					)}
				</div>
			)}
		</div>
	);
};
