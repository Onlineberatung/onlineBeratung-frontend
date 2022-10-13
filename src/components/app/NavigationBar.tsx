import * as React from 'react';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
	UserDataContext,
	hasUserAuthority,
	AUTHORITIES,
	ConsultingTypesContext,
	SessionsDataContext,
	SET_SESSIONS,
	LocaleContext,
	TenantContext
} from '../../globalState';
import { initNavigationHandler } from './navigationHandler';
import { ReactComponent as LogoutIcon } from '../../resources/img/icons/out.svg';
import clsx from 'clsx';
import { RocketChatUnreadContext } from '../../globalState/provider/RocketChatUnreadProvider';
import {
	apiFinishAnonymousConversation,
	apiGetAskerSessionList
} from '../../api';
import { useTranslation } from 'react-i18next';
import { LocaleSwitch } from '../localeSwitch/LocaleSwitch';
import { userHasBudibaseTools } from '../../api/apiGetTools';

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

		if (tenant?.settings?.featureToolsEnabled && !isConsultant) {
			userHasBudibaseTools(userData.userId).then((resp) =>
				setHasTools(resp)
			);
		}
	}, [dispatch, isConsultant, tenant, userData]);

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

	const pathsToShowUnreadMessageNotification = {
		'/sessions/consultant/sessionView':
			unreadSessions.length + unreadGroup.length,
		'/sessions/user/view': unreadSessions.length + unreadGroup.length,
		'/sessions/consultant/teamSessionView': unreadTeamSessions.length
	};

	const pathToClassNameInWalkThrough = React.useCallback((to: string) => {
		const value = to.replace(REGEX_DASH, '-').toLowerCase().slice(1);
		return value ? `walkthrough-${value}` : '';
	}, []);

	return (
		<div className="navigation__wrapper">
			<div className="navigation__itemContainer">
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
						.map((item, index) => (
							<Link
								key={index}
								className={`navigation__item ${pathToClassNameInWalkThrough(
									item.to
								)} ${
									location.pathname.indexOf(item.to) !== -1 &&
									'navigation__item--active'
								} ${
									animateNavIcon &&
									Object.keys(
										pathsToShowUnreadMessageNotification
									).includes(item.to) &&
									'navigation__item__count--active'
								}`}
								to={item.to}
							>
								{item?.icon}
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
						))}
				<div
					className={clsx('navigation__item__bottom', {
						'navigation__item__bottom--consultant':
							hasUserAuthority(
								AUTHORITIES.CONSULTANT_DEFAULT,
								userData
							)
					})}
				>
					{selectableLocales.length > 1 && (
						<div className="navigation__item navigation__item__language">
							<LocaleSwitch
								showIcon={true}
								className="navigation__title"
								updateUserData
								vertical
								iconSize={32}
								label={translate('navigation.language')}
								menuPlacement="right"
							/>
						</div>
					)}
					<div
						onClick={handleLogout}
						className={'navigation__item'}
						onKeyDown={(event) => {
							if (event.key === 'Enter') {
								handleLogout();
							}
						}}
						tabIndex={0}
					>
						<LogoutIcon className="navigation__icon" />
						<span className="navigation__title">
							{translate('app.logout')}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
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
