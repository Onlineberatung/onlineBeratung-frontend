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
import { ReactComponent as LanguageIcon } from '../../resources/img/icons/language.svg';
import { components } from 'react-select';
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

	const [isMenuOpen, setMenuOpen] = useState(false);

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

	const navbarLocaleSwitchStyle = {
		control: () => ({
			border: 0,
			boxShadow: 'none',
			cursor: 'pointer'
		}),
		menu: () => ({
			position: 'absolute',
			left: '100%',
			bottom: '-50%',
			width: '250%',
			backgroundColor: 'white',
			color: 'black',
			textAlign: 'left',
			border: '1px solid rgba(0, 0, 0, 0.2)',
			boxShadow: '0px 3px 0px 1px rgba(0, 0, 0, 0.1)',
			borderRadius: '4px'
		}),
		option: (styles) => ({
			...styles,
			cursor: 'pointer'
		}),
		placeholder: () => ({
			display: 'none'
		})
	};

	const ValueContainer = ({ children, ...props }) => (
		<components.ValueContainer {...props}>
			{React.Children.map(children, (child) =>
				child && [components.SingleValue].indexOf(child.type) === -1
					? child
					: null
			)}
			<LanguageIcon className="navigation__icon" />
			<span className="navigation__title">
				{translate('navigation.language')}
			</span>
		</components.ValueContainer>
	);

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
						<div
							className="navigation__item navigation__item__language"
							onClick={() => setMenuOpen(!isMenuOpen)}
						>
							<LocaleSwitch
								styles={navbarLocaleSwitchStyle}
								showIcon={false}
								components={{
									DropdownIndicator: () => null,
									IndicatorSeparator: () => null,
									ValueContainer,
									Input: () => null
								}}
								className="navigation__title"
								menuIsOpen={isMenuOpen}
								updateUserData
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
