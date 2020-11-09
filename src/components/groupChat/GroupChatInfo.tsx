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
import { translate } from '../../resources/scripts/i18n/translate';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import {
	OVERLAY_FUNCTIONS,
	OverlayWrapper,
	Overlay,
	OverlayItem
} from '../overlay/Overlay';
import {
	getGroupMembers,
	ajaxCallPutGroupChat,
	GROUP_CHAT_API
} from '../apiWrapper';
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
	mobileDetailView
} from '../app/navigationHandler';
import { decodeUsername } from '../../resources/scripts/helpers/encryptionHelpers';

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
	const [subscriberList, setSubscriberList] = useState([]); //TO-DO: CHECK IF THIS IS STILL WORKING -> was null before
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
			ajaxCallPutGroupChat(chatItem.id, GROUP_CHAT_API.STOP)
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
		getGroupMembers(chatItem.id)
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
					<div className="profile__icon profile__icon--chatInfo">
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
						<p className="profile__content__title">
							{translate('groupChat.info.subscribers.headline')}
						</p>
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
						<p className="profile__content__title">
							{translate('groupChat.info.settings.headline')}
						</p>
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
									buttonHandle={() => {}}
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
