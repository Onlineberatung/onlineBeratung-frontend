import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { SessionListEmptyState } from './SessionsListEmptyState';
import {
	typeIsUser,
	typeIsTeamSession,
	typeIsEnquiry,
	SESSION_TYPES,
	getTypeOfLocation,
	getSessionListPathForLocation,
	typeIsSession,
	getChatItemForSession
} from '../../session/ts/sessionHelpers';
import { history } from '../../app/ts/app';
import { translate } from '../../../resources/ts/i18n/translate';
import {
	SessionsDataContext,
	ListItemInterface,
	ActiveSessionGroupIdContext,
	UserDataContext,
	AcceptedGroupIdContext,
	getSessionsDataKeyForSessionType,
	getActiveSession,
	UnreadSessionsStatusContext,
	getUnreadMyMessages,
	AUTHORITIES,
	ACTIVE_SESSION,
	hasUserAuthority,
	StoppedGroupChatContext,
	UserDataInterface
} from '../../../globalState';
import {
	SelectDropdownItem,
	SelectDropdown
} from '../../select/ts/SelectDropdown';
import { FilterStatusContext } from '../../../globalState/provider/FilterStatusProvider';
import { SessionListItemComponent } from '../../sessionsListItem/SessionListItemComponent';
import { SessionsListSkeleton } from '../../sessionsListItem/SessionsListItemSkeleton';
import {
	INITIAL_FILTER,
	SESSION_COUNT,
	ajaxCallGetUserSessions,
	getUserData
} from '../../apiWrapper/ts';
import { FETCH_ERRORS } from '../../apiWrapper/ts/fetchData';
import { getSessions } from './SessionsListData';
import { Button } from '../../button/ts/Button';
import { WelcomeIllustration } from './SessionsListWelcomeIllustration';
import { SessionListCreateChat } from './SessionListCreateChat';
import { mobileListView } from '../../app/ts/navigationHandler';

const MAX_ITEMS_TO_SHOW_WELCOME_ILLUSTRATION = 3;

export const SessionsList = () => {
	let listRef: React.RefObject<HTMLDivElement> = React.createRef();
	const { activeSessionGroupId, setActiveSessionGroupId } = useContext(
		ActiveSessionGroupIdContext
	);
	const sessionsContext = useContext(SessionsDataContext);
	const { sessionsData, setSessionsData } = sessionsContext;
	const { filterStatus, setFilterStatus } = useContext(FilterStatusContext);
	const [hasNoSessions, setHasNoSessions] = useState(false);
	const [loading, setLoading] = useState(true);
	const { userData, setUserData } = useContext(UserDataContext);
	const [currentOffset, setCurrentOffset] = useState(0);
	const [totalItems, setTotalItems] = useState(0);
	const { acceptedGroupId, setAcceptedGroupId } = useContext(
		AcceptedGroupIdContext
	);
	const [stopAutoLoad, setStopAutoLoad] = useState(false);
	const [loadingWithOffset, setLoadingWithOffset] = useState(false);
	const [isReloadButtonVisible, setIsReloadButtonVisible] = useState(false);
	const { unreadSessionsStatus, setUnreadSessionsStatus } = useContext(
		UnreadSessionsStatusContext
	);
	const [isActiveSessionCreateChat, setIsActiveSessionCreateChat] = useState(
		false
	);
	const [
		increaseOffsetForAcceptedGroup,
		setIncreaseOffsetForAcceptedGroup
	] = useState(false);
	const { stoppedGroupChat, setStoppedGroupChat } = useContext(
		StoppedGroupChatContext
	);

	let type = getTypeOfLocation();

	useEffect(() => {
		setAcceptedGroupId(null);
		if (!showFilter) {
			setFilterStatus(INITIAL_FILTER);
		}
		if (typeIsUser(type)) {
			resetActiveSession();
			fetchUserData(acceptedGroupId, true);
		}
	}, []);

	const activeCreateChat =
		activeSessionGroupId === ACTIVE_SESSION.CREATE_CHAT;
	useEffect(() => {
		if (typeIsUser(type) && acceptedGroupId) {
			fetchUserData(acceptedGroupId);
			setAcceptedGroupId(null);
			setActiveSessionGroupId(null);
		}

		if (
			!hasUserAuthority(AUTHORITIES.USER_DEFAULT, userData) &&
			hasUserAuthority(AUTHORITIES.CREATE_NEW_CHAT, userData)
		) {
			if (activeCreateChat) {
				setIsActiveSessionCreateChat(true);
			} else if (!activeSessionGroupId && isActiveSessionCreateChat) {
				mobileListView();
				setIsActiveSessionCreateChat(false);
				getSessionsListData().catch(() => {});
			}
		}
	});

	useEffect(() => {
		if (acceptedGroupId) {
			setCurrentOffset(0);
			if (acceptedGroupId != 'CLOSE' && !stopAutoLoad) {
				type = SESSION_TYPES.MY_SESSION;
				getSessions(
					sessionsContext,
					type,
					getOffsetToUse(increaseOffsetForAcceptedGroup),
					getFilterToUse()
				)
					.then((fetchedSessions) => {
						let checkSessions = {
							mySessions: fetchedSessions.sessions
						};
						const assignedSession = getActiveSession(
							acceptedGroupId,
							checkSessions
						);
						if (assignedSession) {
							setIncreaseOffsetForAcceptedGroup(false);
							setAssignedSessionActive(assignedSession);
							setStopAutoLoad(false);
						} else {
							getSessionsListData(true)
								.then(
									(fetchedSessions: ListItemInterface[]) => {
										const newSessions: ListItemInterface[] = [
											...sessionsData[
												getSessionsDataKeyForSessionType(
													type
												)
											],
											...fetchedSessions
										];
										let checkSessions = {
											mySessions: newSessions
										};
										const assignedSession = getActiveSession(
											acceptedGroupId,
											checkSessions
										);
										if (assignedSession) {
											setAssignedSessionActive(
												assignedSession
											);
											setStopAutoLoad(false);
										}

										setIncreaseOffsetForAcceptedGroup(true);
										setAcceptedGroupId(acceptedGroupId);
									}
								)
								.catch(() => {});
						}
					})
					.catch(() => {});
			} else if (acceptedGroupId === 'CLOSE') {
				getSessionsListData()
					.then(() => {
						history.push(getSessionListPathForLocation());
						setAcceptedGroupId(null);
					})
					.catch(() => {});
			}
		}
	}, [acceptedGroupId]);

	useEffect(() => {
		if (!typeIsUser(type)) {
			setActiveSessionGroupId(null);
			getSessionsListData().catch(() => {});
		}
	}, [filterStatus]);

	const didUnreadStatusChange = () =>
		unreadSessionsStatus.mySessions != getUnreadMyMessages(sessionsData);
	useEffect(() => {
		if (sessionsData && sessionsData.mySessions) {
			if (didUnreadStatusChange) {
				setUnreadSessionsStatus({
					...unreadSessionsStatus,
					mySessions: getUnreadMyMessages(sessionsData),
					newDirectMessage: false
				});
			}
		}
	}, [sessionsData]);

	useEffect(() => {
		if (
			sessionsData &&
			unreadSessionsStatus &&
			unreadSessionsStatus.newDirectMessage
		) {
			if (typeIsUser(type)) {
				fetchUserData();
			} else {
				getSessionsListData().catch(() => {});
			}
		}
	}, [unreadSessionsStatus]);

	useEffect(() => {
		if (stoppedGroupChat) {
			if (!typeIsUser(type)) {
				getSessionsListData().catch(() => {});
			} else {
				fetchUserData();
			}
			setStoppedGroupChat(false);
		}
	}, [stoppedGroupChat]);

	const setAssignedSessionActive = (assignedSession) => {
		setStopAutoLoad(true);
		const chatItem = getChatItemForSession(assignedSession);
		history.push(
			`/sessions/consultant/sessionView/${chatItem.groupId}/${chatItem.id}`
		);
		const activeItem = document.querySelector('.sessionsListItem--active');
		if (activeItem) {
			activeItem.scrollIntoView(true);
			const wrapper = document.querySelector(
				'.sessionsList__itemsWrapper'
			);
			const firstItemId = document.querySelector('.sessionsListItem')
				? document
						.querySelector('.sessionsListItem')
						.getAttribute('data-group-id')
				: null;
			const lastItemId = wrapper.lastElementChild.querySelector(
				'.sessionsListItem'
			)
				? wrapper.lastElementChild
						.querySelector('.sessionsListItem')
						.getAttribute('data-group-id')
				: null;
			if (
				acceptedGroupId != firstItemId &&
				acceptedGroupId != lastItemId
			) {
				wrapper.scrollTop -= 48;
			}
		}
	};

	const resetActiveSession = () => {
		if (window.location.href.indexOf(activeSessionGroupId) === -1) {
			setActiveSessionGroupId(null);
		}
	};

	const getOffsetToUse = (increaseOffset?: boolean) => {
		let useOffset;
		if (increaseOffset) {
			useOffset = currentOffset + SESSION_COUNT;
			setLoadingWithOffset(true);
		} else {
			setCurrentOffset(0);
			useOffset = 0;
		}
		return useOffset;
	};

	const showFilter =
		!typeIsEnquiry(type) &&
		((hasUserAuthority(AUTHORITIES.VIEW_ALL_PEER_SESSIONS, userData) &&
			typeIsTeamSession(type)) ||
			(hasUserAuthority(AUTHORITIES.USE_FEEDBACK, userData) &&
				!hasUserAuthority(
					AUTHORITIES.VIEW_ALL_PEER_SESSIONS,
					userData
				)));
	const getFilterToUse = () => (showFilter ? filterStatus : INITIAL_FILTER);

	const getSessionsListData = (increaseOffset?: boolean): Promise<any> => {
		resetActiveSession();
		if (typeIsUser(type)) {
			return null;
		}
		const useOffset = getOffsetToUse(increaseOffset);

		return new Promise((resolve, reject) => {
			getSessions(sessionsContext, type, useOffset, getFilterToUse())
				.then(({ sessions, total, count }) => {
					increaseOffset ? setLoadingWithOffset(false) : null;
					setTotalItems(total);
					setCurrentOffset(useOffset);
					setLoading(false);
					resolve(sessions);
				})
				.catch((error) => {
					if (error.message === FETCH_ERRORS.EMPTY) {
						setLoading(false);
						setHasNoSessions(true);
						reject(FETCH_ERRORS.EMPTY);
					} else if (error === FETCH_ERRORS.TIMEOUT) {
						setLoadingWithOffset(false);
						setIsReloadButtonVisible(true);
						reject(FETCH_ERRORS.TIMEOUT);
					} else {
						setLoadingWithOffset(false);
						setIsReloadButtonVisible(true);
						reject(error);
					}
				});
		});
	};

	const fetchUserData = (
		newRegisteredSessionId: number = null,
		redirectToEnquiry: boolean = false
	) => {
		ajaxCallGetUserSessions()
			.then((response) => {
				setSessionsData({
					mySessions: response.sessions
				});
				if (
					response.sessions.length === 1 &&
					response.sessions[0].session.status === 0
				) {
					history.push(`/sessions/user/view/write`);
				} else {
					setLoading(false);
					if (newRegisteredSessionId && redirectToEnquiry) {
						setActiveSessionGroupId(newRegisteredSessionId);
						history.push(`/sessions/user/view/write`);
						getUserData()
							.then((userProfileData: UserDataInterface) => {
								setUserData(userProfileData);
							})
							.catch((error) => {
								console.log(error);
							});
					}
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const handleListScroll = () => {
		const list: any = listRef.current;
		if (
			Math.ceil(list.scrollTop) + list.offsetHeight ===
			list.scrollHeight
		) {
			if (
				totalItems > currentOffset + SESSION_COUNT &&
				!isReloadButtonVisible
			) {
				getSessionsListData(true);
			}
		}
	};

	const handleSelect = (selectedOption) => {
		setHasNoSessions(false);
		setActiveSessionGroupId(null);
		setFilterStatus(selectedOption.value);
	};

	const handleReloadButton = () => {
		setIsReloadButtonVisible(false);
		getSessionsListData().catch(() => {});
	};

	const selectedOptionsSet = [
		{
			value: 'feedback',
			label: hasUserAuthority(
				AUTHORITIES.VIEW_ALL_PEER_SESSIONS,
				userData
			)
				? translate('sessionList.filter.option.feedbackMain')
				: translate('sessionList.filter.option.feedbackPeer')
		},
		{
			value: INITIAL_FILTER,
			label: translate('sessionList.filter.option.all')
		}
	];

	const getOptionOfFilterStatus = () => {
		return selectedOptionsSet.filter(
			(option) => option.value === filterStatus
		)[0];
	};

	const preSelectedOption = filterStatus
		? getOptionOfFilterStatus()
		: selectedOptionsSet[1];
	const selectDropdown: SelectDropdownItem = {
		id: 'listFilterSelect',
		selectedOptions: selectedOptionsSet,
		handleDropdownSelect: handleSelect,
		selectInputLabel: translate('sessionList.filter.placeholder'),
		useIconOption: false,
		isSearchable: false,
		menuPlacement: 'bottom',
		defaultValue: preSelectedOption
	};

	if (loading) {
		return (
			<span>
				{isReloadButtonVisible ? (
					<div className="sessionsList__reloadWrapper">
						<Button
							item={{
								label: translate(
									'sessionList.reloadButton.label'
								),
								function: '',
								type: 'LINK',
								id: 'reloadButton'
							}}
							buttonHandle={handleReloadButton}
						/>
					</div>
				) : (
					<SessionsListSkeleton />
				)}
			</span>
		);
	}

	return (
		<div className="sessionsList__innerWrapper">
			{showFilter ? (
				<div className="sessionsList__selectWrapper">
					<SelectDropdown {...selectDropdown} />
				</div>
			) : null}
			<div
				className={`sessionsList__scrollContainer ${
					showFilter ? 'sessionsList__scrollContainer--hasFilter' : ''
				}`}
				ref={listRef}
				onScroll={handleListScroll}
			>
				{hasUserAuthority(AUTHORITIES.USER_DEFAULT, userData) &&
					sessionsData &&
					sessionsData.mySessions.length <=
						MAX_ITEMS_TO_SHOW_WELCOME_ILLUSTRATION && (
						<WelcomeIllustration />
					)}
				<div
					className={`sessionsList__itemsWrapper ${
						activeCreateChat ||
						(sessionsData &&
							sessionsData[
								getSessionsDataKeyForSessionType(type)
							] &&
							!hasNoSessions)
							? ''
							: 'sessionsList__itemsWrapper--centered'
					}`}
				>
					{activeCreateChat &&
					typeIsSession(type) &&
					hasUserAuthority(AUTHORITIES.CREATE_NEW_CHAT, userData) ? (
						<SessionListCreateChat />
					) : null}
					{sessionsData &&
					sessionsData[getSessionsDataKeyForSessionType(type)] &&
					!hasNoSessions ? (
						sessionsData[
							getSessionsDataKeyForSessionType(type)
						].map((item: ListItemInterface, index) => (
							<SessionListItemComponent
								key={index}
								type={type}
								id={getChatItemForSession(item).id}
							/>
						))
					) : !activeCreateChat ? (
						<SessionListEmptyState />
					) : null}
					{loadingWithOffset ? <SessionsListSkeleton /> : null}
					{isReloadButtonVisible ? (
						<div className="sessionsList__reloadWrapper">
							<Button
								item={{
									label: translate(
										'sessionList.reloadButton.label'
									),
									function: '',
									type: 'LINK',
									id: 'reloadButton'
								}}
								buttonHandle={handleReloadButton}
							/>
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
};
