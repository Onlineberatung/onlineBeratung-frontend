import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import {
	AUTHORITIES,
	SessionTypeContext,
	UserDataContext,
	getContact,
	hasUserAuthority,
	useConsultingType
} from '../../../globalState';
import { useSearchParam } from '../../../hooks/useSearchParams';
import {
	SESSION_LIST_TAB,
	SESSION_LIST_TYPES,
	getViewPathForType,
	isUserModerator
} from '../../session/sessionHelpers';
import { isMobile } from 'react-device-detect';
import { mobileListView } from '../../app/navigationHandler';
import { BackIcon, CameraOnIcon } from '../../../resources/img/icons';
import { ReactComponent as VideoCallIcon } from '../../../resources/img/illustrations/camera.svg';
import { ActiveSessionContext } from '../../../globalState/provider/ActiveSessionProvider';
import { SessionMenu } from '../../sessionMenu/SessionMenu';
import { useTranslation } from 'react-i18next';
import { getGroupChatDate } from '../../session/sessionDateHelpers';
import { getValueFromCookie } from '../../sessionCookie/accessSessionCookie';
import { apiGetGroupMembers } from '../../../api';
import { decodeUsername } from '../../../utils/encryptionHelpers';
import { FlyoutMenu } from '../../flyoutMenu/FlyoutMenu';
import { BanUser } from '../../banUser/BanUser';
import { Tag } from '../../tag/Tag';
import { BUTTON_TYPES, Button, ButtonItem } from '../../button/Button';
import { useStartVideoCall } from './useStartVideoCall';
import { useAppConfig } from '../../../hooks/useAppConfig';

interface GroupChatHeaderProps {
	hasUserInitiatedStopOrLeaveRequest: React.MutableRefObject<boolean>;
	isJoinGroupChatView: boolean;
	bannedUsers: string[];
}

export const GroupChatHeader = ({
	hasUserInitiatedStopOrLeaveRequest,
	isJoinGroupChatView,
	bannedUsers
}: GroupChatHeaderProps) => {
	const { releaseToggles } = useAppConfig();
	const [subscriberList, setSubscriberList] = useState([]);
	const { t } = useTranslation(['common', 'consultingTypes', 'agencies']);
	const { activeSession } = useContext(ActiveSessionContext);
	const { userData } = useContext(UserDataContext);
	const { type, path: listPath } = useContext(SessionTypeContext);
	const sessionListTab = useSearchParam<SESSION_LIST_TAB>('sessionListTab');
	const sessionView = getViewPathForType(type);
	const consultingType = useConsultingType(activeSession.item.consultingType);
	const [flyoutOpenId, setFlyoutOpenId] = useState('');
	const isConsultant = hasUserAuthority(
		AUTHORITIES.CONSULTANT_DEFAULT,
		userData
	);
	const { startVideoCall } = useStartVideoCall();

	const sessionTabPath = `${
		sessionListTab ? `?sessionListTab=${sessionListTab}` : ''
	}`;

	const isCurrentUserModerator = isUserModerator({
		chatItem: activeSession.item,
		rcUserId: getValueFromCookie('rc_uid')
	});

	const userSessionData = getContact(
		activeSession,
		t('sessionList.user.consultantUnknown')
	).sessionData;
	const isAskerInfoAvailable = () =>
		!hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) &&
		consultingType?.showAskerProfile &&
		activeSession.isSession &&
		!activeSession.isLive &&
		((type === SESSION_LIST_TYPES.ENQUIRY &&
			Object.entries(userSessionData).length !== 0) ||
			SESSION_LIST_TYPES.ENQUIRY !== type);

	const [isSubscriberFlyoutOpen, setIsSubscriberFlyoutOpen] = useState(false);

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

	const StartButtonIcon = isMobile ? VideoCallIcon : CameraOnIcon;
	const buttonStartVideoCall: ButtonItem = {
		type: BUTTON_TYPES.SMALL_ICON,
		title: t('videoCall.button.startVideoCall'),
		smallIconBackgroundColor: isMobile ? 'transparent' : 'green',
		icon: (
			<StartButtonIcon
				title={t('videoCall.button.startVideoCall')}
				aria-label={t('videoCall.button.startVideoCall')}
				fillOpacity={isMobile ? 0.9 : 1}
			/>
		)
	};

	return (
		<div className="sessionInfo">
			<div className="sessionInfo__headerWrapper">
				<Link
					to={listPath + sessionTabPath}
					onClick={mobileListView}
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
							to={`/sessions/consultant/${sessionView}/${activeSession.item.groupId}/${activeSession.item.id}/groupChatInfo${sessionTabPath}`}
						>
							<h3>{activeSession.item.topic}</h3>
						</Link>
					) : (
						<h3>{activeSession.item.topic}</h3>
					)}
				</div>

				{isConsultant && releaseToggles.featureVideoGroupChatsEnabled && (
					<div
						className="sessionInfo__videoCallButtons"
						data-cy="session-header-video-call-buttons"
					>
						<Button
							buttonHandle={() => startVideoCall()}
							item={buttonStartVideoCall}
						/>
					</div>
				)}

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
						t('sessionList.time.label.postfix'),
						true
					)}
				</div>
				{activeSession.item.active &&
					activeSession.item.subscribed &&
					!isJoinGroupChatView && (
						<div
							className="sessionInfo__metaInfo__content sessionInfo__metaInfo__content--clickable"
							id="subscriberButton"
							onClick={(e) => handleFlyout(e)}
						>
							{t('groupChat.active.sessionInfo.subscriber')}
							{isSubscriberFlyoutOpen && (
								<div className="sessionInfo__metaInfo__flyout">
									<ul>
										{subscriberList.map(
											(subscriber, index) => (
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
														{decodeUsername(
															subscriber.displayName ||
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
																handleClose={() =>
																	setFlyoutOpenId(
																		null
																	)
																}
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
														bannedUsers.includes(
															subscriber.username
														) && (
															<Tag
																className="bannedUserTag"
																color="red"
																text={t(
																	'banUser.is.banned'
																)}
															/>
														)}
												</li>
											)
										)}
									</ul>
								</div>
							)}
						</div>
					)}
			</div>
		</div>
	);
};
