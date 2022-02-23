import * as React from 'react';
import { useContext, useState, useEffect, useMemo, createRef } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
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
	UserDataContext,
	AcceptedGroupIdContext,
	getSessionsDataKeyForSessionType,
	getActiveSession,
	UnreadSessionsStatusContext,
	AUTHORITIES,
	hasUserAuthority,
	UserDataInterface,
	getUnreadMyMessages,
	UpdateSessionListContext,
	isAnonymousSession,
	STATUS_EMPTY
} from '../../globalState';
import { SelectDropdownItem, SelectDropdown } from '../select/SelectDropdown';
import { FilterStatusContext } from '../../globalState/provider/FilterStatusProvider';
import { SessionListItemComponent } from '../sessionsListItem/SessionListItemComponent';
import { SessionsListSkeleton } from '../sessionsListItem/SessionsListItemSkeleton';
import {
	INITIAL_FILTER,
	SESSION_COUNT,
	apiGetAskerSessionList,
	apiGetUserData,
	FETCH_ERRORS,
	FILTER_FEEDBACK
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
	offset: number;
	count: number;
	signal?: AbortSignal;
}

interface SessionsListProps {
	defaultLanguage: string;
}

export const SessionsList: React.FC<SessionsListProps> = ({
	defaultLanguage
}) => {
	const { rcGroupId: groupIdFromParam } = useParams();
	const location = useLocation();
	const listRef = createRef<HTMLDivElement>();
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
	const [isSessionListUpdating, setIsSessionListUpdating] = useState(false);
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);
	const [isActiveSessionCreateChat, setIsActiveSessionCreateChat] =
		useState(false);

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
			fetchAskerData(acceptedGroupId, true).catch(() => {}); // Intentionally empty to prevent json parse errors
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const activeCreateChat = groupIdFromParam === 'createGroupChat';

	/* eslint-disable */
	useEffect(() => {
		if (
			hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) &&
			acceptedGroupId
		) {
			fetchAskerData(acceptedGroupId).catch(() => {}); // Intentionally empty to prevent json parse errors
			setAcceptedGroupId(null);
		}

		if (
			!hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) &&
			!hasUserAuthority(AUTHORITIES.ANONYMOUS_DEFAULT, userData) &&
			hasUserAuthority(AUTHORITIES.CREATE_NEW_CHAT, userData)
		) {
			if (activeCreateChat) {
				setIsActiveSessionCreateChat(true);
			} else if (!groupIdFromParam && isActiveSessionCreateChat) {
				mobileListView();
				setIsActiveSessionCreateChat(false);
				getSessionsListData({
					offset: 0,
					count: currentOffset + SESSION_COUNT
				}).catch(() => {}); // Intentionally empty to prevent json parse errors
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
				/*
				If accepted group isset load sessions until accepted group
				id is found in list
				 */
				fetchSessionsForAcceptedGroupId();
			} else if (acceptedGroupId === ACCEPTED_GROUP_CLOSE) {
				/*
				If group is closed update the whole loaded list of sessions
				 */
				getSessionsListData({
					offset: 0,
					count: currentOffset + SESSION_COUNT
				})
					.then(() => {
						setAcceptedGroupId(null);
					})
					.catch(() => {}); // Intentionally empty to prevent json parse errors
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
			getSessionsListData({
				offset: 0,
				count: SESSION_COUNT,
				signal: controller.signal
			}).catch(() => {}); // Intentionally empty to prevent json parse errors
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
		const refreshSessionList = () => {
			if (
				hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) ||
				hasUserAuthority(AUTHORITIES.ANONYMOUS_DEFAULT, userData)
			) {
				fetchAskerData().finally(() => {
					setIsSessionListUpdating(false);
				});
			} else if (
				hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData)
			) {
				getSessionsListData({
					offset: 0,
					count: currentOffset + SESSION_COUNT
				})
					.catch(() => {}) // Intentionally empty to prevent json parse errors
					.finally(() => {
						setIsSessionListUpdating(false);
					});
			}
		};

		if (updateSessionList && !isSessionListUpdating) {
			setIsSessionListUpdating(true);
			refreshSessionList();
		}
		setUpdateSessionList(null);
	}, [updateSessionList, userData]); // eslint-disable-line react-hooks/exhaustive-deps

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
			.catch(() => {}) // Intentionally empty to prevent json parse errors
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

	/*
	ToDo: if count > SESSION_COUNT sessions should be loaded in junks
	 because it will be a performance issue if to many sessions are loaded.
	 Currently its not possible because getConsultantSessions will already
	 update the sessions which will trigger unexpected effects
	 */
	const getSessionsListData = ({
		offset,
		count,
		signal
	}: GetSessionsListDataInterface): Promise<any> => {
		if (
			hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) ||
			hasUserAuthority(AUTHORITIES.ANONYMOUS_DEFAULT, userData)
		) {
			return null;
		}
		setIsRequestInProgress(true);

		return new Promise((resolve, reject) => {
			getConsultantSessions({
				context: sessionsContext,
				type: type,
				offset,
				count,
				useFilter: getFilterToUse(),
				sessionListTab: sessionListTab,
				...(signal && { signal })
			})
				.then(({ sessions, total }) => {
					setTotalItems(total);
					setCurrentOffset(offset + count - SESSION_COUNT);
					setIsLoading(false);
					setHasNoSessions(false);
					resolve(sessions);
				})
				.catch((error) => {
					if (
						error.message === FETCH_ERRORS.EMPTY &&
						currentOffset < count - SESSION_COUNT
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
		return apiGetAskerSessionList()
			.then((response) => {
				setSessionsData({
					mySessions: response.sessions
				});
				const firstSession = response.sessions[0].session;
				if (
					response.sessions.length === 1 &&
					firstSession?.status === STATUS_EMPTY
				) {
					history.push(`/sessions/user/view/write`);
				} else if (
					response.sessions.length === 1 &&
					isAnonymousSession(firstSession) &&
					hasUserAuthority(AUTHORITIES.ANONYMOUS_DEFAULT, userData)
				) {
					setIsLoading(false);
					history.push(
						`/sessions/user/view/${firstSession.groupId}/${firstSession.id}`
					);
				} else {
					setIsLoading(false);
					if (newRegisteredSessionId && redirectToEnquiry) {
						history.push(
							`/sessions/user/view/write/${newRegisteredSessionId}`
						);
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
				setLoadingWithOffset(true);
				getSessionsListData({
					offset: currentOffset + SESSION_COUNT,
					count: SESSION_COUNT
				}).catch(() => {}); // Intentionally empty to prevent json parse errors
			}
		}
	};

	const handleSelect = (selectedOption) => {
		setCurrentOffset(0);
		setHasNoSessions(false);
		setFilterStatus(selectedOption.value);
		history.push(getSessionListPathForLocation());
	};

	const handleReloadButton = () => {
		setIsReloadButtonVisible(false);
		getSessionsListData({
			offset: 0,
			count: currentOffset + SESSION_COUNT
		}).catch(() => {}); // Intentionally empty to prevent json parse errors
	};

	const selectedOptionsSet = [
		{
			value: FILTER_FEEDBACK,
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
										defaultLanguage={defaultLanguage}
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
