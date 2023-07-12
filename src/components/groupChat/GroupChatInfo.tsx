import * as React from 'react';
import { useEffect, useContext, useState, useCallback } from 'react';
import { Link, Redirect, useParams, useHistory } from 'react-router-dom';
import {
	SessionTypeContext,
	UserDataContext,
	useTenant
} from '../../globalState';
import { isUserModerator, SESSION_LIST_TAB } from '../session/sessionHelpers';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import { OVERLAY_FUNCTIONS, Overlay, OverlayItem } from '../overlay/Overlay';
import {
	apiGetGroupChatInfo,
	apiGetGroupMembers,
	apiPutGroupChat,
	GROUP_CHAT_API
} from '../../api';
import { isGroupChatOwner } from './groupChatHelpers';
import { getGroupChatDate } from '../session/sessionDateHelpers';
import { durationSelectOptionsSet } from './createChatHelpers';
import {
	groupChatErrorOverlayItem,
	stopGroupChatSecurityOverlayItem,
	stopGroupChatSuccessOverlayItem
} from '../sessionMenu/sessionMenuHelpers';
import { logout } from '../logout/logout';
import {
	mobileListView,
	mobileDetailView,
	desktopView
} from '../app/navigationHandler';
import { decodeUsername } from '../../utils/encryptionHelpers';
import { ReactComponent as BackIcon } from '../../resources/img/icons/arrow-left.svg';
import { ReactComponent as GroupChatIcon } from '../../resources/img/icons/speech-bubble.svg';
import '../profile/profile.styles';
import { Text } from '../text/Text';
import { FlyoutMenu } from '../flyoutMenu/FlyoutMenu';
import { getValueFromCookie } from '../sessionCookie/accessSessionCookie';
import { BanUser, BanUserOverlay } from '../banUser/BanUser';
import { useResponsive } from '../../hooks/useResponsive';
import { Tag } from '../tag/Tag';
import { useSession } from '../../hooks/useSession';
import { useSearchParam } from '../../hooks/useSearchParams';
import { GroupChatCopyLinks } from './GroupChatCopyLinks';
import { useTranslation } from 'react-i18next';

export const GroupChatInfo = () => {
	const { t: translate } = useTranslation();
	const history = useHistory();
	const tenantData = useTenant();
	const { rcGroupId: groupIdFromParam } = useParams<{ rcGroupId: string }>();
	const featureGroupChatV2Enabled =
		tenantData?.settings?.featureGroupChatV2Enabled;

	const stopChatButtonSet: ButtonItem = {
		label: translate('groupChat.stopChat.securityOverlay.button1Label'),
		function: OVERLAY_FUNCTIONS.CLOSE,
		type: BUTTON_TYPES.PRIMARY
	};

	const { userData } = useContext(UserDataContext);
	const { path: listPath } = useContext(SessionTypeContext);

	const [subscriberList, setSubscriberList] = useState(null);
	const [overlayItem, setOverlayItem] = useState<OverlayItem>(null);
	const [overlayActive, setOverlayActive] = useState(false);
	const [redirectToSessionsList, setRedirectToSessionsList] = useState(false);
	const [isUserBanOverlayOpen, setIsUserBanOverlayOpen] =
		useState<boolean>(false);
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);
	const [bannedUsers, setBannedUsers] = useState<string[]>([]);
	const [isV2GroupChat, setIsV2GroupChat] = useState<boolean>(true);

	const { session: activeSession, ready } = useSession(groupIdFromParam);
	const sessionListTab = useSearchParam<SESSION_LIST_TAB>('sessionListTab');

	const getSessionListTab = () =>
		`${sessionListTab ? `?sessionListTab=${sessionListTab}` : ''}`;

	const { fromL } = useResponsive();
	useEffect(() => {
		if (!fromL) {
			mobileDetailView();
			return () => {
				mobileListView();
			};
		}
		desktopView();
	}, [fromL]);

	useEffect(() => {
		if (!ready) {
			return;
		}

		if (!activeSession) {
			history.push(
				listPath +
					(sessionListTab ? `?sessionListTab=${sessionListTab}` : '')
			);
			return;
		}

		if (activeSession.item.active) {
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
				})
				.catch((error) => {
					console.log('error', error);
				});
			apiGetGroupChatInfo(activeSession.item.id).then((response) => {
				if (response.bannedUsers) {
					const decryptedBannedUsers =
						response.bannedUsers.map(decodeUsername);
					setBannedUsers(decryptedBannedUsers);
				} else {
					setBannedUsers([]);
				}
			});
		}

		if (activeSession.isGroup && !activeSession.item.consultingType) {
			setIsV2GroupChat(true);
		}
	}, [activeSession, history, listPath, ready, sessionListTab]);

	const handleStopGroupChatButton = () => {
		setOverlayItem(stopGroupChatSecurityOverlayItem);
		setOverlayActive(true);
	};

	const handleOverlayAction = (buttonFunction: string) => {
		if (isRequestInProgress) {
			return null;
		}
		setIsRequestInProgress(true);
		if (buttonFunction === OVERLAY_FUNCTIONS.CLOSE) {
			setOverlayActive(false);
			setOverlayItem({});
			setIsRequestInProgress(false);
		} else if (buttonFunction === OVERLAY_FUNCTIONS.STOP_GROUP_CHAT) {
			apiPutGroupChat(activeSession.item.id, GROUP_CHAT_API.STOP)
				.then(() => {
					setOverlayItem(stopGroupChatSuccessOverlayItem);
				})
				.catch(() => {
					setOverlayItem(groupChatErrorOverlayItem);
				})
				.finally(() => {
					setIsRequestInProgress(false);
				});
		} else if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECT) {
			setRedirectToSessionsList(true);
		} else if (buttonFunction === OVERLAY_FUNCTIONS.LOGOUT) {
			logout();
		}
	};

	const getDurationTranslation = useCallback(
		() =>
			durationSelectOptionsSet
				.map((option) => ({
					...option,
					label: translate(option.label)
				}))
				.filter(
					(item) =>
						parseInt(item.value) === activeSession.item.duration
				)[0].label,
		[activeSession?.item.duration, translate]
	);

	if (!activeSession) return null;

	const preparedSettings: Array<{ label; value }> = [
		{
			label: translate('groupChat.info.settings.topic'),
			value: activeSession.item.topic
		},
		{
			label: translate('groupChat.info.settings.startDate'),
			value: getGroupChatDate(
				activeSession.item,
				translate('sessionList.time.label.postfix'),
				false,
				true
			)
		},
		{
			label: translate('groupChat.info.settings.startTime'),
			value: getGroupChatDate(
				activeSession.item,
				translate('sessionList.time.label.postfix'),
				false,
				false,
				true
			)
		},
		{
			label: translate('groupChat.info.settings.duration'),
			value: getDurationTranslation()
		},
		{
			label: translate('groupChat.info.settings.repetition.label'),
			value: activeSession.item.repetitive
				? translate('groupChat.info.settings.repetition.weekly')
				: translate('groupChat.info.settings.repetition.single')
		}
	];

	if (redirectToSessionsList) {
		return <Redirect to={listPath + getSessionListTab()} />;
	}

	const isCurrentUserModerator = isUserModerator({
		chatItem: activeSession.item,
		rcUserId: getValueFromCookie('rc_uid')
	});

	return (
		<div className="profile__wrapper">
			<div className="profile__header">
				<div className="profile__header__wrapper">
					<Link
						to={`${listPath}/${activeSession.item.groupId}/${
							activeSession.item.id
						}${getSessionListTab()}`}
						className="profile__header__backButton"
					>
						<BackIcon />
					</Link>
					<h3 className="profile__header__title profile__header__title--withBackButton">
						{translate('groupChat.info.headline')}
					</h3>
				</div>
				<div className="profile__header__metaInfo">
					<p className="profile__header__username profile__header__username--withBackButton">
						{activeSession.item.topic}
					</p>
				</div>
			</div>
			<div className="profile__innerWrapper">
				<div className="profile__user">
					<div className="profile__icon">
						<GroupChatIcon className="profile__icon--chatInfo" />
						{activeSession.item.active ? (
							<span className="profile__icon--active"></span>
						) : null}
					</div>
					<h2>{activeSession.item.topic}</h2>
				</div>
				{activeSession.item.active && activeSession.item.subscribed ? (
					<div className="profile__innerWrapper__stopButton">
						<Button
							item={stopChatButtonSet}
							buttonHandle={handleStopGroupChatButton}
						/>
					</div>
				) : null}
				<div className="profile__content">
					<div className="profile__content__item profile__data">
						<Text
							text={translate(
								'groupChat.info.subscribers.headline'
							)}
							type="divider"
						/>

						{featureGroupChatV2Enabled && isV2GroupChat && (
							<div className="profile__groupChatContainer">
								<GroupChatCopyLinks
									id={activeSession.item.groupId}
									groupChatId={activeSession.item.id.toString()}
								/>
							</div>
						)}
						{subscriberList ? (
							subscriberList.map((subscriber, index) => (
								<div
									className="profile__data__item"
									key={index}
								>
									<div className="profile__data__content profile__data__content--subscriber">
										{subscriber.displayName
											? decodeUsername(
													subscriber.displayName
											  )
											: decodeUsername(
													subscriber.username
											  )}
										{isCurrentUserModerator &&
											!subscriber.isModerator && (
												<>
													<FlyoutMenu
														isHidden={bannedUsers.includes(
															subscriber.username
														)}
														position={
															window.innerWidth <=
															900
																? 'left'
																: 'right'
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
																	.item.id
															}
															handleUserBan={(
																username
															) => {
																setBannedUsers([
																	...bannedUsers,
																	username
																]);
																setIsUserBanOverlayOpen(
																	true
																);
															}}
														/>
													</FlyoutMenu>{' '}
													<BanUserOverlay
														overlayActive={
															isUserBanOverlayOpen
														}
														userName={decodeUsername(
															subscriber.username
														)}
														handleOverlay={() => {
															setIsUserBanOverlayOpen(
																false
															);
														}}
													></BanUserOverlay>
												</>
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
									</div>
								</div>
							))
						) : (
							<div className="profile__data__item">
								<p className="profile__data__content profile__data__content--empty">
									{translate(
										'groupChat.info.subscribers.empty'
									)}
								</p>
							</div>
						)}
					</div>

					<div className="profile__content__item profile__data">
						<Text
							text={translate('groupChat.info.settings.headline')}
							type="divider"
						/>
						{preparedSettings.map((item, index) => (
							<div className="profile__data__item" key={index}>
								<p className="profile__data__label">
									{item.label}
								</p>
								<p className="profile__data__content">
									{item.value}
								</p>
							</div>
						))}
						{isGroupChatOwner(activeSession, userData) &&
						!activeSession.item.active ? (
							<Link
								className="profile__innerWrapper__editButton"
								to={{
									pathname: `${listPath}/${
										activeSession.item.groupId
									}/${
										activeSession.item.id
									}/editGroupChat${getSessionListTab()}`,
									state: {
										isEditMode: true,
										prevIsInfoPage: true
									}
								}}
							>
								<Button
									item={{
										label: translate(
											'groupChat.info.settings.edit'
										),
										type: 'LINK',
										id: 'editGroupChat'
									}}
									isLink={true}
								/>
							</Link>
						) : null}
					</div>
				</div>
			</div>
			{overlayActive ? (
				<Overlay
					item={overlayItem}
					handleOverlay={handleOverlayAction}
				/>
			) : null}
		</div>
	);
};
