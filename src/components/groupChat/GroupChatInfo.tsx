import * as React from 'react';
import { useEffect, useContext, useState } from 'react';
import {
	UserDataContext,
	ActiveSessionGroupIdContext,
	getActiveSession,
	SessionsDataContext,
	StoppedGroupChatContext
} from '../../globalState';
import {
	getChatItemForSession,
	getSessionListPathForLocation
} from '../session/sessionHelpers';
import { Link, Redirect } from 'react-router-dom';
import { translate } from '../../utils/translate';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import {
	OVERLAY_FUNCTIONS,
	OverlayWrapper,
	Overlay,
	OverlayItem
} from '../overlay/Overlay';
import { apiGetGroupMembers, apiPutGroupChat, GROUP_CHAT_API } from '../../api';
import { isGroupChatOwner } from './groupChatHelpers';
import { getGroupChatDate } from '../session/sessionDateHelpers';
import { durationSelectOptionsSet } from './createChatHelpers';
import {
	groupChatErrorOverlayItem,
	stopGroupChatSecurityOverlayItem,
	stopGroupChatSuccessOverlayItem
} from '../sessionMenu/sessionMenuHelpers';
import { logout } from '../logout/logout';
import { mobileListView, mobileDetailView } from '../app/navigationHandler';
import { decodeUsername } from '../../utils/encryptionHelpers';
import { ReactComponent as BackIcon } from '../../resources/img/icons/arrow-left.svg';
import { ReactComponent as GroupChatIcon } from '../../resources/img/icons/speech-bubble.svg';
import '../profile/profile.styles';
import { Text } from '../text/Text';

const stopChatButtonSet: ButtonItem = {
	label: translate('groupChat.stopChat.securityOverlay.button1Label'),
	function: OVERLAY_FUNCTIONS.CLOSE,
	type: BUTTON_TYPES.PRIMARY
};

export const GroupChatInfo = () => {
	const { userData } = useContext(UserDataContext);
	const { sessionsData } = useContext(SessionsDataContext);
	const { activeSessionGroupId, setActiveSessionGroupId } = useContext(
		ActiveSessionGroupIdContext
	);
	const activeSession = getActiveSession(activeSessionGroupId, sessionsData);
	const [subscriberList, setSubscriberList] = useState(null);
	const chatItem = getChatItemForSession(activeSession);
	const [overlayItem, setOverlayItem] = useState<OverlayItem>(null);
	const [overlayActive, setOverlayActive] = useState(false);
	const { setStoppedGroupChat } = useContext(StoppedGroupChatContext);
	const [redirectToSessionsList, setRedirectToSessionsList] = useState(false);
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);

	useEffect(() => {
		mobileDetailView();
		if (chatItem.active) {
			getSubscriberList();
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

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
			apiPutGroupChat(chatItem.id, GROUP_CHAT_API.STOP)
				.then(() => {
					setOverlayItem(stopGroupChatSuccessOverlayItem);
					setIsRequestInProgress(false);
				})
				.catch(() => {
					setOverlayItem(groupChatErrorOverlayItem);
					setIsRequestInProgress(false);
				});
		} else if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECT) {
			setRedirectToSessionsList(true);
			setStoppedGroupChat(true);
		} else if (buttonFunction === OVERLAY_FUNCTIONS.LOGOUT) {
			logout();
		}
	};

	const getSubscriberList = () => {
		apiGetGroupMembers(chatItem.id)
			.then((response) => {
				const subscribers = response.members.map(
					(member) => member.username
				);
				setSubscriberList(subscribers);
			})
			.catch((error) => {
				console.log('error', error);
			});
	};

	const getDurationTranslation = () =>
		durationSelectOptionsSet.filter(
			(item) => parseInt(item.value) === chatItem.duration
		)[0].label;
	const preparedSettings: Array<{ label; value }> = [
		{
			label: translate('groupChat.info.settings.topic'),
			value: chatItem.topic
		},
		{
			label: translate('groupChat.info.settings.startDate'),
			value: getGroupChatDate(chatItem, false, true)
		},
		{
			label: translate('groupChat.info.settings.startTime'),
			value: getGroupChatDate(chatItem, false, false, true)
		},
		{
			label: translate('groupChat.info.settings.duration'),
			value: getDurationTranslation()
		},
		{
			label: translate('groupChat.info.settings.repetition'),
			value: chatItem.repetitive
				? translate('groupChat.info.settings.repetition.weekly')
				: translate('groupChat.info.settings.repetition.single')
		}
	];

	if (redirectToSessionsList) {
		mobileListView();
		setActiveSessionGroupId(null);
		return <Redirect to={getSessionListPathForLocation()} />;
	}

	return (
		<div className="profile__wrapper">
			<div className="profile__header">
				<div className="profile__header__wrapper">
					<Link
						to={`${getSessionListPathForLocation()}/${
							chatItem.groupId
						}/${chatItem.id}`}
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
						{chatItem.topic}
					</p>
				</div>
			</div>
			<div className="profile__innerWrapper">
				<div className="profile__user">
					<div className="profile__icon">
						<GroupChatIcon className="profile__icon--chatInfo" />
						{chatItem.active ? (
							<span className="profile__icon--active"></span>
						) : null}
					</div>
					<h2>{chatItem.topic}</h2>
				</div>
				{chatItem.active && chatItem.subscribed ? (
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
						{subscriberList ? (
							subscriberList.map((subscriber, index) => (
								<div
									className="profile__data__item"
									key={index}
								>
									<p className="profile__data__content">
										{decodeUsername(subscriber)}
									</p>
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
						!chatItem.active ? (
							<Link
								className="profile__innerWrapper__editButton"
								to={{
									pathname: `${getSessionListPathForLocation()}/${
										chatItem.groupId
									}/${chatItem.id}/editGroupChat`,
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
