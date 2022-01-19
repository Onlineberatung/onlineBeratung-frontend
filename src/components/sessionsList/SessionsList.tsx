import * as React from 'react';
import { useContext, useState, useEffect, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
	typeIsTeamSession,
	typeIsEnquiry,
	getTypeOfLocation,
	typeIsSession,
	getChatItemForSession,
	getSessionListPathForLocation,
	SESSION_LIST_TAB
} from '../session/sessionHelpers';
import { history } from '../app/app';
import { translate } from '../../utils/translate';
import {
	SessionsDataContext,
	ListItemInterface,
	ActiveSessionGroupIdContext,
	UserDataContext,
	AcceptedGroupIdContext,
	getSessionsDataKeyForSessionType,
	getActiveSession,
	UnreadSessionsStatusContext,
	AUTHORITIES,
	ACTIVE_SESSION,
	hasUserAuthority,
	StoppedGroupChatContext,
	UserDataInterface,
	getUnreadMyMessages,
	UpdateSessionListContext
} from '../../globalState';
import { SelectDropdownItem, SelectDropdown } from '../select/SelectDropdown';
import { FilterStatusContext } from '../../globalState';
import { SessionListItemComponent } from '../sessionsListItem/SessionListItemComponent';
import { SessionsListSkeleton } from '../sessionsListItem/SessionsListItemSkeleton';
import {
	INITIAL_FILTER,
	SESSION_COUNT,
	apiGetAskerSessionList,
	apiGetUserData,
	FETCH_ERRORS
} from '../../api';
import { getConsultantSessions } from './SessionsListData';
import { Button } from '../button/Button';
import { WelcomeIllustration } from './SessionsListWelcomeIllustration';
import { SessionListCreateChat } from './SessionListCreateChat';
import { mobileListView } from '../app/navigationHandler';
import './sessionsList.styles';
import { ACCEPTED_GROUP_CLOSE } from '../sessionAssign/SessionAssign';
import {
	MAX_ITEMS_TO_SHOW_WELCOME_ILLUSTRATION,
	SCROLL_PAGINATE_THRESHOLD
} from './sessionsListConfig';
import { Text } from '../text/Text';
import clsx from 'clsx';

interface GetSessionsListDataInterface {
	increaseOffset?: boolean;
	signal?: AbortSignal;
}

export const SessionsList: React.FC = () => {
	const location = useLocation();
	let listRef: React.RefObject<HTMLDivElement> = React.createRef();
	const { activeSessionGroupId, setActiveSessionGroupId } = useContext(
		ActiveSessionGroupIdContext
	);
	const sessionsContext = useContext(SessionsDataContext);
	const { sessionsData, setSessionsData } = sessionsContext;
	const { filterStatus, setFilterStatus } = useContext(FilterStatusContext);

	const currentFilter = useMemo(() => filterStatus, [filterStatus]);
	const [sessionListTab, setSessionListTab] = useState(
		new URLSearchParams(location.search).get('sessionListTab')
	);
	const currentTab = useMemo(() => sessionListTab, [sessionListTab]);
	const [hasNoSessions, setHasNoSessions] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [abortController, setAbortController] =
		useState<AbortController | null>(null);

	const { userData, setUserData } = useContext(UserDataContext);
	const [currentOffset, setCurrentOffset] = useState(0);
	const [totalItems, setTotalItems] = useState(0);
	const { acceptedGroupId, setAcceptedGroupId } = useContext(
		AcceptedGroupIdContext
	);
	const [loadingWithOffset, setLoadingWithOffset] = useState(false);
	const [isReloadButtonVisible, setIsReloadButtonVisible] = useState(false);
	const { unreadSessionsStatus, setUnreadSessionsStatus } = useContext(
		UnreadSessionsStatusContext
	);
	const { updateSessionList, setUpdateSessionList } = useContext(
		UpdateSessionListContext
	);
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);
	const [isActiveSessionCreateChat, setIsActiveSessionCreateChat] =
		useState(false);
	const { stoppedGroupChat, setStoppedGroupChat } = useContext(
		StoppedGroupChatContext
	);

	let type = getTypeOfLocation();

	useEffect(() => {
		setAcceptedGroupId(null);
		if (!showFilter) {
			setFilterStatus(INITIAL_FILTER);
		}
		if (
			hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) ||
			hasUserAuthority(AUTHORITIES.ANONYMOUS_DEFAULT, userData)
		) {
			resetActiveSession();
			fetchAskerData(acceptedGroupId, true);
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const activeCreateChat =
		activeSessionGroupId === ACTIVE_SESSION.CREATE_CHAT;

	/* eslint-disable */
	useEffect(() => {
		if (
			hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) &&
			acceptedGroupId
		) {
			fetchAskerData(acceptedGroupId);
			setAcceptedGroupId(null);
			setActiveSessionGroupId(null);
		}
		if (
			!hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) &&
			!hasUserAuthority(AUTHORITIES.ANONYMOUS_DEFAULT, userData) &&
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
	/* eslint-enable */

	useEffect(() => {
		if (
			acceptedGroupId &&
			(!hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) ||
				!hasUserAuthority(AUTHORITIES.ANONYMOUS_DEFAULT, userData))
		) {
			setIsRequestInProgress(true);
			setCurrentOffset(0);
			if (acceptedGroupId !== ACCEPTED_GROUP_CLOSE) {
				fetchSessionsForAcceptedGroupId();
			} else if (acceptedGroupId === ACCEPTED_GROUP_CLOSE) {
				getSessionsListData()
					.then(() => {
						setAcceptedGroupId(null);
					})
					.catch(() => {});
			}
		}
	}, [acceptedGroupId]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (
			!hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) &&
			!hasUserAuthority(AUTHORITIES.ANONYMOUS_DEFAULT, userData) &&
			!acceptedGroupId
		) {
			setIsLoading(true);

			if (abortController) {
				abortController.abort();
			}

			const controller = new AbortController();
			setAbortController(controller);
			getSessionsListData({ signal: controller.signal }).catch(() => {});
		}
	}, [currentFilter, currentTab]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (
			!hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) &&
			!hasUserAuthority(AUTHORITIES.ANONYMOUS_DEFAULT, userData)
		) {
			setIsReloadButtonVisible(false);
			setHasNoSessions(false);
			setSessionListTab(
				new URLSearchParams(location.search).get('sessionListTab')
			);
		}
	}, [filterStatus, location]); // eslint-disable-line react-hooks/exhaustive-deps

	const didUnreadStatusChange = () =>
		unreadSessionsStatus.mySessions !== getUnreadMyMessages(sessionsData);

	useEffect(() => {
		if (sessionsData && sessionsData.mySessions) {
			if (didUnreadStatusChange()) {
				setUnreadSessionsStatus({
					...unreadSessionsStatus,
					mySessions: getUnreadMyMessages(sessionsData),
					newDirectMessage: false
				});
			}
		}
	}, [sessionsData, updateSessionList]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		const refreshSessionList = async () =>
			// sessionListType: SESSION_LIST_TYPES
			{
				if (
					hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) ||
					hasUserAuthority(AUTHORITIES.ANONYMOUS_DEFAULT, userData)
				) {
					fetchAskerData();
				} else if (
					hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData)
				) {
					getSessionsListData();
				}
			};

		if (updateSessionList) {
			refreshSessionList(/*updateSessionList*/);
		}
		setUpdateSessionList(null);
	}, [updateSessionList, userData]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (stoppedGroupChat) {
			if (
				!hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) &&
				!hasUserAuthority(AUTHORITIES.ANONYMOUS_DEFAULT, userData)
			) {
				getSessionsListData().catch(() => {});
			} else {
				fetchAskerData();
			}
			setStoppedGroupChat(false);
		}
	}, [stoppedGroupChat]); // eslint-disable-line react-hooks/exhaustive-deps

	const fetchSessionsForAcceptedGroupId = (increasedOffset?: number) => {
		const updatedOffset = increasedOffset ?? currentOffset;
		if (increasedOffset) {
			setLoadingWithOffset(true);
		}
		getConsultantSessions({
			context: sessionsContext,
			type: type,
			offset: updatedOffset,
			useFilter: getFilterToUse(),
			sessionListTab: sessionListTab
		})
			.then((fetchedSessions) => {
				const assignedSession = getActiveSession(acceptedGroupId, {
					mySessions: fetchedSessions.sessions
				});
				if (assignedSession) {
					setCurrentOffset(updatedOffset);
					setAssignedSessionActive(assignedSession);
				} else {
					fetchSessionsForAcceptedGroupId(
						updatedOffset + SESSION_COUNT
					);
				}
			})
			.catch(() => {})
			.finally(() => {
				setIsLoading(false);
				setLoadingWithOffset(false);
				setIsRequestInProgress(false);
			});
	};

	const setAssignedSessionActive = (assignedSession) => {
		const chatItem = getChatItemForSession(assignedSession);
		history.push(
			`${getSessionListPathForLocation()}/${chatItem.groupId}/${
				chatItem.id
			}${sessionListTab ? `?sessionListTab=${sessionListTab}` : ''}`
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
				acceptedGroupId !== firstItemId &&
				acceptedGroupId !== lastItemId
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

	const showFilter =
		!typeIsEnquiry(type) &&
		sessionListTab !== SESSION_LIST_TAB.ARCHIVE &&
		((hasUserAuthority(AUTHORITIES.VIEW_ALL_PEER_SESSIONS, userData) &&
			typeIsTeamSession(type)) ||
			(hasUserAuthority(AUTHORITIES.USE_FEEDBACK, userData) &&
				!hasUserAuthority(
					AUTHORITIES.VIEW_ALL_PEER_SESSIONS,
					userData
				)));
	const getFilterToUse = (): string =>
		showFilter ? filterStatus : INITIAL_FILTER;

	const getSessionsListData = ({
		increaseOffset,
		signal
	}: GetSessionsListDataInterface = {}): Promise<any> => {
		resetActiveSession();
		if (
			hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) ||
			hasUserAuthority(AUTHORITIES.ANONYMOUS_DEFAULT, userData)
		) {
			return null;
		}
		setIsRequestInProgress(true);

		let useOffset = currentOffset;
		if (increaseOffset) {
			setLoadingWithOffset(true);
			useOffset = currentOffset + SESSION_COUNT;
		}
		return new Promise((resolve, reject) => {
			getConsultantSessions({
				context: sessionsContext,
				type: type,
				offset: useOffset,
				useFilter: getFilterToUse(),
				sessionListTab: sessionListTab,
				...(signal && { signal: signal })
			})
				.then(({ sessions, total }) => {
					setTotalItems(total);
					setCurrentOffset(useOffset);
					setIsLoading(false);
					setHasNoSessions(false);
					resolve(sessions);
				})
				.catch((error) => {
					if (
						error.message === FETCH_ERRORS.EMPTY &&
						increaseOffset
					) {
						setIsLoading(false);
						setIsReloadButtonVisible(true);
						reject(FETCH_ERRORS.EMPTY);
					} else if (error.message === FETCH_ERRORS.EMPTY) {
						setIsLoading(false);
						setHasNoSessions(true);
						reject(FETCH_ERRORS.EMPTY);
					} else if (error.message === FETCH_ERRORS.TIMEOUT) {
						setIsLoading(false);
						setIsReloadButtonVisible(true);
						reject(FETCH_ERRORS.TIMEOUT);
					} else if (error.message === FETCH_ERRORS.ABORT) {
						// No action necessary. Just make sure to NOT set
						// `isLoading` to false or `isReloadButtonVisible` to true.
					} else {
						setIsReloadButtonVisible(true);
						reject(error);
					}
				})
				.finally(() => {
					setLoadingWithOffset(false);
					setIsRequestInProgress(false);
				});
		});
	};

	const fetchAskerData = (
		newRegisteredSessionId: number | string = null,
		redirectToEnquiry: boolean = false
	) => {
		apiGetAskerSessionList()
			.then((response) => {
				setSessionsData({
					mySessions: response.sessions
				});
				if (
					response.sessions.length === 1 &&
					response.sessions[0].session?.status === 0
				) {
					history.push(`/sessions/user/view/write`);
				} else {
					setIsLoading(false);
					if (newRegisteredSessionId && redirectToEnquiry) {
						setActiveSessionGroupId(newRegisteredSessionId);
						history.push(`/sessions/user/view/write`);
						apiGetUserData()
							.then((userProfileData: UserDataInterface) => {
								setUserData(userProfileData);
							})
							.catch((error) => {
								console.log(error);
							});
					} else if (typeof newRegisteredSessionId === 'string') {
						const currentSession = getActiveSession(
							newRegisteredSessionId,
							{ mySessions: response.sessions }
						);
						const chatItem = getChatItemForSession(currentSession);
						history.push(
							`/sessions/user/view/${chatItem.groupId}/${chatItem.id}`
						);
					}
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const handleListScroll = () => {
		const list: any = listRef.current;
		const scrollPosition = Math.ceil(list.scrollTop) + list.offsetHeight;
		if (scrollPosition + SCROLL_PAGINATE_THRESHOLD >= list.scrollHeight) {
			if (
				totalItems > currentOffset + SESSION_COUNT &&
				!isReloadButtonVisible &&
				!isRequestInProgress
			) {
				getSessionsListData({ increaseOffset: true });
			}
		}
	};

	const handleSelect = (selectedOption) => {
		setCurrentOffset(0);
		setHasNoSessions(false);
		setActiveSessionGroupId(null);
		setFilterStatus(selectedOption.value);
		history.push(getSessionListPathForLocation());
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

	const showEnquiryTabs =
		hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) &&
		userData.hasAnonymousConversations &&
		typeIsEnquiry(type);

	const showSessionListTabs =
		userData.hasArchive && (typeIsSession(type) || typeIsTeamSession(type));

	return (
		<div className="sessionsList__innerWrapper">
			{(showFilter || showEnquiryTabs || showSessionListTabs) && (
				<div className="sessionsList__functionalityWrapper">
					{showEnquiryTabs && (
						<div className="sessionsList__tabs">
							<Link
								className={clsx({
									'sessionsList__tabs--active':
										!sessionListTab
								})}
								to={'/sessions/consultant/sessionPreview'}
							>
								<Text
									text={translate(
										'sessionList.preview.registered.tab'
									)}
									type="standard"
								/>
							</Link>
							<Link
								className={clsx({
									'sessionsList__tabs--active':
										sessionListTab ===
										SESSION_LIST_TAB.ANONYMOUS
								})}
								to={`/sessions/consultant/sessionPreview?sessionListTab=${SESSION_LIST_TAB.ANONYMOUS}`}
							>
								<Text
									text={translate(
										'sessionList.preview.anonymous.tab'
									)}
									type="standard"
								/>
							</Link>
						</div>
					)}
					{showSessionListTabs && (
						<div className="sessionsList__tabs">
							<Link
								className={clsx({
									'sessionsList__tabs--active':
										!sessionListTab
								})}
								to={`/sessions/consultant/${
									typeIsTeamSession(getTypeOfLocation())
										? 'teamSessionView'
										: 'sessionView'
								}`}
							>
								<Text
									text={translate(
										'sessionList.view.asker.tab'
									)}
									type="standard"
								/>
							</Link>
							<Link
								className={clsx({
									'sessionsList__tabs--active':
										sessionListTab ===
										SESSION_LIST_TAB.ARCHIVE
								})}
								to={`/sessions/consultant/${
									typeIsTeamSession(getTypeOfLocation())
										? 'teamSessionView'
										: 'sessionView'
								}?sessionListTab=${SESSION_LIST_TAB.ARCHIVE}`}
							>
								<Text
									text={translate(
										'sessionList.view.archive.tab'
									)}
									type="standard"
								/>
							</Link>
						</div>
					)}
					{showFilter && (
						<div className="sessionsList__selectWrapper">
							<SelectDropdown {...selectDropdown} />
						</div>
					)}
				</div>
			)}
			<div
				className={clsx('sessionsList__scrollContainer', {
					'sessionsList__scrollContainer--hasFilter': showFilter,
					'sessionsList__scrollContainer--hasTabs':
						showEnquiryTabs || showSessionListTabs
				})}
				ref={listRef}
				onScroll={handleListScroll}
			>
				{hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) &&
					sessionsData &&
					sessionsData.mySessions.length <=
						MAX_ITEMS_TO_SHOW_WELCOME_ILLUSTRATION && (
						<WelcomeIllustration />
					)}
				{isLoading ? (
					<SessionsListSkeleton />
				) : (
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
						data-cy="sessions-list-items-wrapper"
					>
						{activeCreateChat &&
							typeIsSession(type) &&
							hasUserAuthority(
								AUTHORITIES.CREATE_NEW_CHAT,
								userData
							) && <SessionListCreateChat />}
						{sessionsData &&
						sessionsData[getSessionsDataKeyForSessionType(type)] &&
						!hasNoSessions
							? sessionsData[
									getSessionsDataKeyForSessionType(type)
							  ].map((item: ListItemInterface, index) => (
									<SessionListItemComponent
										key={index}
										type={type}
										id={getChatItemForSession(item).id}
									/>
							  ))
							: !activeCreateChat && (
									<Text
										className="sessionsList--empty"
										text={
											sessionListTab !==
											SESSION_LIST_TAB.ANONYMOUS
												? translate('sessionList.empty')
												: translate(
														'sessionList.empty.anonymous'
												  )
										}
										type="divider"
									/>
							  )}
						{loadingWithOffset && <SessionsListSkeleton />}
						{isReloadButtonVisible && (
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
						)}
					</div>
				)}
			</div>
		</div>
	);
};
