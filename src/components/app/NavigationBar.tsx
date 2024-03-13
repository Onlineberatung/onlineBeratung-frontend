import * as React from 'react';
import {
	PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState
} from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
	UserDataContext,
	hasUserAuthority,
	AUTHORITIES,
	ConsultingTypesContext,
	SessionsDataContext,
	SET_SESSIONS,
	TenantContext,
	LocaleContext
} from '../../globalState';
import { initNavigationHandler } from './navigationHandler';
import { ReactComponent as LogoutIconOutline } from '../../resources/img/icons/logout_outline.svg';
import { ReactComponent as LogoutIconFilled } from '../../resources/img/icons/logout_filled.svg';
import clsx from 'clsx';
import { RocketChatUnreadContext } from '../../globalState/provider/RocketChatUnreadProvider';
import {
	apiFinishAnonymousConversation,
	apiGetAskerSessionList
} from '../../api';
import { useTranslation } from 'react-i18next';
import { LocaleSwitch } from '../localeSwitch/LocaleSwitch';
import { userHasBudibaseTools } from '../../api/apiGetTools';
import { browserNotificationsSettings } from '../../utils/notificationHelpers';
import useIsFirstVisit from '../../utils/useIsFirstVisit';
import { useResponsive } from '../../hooks/useResponsive';
import { MENUPLACEMENT_RIGHT } from '../select/SelectDropdown';

export interface NavigationBarProps {
	onLogout: any;
	routerConfig: any;
}

const REGEX_DASH = /\//g;
export const NavigationBar = ({
	onLogout,
	routerConfig
}: NavigationBarProps) => {
	const { t: translate } = useTranslation();
	const isFirstVisit = useIsFirstVisit();
	const { userData } = useContext(UserDataContext);
	const { consultingTypes } = useContext(ConsultingTypesContext);
	const { sessions, dispatch } = useContext(SessionsDataContext);
	const { selectableLocales } = useContext(LocaleContext);
	const [sessionId, setSessionId] = useState(null);
	const [hasTools, setHasTools] = useState<boolean>(false);

	const isConsultant = hasUserAuthority(
		AUTHORITIES.CONSULTANT_DEFAULT,
		userData
	);
	const {
		sessions: unreadSessions,
		group: unreadGroup,
		teamsessions: unreadTeamSessions
	} = useContext(RocketChatUnreadContext);
	const { tenant } = useContext(TenantContext);

	const ref_menu = useRef<any>([]);
	const ref_local = useRef<any>();
	const ref_logout = useRef<any>();
	const ref_select = useRef<any>();

	const handleLogout = useCallback(() => {
		if (hasUserAuthority(AUTHORITIES.ANONYMOUS_DEFAULT, userData)) {
			apiFinishAnonymousConversation(sessionId).catch((error) => {
				console.error(error);
			});
		}
		onLogout();
	}, [onLogout, sessionId, userData]);

	const location = useLocation();
	const [animateNavIcon, setAnimateNavIcon] = useState(false);

	useEffect(() => {
		initNavigationHandler();
	}, []);

	useEffect(() => {
		if (!isConsultant) {
			apiGetAskerSessionList().then((sessionsData) => {
				dispatch({
					type: SET_SESSIONS,
					ready: true,
					sessions: sessionsData.sessions
				});
				setSessionId(sessionsData?.sessions?.[0]?.session?.id);
			});
		}
	}, [dispatch, isConsultant]);

	useEffect(() => {
		if (tenant?.settings?.featureToolsEnabled && !isConsultant) {
			userHasBudibaseTools(userData.userId).then((resp) =>
				setHasTools(resp)
			);
		}
	}, [tenant, userData, isConsultant]);

	const animateNavIconTimeoutRef = useRef(null);
	useEffect(() => {
		if (animateNavIconTimeoutRef.current) {
			return;
		}

		if (
			unreadSessions.length +
				unreadGroup.length +
				unreadTeamSessions.length >
			0
		) {
			setAnimateNavIcon(true);
		}

		animateNavIconTimeoutRef.current = setTimeout(() => {
			setAnimateNavIcon(false);
			animateNavIconTimeoutRef.current = null;
		}, 1000);
	}, [unreadSessions, unreadGroup, unreadTeamSessions]);

	const notificationConsultant = isConsultant ? 0 : unreadTeamSessions.length;

	const pathsToShowUnreadMessageNotification = {
		'/sessions/consultant/sessionView':
			unreadSessions.length + unreadGroup.length,
		'/sessions/user/view':
			unreadSessions.length + unreadGroup.length + notificationConsultant,
		'/sessions/consultant/teamSessionView': unreadTeamSessions.length,
		'/profile': isFirstVisit && !browserNotificationsSettings().visited
	};

	const pathToClassNameInWalkThrough = React.useCallback((to: string) => {
		const value = to.replace(REGEX_DASH, '-').toLowerCase().slice(1);
		return value ? `walkthrough-${value}` : '';
	}, []);

	const handleSelection = (index) => {
		if (document.activeElement === ref_logout.current) {
			handleLogout();
		} else if (document.activeElement === ref_local.current) {
			ref_select.current.focus();
		} else {
			ref_menu.current[index].click();
		}
	};

	const handleArrowUp = (index) => {
		if (index === 0) {
			ref_logout.current.focus();
			ref_logout.current.setAttribute('tabindex', '0');
			ref_menu.current[index].setAttribute('tabindex', '-1');
		} else if (document.activeElement === ref_logout.current) {
			if (selectableLocales.length > 1) {
				ref_local.current.focus();
				ref_local.current.setAttribute('tabindex', '0');
				ref_logout.current.setAttribute('tabindex', '-1');
			} else {
				ref_menu.current[ref_menu.current.length - 1].focus();
				ref_menu.current[ref_menu.current.length - 1].setAttribute(
					'tabindex',
					'0'
				);
				ref_logout.current.setAttribute('tabindex', '-1');
			}
		} else if (document.activeElement === ref_local.current) {
			ref_menu.current[ref_menu.current.length - 1].focus();
			ref_menu.current[ref_menu.current.length - 1].setAttribute(
				'tabindex',
				'0'
			);
			ref_local.current.setAttribute('tabindex', '-1');
		} else if (
			document.activeElement !==
			document.getElementById('react-select-2-input')
		) {
			ref_menu.current[index - 1].focus();
			ref_menu.current[index - 1].setAttribute('tabindex', '0');
			ref_menu.current[index].setAttribute('tabindex', '-1');
		}
	};

	const handleArrowDown = (index) => {
		if (index === ref_menu.current.length - 1) {
			if (selectableLocales.length > 1) {
				ref_local.current.focus();
				ref_local.current.setAttribute('tabindex', '0');
				ref_menu.current[index].setAttribute('tabindex', '-1');
			} else {
				ref_logout.current.focus();
				ref_logout.current.setAttribute('tabindex', '0');
				ref_menu.current[index].setAttribute('tabindex', '-1');
			}
		} else if (document.activeElement === ref_local.current) {
			ref_logout.current.focus();
			ref_logout.current.setAttribute('tabindex', '0');
			ref_local.current.setAttribute('tabindex', '-1');
		} else if (document.activeElement === ref_logout.current) {
			ref_menu.current[0].focus();
			ref_menu.current[0].setAttribute('tabindex', '0');
			ref_logout.current.setAttribute('tabindex', '-1');
		} else if (
			document.activeElement !==
			document.getElementById('react-select-2-input')
		) {
			ref_menu.current[index + 1].focus();
			ref_menu.current[index + 1].setAttribute('tabindex', '0');
			ref_menu.current[index].setAttribute('tabindex', '-1');
		}
	};

	const handleKeyDownMenu = (e, index) => {
		switch (e.key) {
			case 'Enter':
			case ' ':
				handleSelection(index);
				break;
			case 'ArrowUp':
				handleArrowUp(index);
				break;
			case 'ArrowDown':
				handleArrowDown(index);
				break;
		}
	};

	return (
		<div className="navigation__wrapper">
			<div className="navigation__itemContainer" role="tablist">
				<NavGroup className="navigation__item__top">
					{sessions &&
						routerConfig.navigation
							.filter(
								(item: any) =>
									!item.condition ||
									item.condition(
										userData,
										consultingTypes,
										sessions,
										hasTools
									)
							)
							.map((item, index) => {
								const Icon = item?.icon;
								const IconFilled = item?.iconFilled;
								return (
									<Link
										key={index}
										className={`navigation__item ${pathToClassNameInWalkThrough(
											item.to
										)} ${
											location.pathname.indexOf(
												item.to
											) !== -1 &&
											'navigation__item--active'
										} ${
											animateNavIcon &&
											Object.keys(
												pathsToShowUnreadMessageNotification
											).includes(item.to) &&
											'navigation__item__count--active'
										}`}
										to={item.to}
										onKeyDown={(e) =>
											handleKeyDownMenu(e, index)
										}
										ref={(el) =>
											(ref_menu.current[index] = el)
										}
										tabIndex={index === 0 ? 0 : -1}
										role="tab"
									>
										<div className="navigation__icon__background">
											{Icon && (
												<Icon
													title={translate(
														item.titleKeys.large
													)}
													aria-label={translate(
														item.titleKeys.large
													)}
													className="navigation__icon__outline"
												/>
											)}
											{IconFilled && (
												<IconFilled
													title={translate(
														item.titleKeys.large
													)}
													aria-label={translate(
														item.titleKeys.large
													)}
													className="navigation__icon__filled"
												/>
											)}
										</div>

										{(({ large }) => {
											return (
												<>
													<span className="navigation__title">
														{translate(large)}
													</span>
												</>
											);
										})(item.titleKeys)}
										{Object.keys(
											pathsToShowUnreadMessageNotification
										).includes(item.to) &&
											pathsToShowUnreadMessageNotification[
												item.to
											] > 0 && (
												<NavigationUnreadIndicator
													animate={animateNavIcon}
												/>
											)}
									</Link>
								);
							})}
				</NavGroup>
				<NavGroup
					className={clsx('navigation__item__bottom', {
						'navigation__item__bottom--consultant':
							hasUserAuthority(
								AUTHORITIES.CONSULTANT_DEFAULT,
								userData
							)
					})}
				>
					{selectableLocales.length > 1 && (
						<div
							className="navigation__item navigation__item__language"
							role="tab"
							tabIndex={-1}
							ref={(el) => (ref_local.current = el)}
							onKeyDown={(e) => handleKeyDownMenu(e, null)}
							id="local-switch-wrapper"
						>
							<LocaleSwitch
								showIcon={true}
								className="navigation__title"
								updateUserData
								vertical
								iconSize={32}
								label={translate('navigation.language')}
								menuPlacement={MENUPLACEMENT_RIGHT}
								selectRef={(el) => (ref_select.current = el)}
								isInsideMenu={true}
							/>
						</div>
					)}
					<div
						onClick={handleLogout}
						className={'navigation__item'}
						role="tab"
						tabIndex={-1}
						ref={(el) => (ref_logout.current = el)}
						onKeyDown={(e) => handleKeyDownMenu(e, null)}
					>
						<LogoutIconOutline
							className="navigation__icon__outline"
							title={translate('app.logout')}
							aria-label={translate('app.logout')}
						/>
						<LogoutIconFilled
							className="navigation__icon__filled"
							title={translate('app.logout')}
							aria-label={translate('app.logout')}
						/>
						<span className="navigation__title">
							{translate('app.logout')}
						</span>
					</div>
				</NavGroup>
			</div>
		</div>
	);
};

const NavGroup = ({
	children,
	className
}: PropsWithChildren<{ className: string }>) => {
	const { fromL } = useResponsive();
	if (fromL) {
		return <div className={className}>{children}</div>;
	}

	return <>{children}</>;
};

const NavigationUnreadIndicator = ({ animate }: { animate: boolean }) => {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		// After first render wait for initial animation
		setTimeout(() => {
			setVisible(true);
		}, 1000);
	}, []);

	return (
		<span
			className={`navigation__item__count ${
				!visible
					? 'navigation__item__count--initial'
					: `${animate && 'navigation__item__count--reanimate'}`
			}`}
		></span>
	);
};
