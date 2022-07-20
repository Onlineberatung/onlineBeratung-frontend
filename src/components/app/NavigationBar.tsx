import * as React from 'react';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { translate } from '../../utils/translate';
import {
	UserDataContext,
	hasUserAuthority,
	AUTHORITIES,
	ConsultingTypesContext,
	SessionsDataContext
} from '../../globalState';
import { initNavigationHandler } from './navigationHandler';
import { ReactComponent as InboxIcon } from '../../resources/img/icons/inbox.svg';
import { ReactComponent as SpeechBubbleIcon } from '../../resources/img/icons/speech-bubble.svg';
import { ReactComponent as SpeechBubbleTeamIcon } from '../../resources/img/icons/speech-bubble-team.svg';
import { ReactComponent as PersonIcon } from '../../resources/img/icons/person.svg';
import { ReactComponent as LogoutIcon } from '../../resources/img/icons/out.svg';
import { ReactComponent as CalendarIcon } from '../../resources/img/icons/calendar2.svg';
import { ReactComponent as CalendarMonthIcon } from '../../resources/img/icons/calendar-month-navigation.svg';
import clsx from 'clsx';
import { RocketChatUnreadContext } from '../../globalState/provider/RocketChatUnreadProvider';
import { apiFinishAnonymousConversation } from '../../api';

export interface NavigationBarProps {
	onLogout: any;
	routerConfig: any;
}

export const NavigationBar = ({
	onLogout,
	routerConfig
}: NavigationBarProps) => {
	const { userData } = useContext(UserDataContext);
	const { consultingTypes } = useContext(ConsultingTypesContext);
	const { sessions } = useContext(SessionsDataContext);

	const sessionId = sessions?.[0]?.session?.id;

	const {
		sessions: unreadSessions,
		group: unreadGroup,
		teamsessions: unreadTeamSessions
	} = useContext(RocketChatUnreadContext);

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

	const resolveClassnameForWalkthrough = (index) => {
		switch (index) {
			case 0:
				return 'walkthrough_step_1';
			case 1:
				return 'walkthrough_step_3';
			case 2:
				return 'walkthrough_step_5';
			case 3:
				return 'walkthrough_step_6';
		}
	};

	return (
		<div className="navigation__wrapper">
			<div className="navigation__itemContainer">
				{routerConfig.navigation
					.filter(
						(item: any) =>
							!item.condition ||
							item.condition(userData, consultingTypes, sessions)
					)
					.map((item, index) => (
						<Link
							key={index}
							className={`navigation__item ${resolveClassnameForWalkthrough(
								index
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
							{
								{
									'inbox': (
										<InboxIcon className="navigation__icon" />
									),
									'speech-bubbles': (
										<SpeechBubbleIcon className="navigation__icon" />
									),
									'speech-bubbles-team': (
										<SpeechBubbleTeamIcon className="navigation__icon" />
									),
									'person': (
										<PersonIcon className="navigation__icon" />
									),
									'calendar': (
										<CalendarIcon className="navigation__icon" />
									),
									'booking-events': (
										<CalendarMonthIcon className="navigation__icon" />
									)
								}[item.icon]
							}
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
								pathsToShowUnreadMessageNotification[item.to] >
									0 && (
									<NavigationUnreadIndicator
										animate={animateNavIcon}
									/>
								)}
						</Link>
					))}
				<div
					onClick={handleLogout}
					className={clsx(
						'navigation__item navigation__item__logout',
						{
							'navigation__item__logout--consultant':
								hasUserAuthority(
									AUTHORITIES.CONSULTANT_DEFAULT,
									userData
								)
						}
					)}
				>
					<LogoutIcon className="navigation__icon" />
					<span className="navigation__title">
						{translate('app.logout')}
					</span>
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
