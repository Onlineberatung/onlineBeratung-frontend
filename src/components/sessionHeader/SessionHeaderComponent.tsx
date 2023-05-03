import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { handleNumericTranslation } from '../../utils/translate';
import { mobileListView } from '../app/navigationHandler';
import {
	AUTHORITIES,
	getContact,
	hasUserAuthority,
	SessionConsultantInterface,
	SessionTypeContext,
	useConsultingType,
	UserDataContext
} from '../../globalState';
import {
	getViewPathForType,
	isUserModerator,
	SESSION_LIST_TAB,
	SESSION_LIST_TYPES
} from '../session/sessionHelpers';
import { SessionMenu } from '../sessionMenu/SessionMenu';
import { convertUserDataObjectToArray } from '../profile/profileHelpers';
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
import { useSearchParam } from '../../hooks/useSearchParams';
import { useTranslation } from 'react-i18next';

export interface SessionHeaderProps {
	consultantAbsent?: SessionConsultantInterface;
	hasUserInitiatedStopOrLeaveRequest?: React.MutableRefObject<boolean>;
	isJoinGroupChatView?: boolean;
	bannedUsers: string[];
}

export const SessionHeaderComponent = (props: SessionHeaderProps) => {
	const { t: translate } = useTranslation([
		'common',
		'consultingTypes',
		'agencies'
	]);
	const { activeSession } = useContext(ActiveSessionContext);
	const { userData } = useContext(UserDataContext);
	const consultingType = useConsultingType(activeSession.item.consultingType);
	const [flyoutOpenId, setFlyoutOpenId] = useState('');

	const username = getContact(
		activeSession,
		translate('sessionList.user.consultantUnknown')
	).username;
	const displayName = getContact(
		activeSession,
		translate('sessionList.user.consultantUnknown')
	).displayName;
	const userSessionData = getContact(
		activeSession,
		translate('sessionList.user.consultantUnknown')
	).sessionData;
	const preparedUserSessionData =
		hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) &&
		userSessionData &&
		!activeSession.isLive
			? convertUserDataObjectToArray(userSessionData)
			: null;
	const translateBase =
		activeSession.item.consultingType === 0
			? 'user.userAddiction'
			: 'user.userU25';

	const [isSubscriberFlyoutOpen, setIsSubscriberFlyoutOpen] = useState(false);
	const [subscriberList, setSubscriberList] = useState([]);
	const sessionListTab = useSearchParam<SESSION_LIST_TAB>('sessionListTab');
	const getSessionListTab = () =>
		`${sessionListTab ? `?sessionListTab=${sessionListTab}` : ''}`;
	const { type, path: listPath } = useContext(SessionTypeContext);

	useEffect(() => {
		if (isSubscriberFlyoutOpen) {
			document.addEventListener('mousedown', (event) =>
				handleWindowClick(event)
			);
		}
	}, [isSubscriberFlyoutOpen]);

	const sessionView = getViewPathForType(type);
	const userProfileLink = `/sessions/consultant/${sessionView}/${
		activeSession.item.groupId
	}/${activeSession.item.id}/userProfile${getSessionListTab()}`;

	const handleBackButton = () => {
		mobileListView();
	};

	const handleFlyout = (e) => {
		if (!isSubscriberFlyoutOpen) {
			apiGetGroupMembers(activeSession.item.id)
				.then((response) => {
					const subscribers = response.members.map((member) => ({
						isModerator: isUserModerator({
							chatItem: activeSession.item,
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
		chatItem: activeSession.item,
		rcUserId: getValueFromCookie('rc_uid')
	});

	const isAskerInfoAvailable = () =>
		!hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) &&
		consultingType?.showAskerProfile &&
		activeSession.isSession &&
		!activeSession.isLive &&
		((type === SESSION_LIST_TYPES.ENQUIRY &&
			Object.entries(userSessionData).length !== 0) ||
			SESSION_LIST_TYPES.ENQUIRY !== type);

	if (activeSession.isGroup) {
		return (
			<div className="sessionInfo">
				<div className="sessionInfo__headerWrapper">
					<Link
						to={listPath + getSessionListTab()}
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
									activeSession.item.groupId
								}/${
									activeSession.item.id
								}/groupChatInfo${getSessionListTab()}`}
							>
								<h3>{activeSession.item.topic}</h3>
							</Link>
						) : (
							<h3>{activeSession.item.topic}</h3>
						)}
					</div>
					<SessionMenu
						hasUserInitiatedStopOrLeaveRequest={
							props.hasUserInitiatedStopOrLeaveRequest
						}
						isAskerInfoAvailable={isAskerInfoAvailable()}
						isJoinGroupChatView={props.isJoinGroupChatView}
					/>
				</div>
				<div className="sessionInfo__metaInfo">
					<div className="sessionInfo__metaInfo__content">
						{getGroupChatDate(
							activeSession.item,
							translate('sessionList.time.label.postfix'),
							true
						)}
					</div>
					{activeSession.item.active &&
					activeSession.item.subscribed &&
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
																			.item
																			.id
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

	if (activeSession.isFeedback) {
		return (
			<div className="sessionInfo">
				<div className="sessionInfo__feedbackHeaderWrapper">
					<Link
						to={{
							pathname: `${listPath}/${activeSession.item.groupId}
							/${activeSession.item.id}`,
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
					to={listPath + getSessionListTab()}
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
				/>
			</div>

			{(hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) ||
				hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData)) && (
				<div className="sessionInfo__metaInfo">
					{!activeSession.agency ? (
						<div className="sessionInfo__metaInfo__content">
							{consultingType
								? translate(
										[
											`consultingType.${consultingType.id}.titles.short`,
											consultingType.titles.short
										],
										{ ns: 'consultingTypes' }
								  )
								: ''}
						</div>
					) : null}
					{preparedUserSessionData
						? preparedUserSessionData.map((item, index) =>
								item.value &&
								!(
									item.type === 'age' && item.value === 'null'
								) ? (
									<div
										className="sessionInfo__metaInfo__content"
										key={index}
									>
										{translate(
											handleNumericTranslation(
												translateBase,
												item.type,
												item.value
											)
										)}
									</div>
								) : null
						  )
						: null}
					{activeSession.agency?.name && (
						<div className="sessionInfo__metaInfo__content">
							{' '}
							{translate(
								[
									`agency.${activeSession.agency.id}.name`,
									activeSession.agency.name
								],
								{ ns: 'agencies' }
							)}{' '}
						</div>
					)}
					{activeSession.agency && (
						<div className="sessionInfo__metaInfo__content">
							{translate('consultant.jobTitle')}
						</div>
					)}
				</div>
			)}
		</div>
	);
};
