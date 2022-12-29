import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
	AUTHORITIES,
	getContact,
	hasUserAuthority,
	SessionTypeContext,
	useConsultingType,
	UserDataContext
} from '../../globalState';
import { SessionMenu } from '../sessionMenu/SessionMenu';
import { getGroupChatDate } from '../session/sessionDateHelpers';
import { decodeUsername } from '../../utils/encryptionHelpers';
import { FlyoutMenu } from '../flyoutMenu/FlyoutMenu';
import { BanUser } from '../banUser/BanUser';
import { Tag } from '../tag/Tag';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';
import { ReactComponent as BackIcon } from '../../resources/img/icons/arrow-left.svg';
import { apiGetGroupMembers } from '../../api';
import {
	getViewPathForType,
	isUserModerator,
	SESSION_LIST_TAB,
	SESSION_LIST_TYPES
} from '../session/sessionHelpers';
import { getValueFromCookie } from '../sessionCookie/accessSessionCookie';
import { mobileListView } from '../app/navigationHandler';
import { useSearchParam } from '../../hooks/useSearchParams';

export const SessionGroupHeader = ({
	hasUserInitiatedStopOrLeaveRequest,
	isJoinGroupChatView,
	bannedUsers
}: {
	hasUserInitiatedStopOrLeaveRequest?: React.MutableRefObject<boolean>;
	isJoinGroupChatView?: boolean;
	bannedUsers: string[];
}) => {
	const { t: translate } = useTranslation([
		'common',
		'consultingTypes',
		'agencies'
	]);
	const sessionListTab = useSearchParam<SESSION_LIST_TAB>('sessionListTab');

	const { activeSession } = useContext(ActiveSessionContext);
	const consultingType = useConsultingType(activeSession.item.consultingType);
	const { userData } = useContext(UserDataContext);
	const { type, path: listPath } = useContext(SessionTypeContext);

	const [subscriberList, setSubscriberList] = useState([]);
	const [flyoutOpenId, setFlyoutOpenId] = useState('');
	const [isSubscriberFlyoutOpen, setIsSubscriberFlyoutOpen] = useState(false);

	const getSessionListTab = () =>
		`${sessionListTab ? `?sessionListTab=${sessionListTab}` : ''}`;

	useEffect(() => {
		if (isSubscriberFlyoutOpen) {
			document.addEventListener('mousedown', (event) =>
				handleWindowClick(event)
			);
		}
	}, [isSubscriberFlyoutOpen]);

	const sessionView = getViewPathForType(type);

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

	const userSessionData = getContact(
		activeSession,
		translate('sessionList.user.consultantUnknown')
	).sessionData;

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

	const handleBackButton = () => {
		mobileListView();
	};

	return (
		<>
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
						hasUserInitiatedStopOrLeaveRequest
					}
					isAskerInfoAvailable={isAskerInfoAvailable()}
					isJoinGroupChatView={isJoinGroupChatView}
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
				!isJoinGroupChatView ? (
					<div
						className="sessionInfo__metaInfo__content sessionInfo__metaInfo__content--clickable"
						id="subscriberButton"
						onClick={(e) => handleFlyout(e)}
					>
						{translate('groupChat.active.sessionInfo.subscriber')}
						{isSubscriberFlyoutOpen ? (
							<div className="sessionInfo__metaInfo__flyout">
								<ul>
									{subscriberList.map((subscriber, index) => (
										<li
											className={
												isCurrentUserModerator &&
												!bannedUsers.includes(
													subscriber.username
												) &&
												!subscriber.isModerator
													? 'has-flyout'
													: ''
											}
											key={index}
											onClick={() => {
												if (
													!bannedUsers.includes(
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
														isHidden={bannedUsers.includes(
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
																	.item.id
															}
														/>
													</FlyoutMenu>
												)}
											{isCurrentUserModerator &&
												bannedUsers.includes(
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
									))}
								</ul>
							</div>
						) : null}
					</div>
				) : null}
			</div>
		</>
	);
};
