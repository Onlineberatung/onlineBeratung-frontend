import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { translate } from '../../utils/translate';
import {
	UserDataContext,
	UnreadSessionsStatusContext,
	hasUserAuthority,
	AUTHORITIES,
	ConsultingTypesContext
} from '../../globalState';
import { initNavigationHandler } from './navigationHandler';
import { ReactComponent as InboxIcon } from '../../resources/img/icons/inbox.svg';
import { ReactComponent as SpeechBubbleIcon } from '../../resources/img/icons/speech-bubble.svg';
import { ReactComponent as SpeechBubbleTeamIcon } from '../../resources/img/icons/speech-bubble-team.svg';
import { ReactComponent as PersonIcon } from '../../resources/img/icons/person.svg';
import { ReactComponent as LogoutIcon } from '../../resources/img/icons/out.svg';
import { ReactComponent as CalendarIcon } from '../../resources/img/icons/calendar2.svg';
import clsx from 'clsx';

export interface NavigationBarProps {
	handleLogout: any;
	routerConfig: any;
}

export const NavigationBar = (props: NavigationBarProps) => {
	const { userData } = useContext(UserDataContext);
	const { consultingTypes } = useContext(ConsultingTypesContext);
	const { unreadSessionsStatus, setUnreadSessionsStatus } = useContext(
		UnreadSessionsStatusContext
	);
	const location = useLocation();
	const [animateNavIcon, setAnimateNavIcon] = useState(false);

	useEffect(() => {
		initNavigationHandler();
	}, []);

	useEffect(() => {
		if (
			unreadSessionsStatus.newDirectMessage ||
			(unreadSessionsStatus.mySessions > 0 &&
				unreadSessionsStatus.initialAnimation)
		) {
			if (unreadSessionsStatus.initialAnimation) {
				setUnreadSessionsStatus({
					...unreadSessionsStatus,
					initialAnimation: false
				});
			}
			setAnimateNavIcon(true);
			setTimeout(() => {
				setAnimateNavIcon(false);
			}, 1000);
		}
	}, [unreadSessionsStatus]); // eslint-disable-line react-hooks/exhaustive-deps

	const pathsToShowUnreadMessageNotification = [
		'/sessions/consultant/sessionView',
		'/sessions/user/view'
	];

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
				{props.routerConfig.navigation
					.filter(
						(item: any) =>
							!item.condition ||
							item.condition(userData, consultingTypes)
					)
					.map((item, index) => (
						<Link
							key={index}
							className={`navigation__item ${resolveClassnameForWalkthrough(
								index
							)} ${
								location.pathname.indexOf(item.to) !== -1
									? 'navigation__item--active'
									: ''
							} ${
								animateNavIcon &&
								pathsToShowUnreadMessageNotification.includes(
									item.to
								)
									? 'navigation__item__count--active'
									: ''
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
									)
								}[item.icon]
							}
							{(({ large }) => {
								return (
									<>
										<span className="navigation__title">
											{translate(large)}
										</span>
									</>
								);
							})(item.titleKeys)}
							{((to) => {
								if (
									pathsToShowUnreadMessageNotification.includes(
										to
									) &&
									(unreadSessionsStatus.newDirectMessage ||
										unreadSessionsStatus.mySessions > 0)
								) {
									return (
										<span
											className={`navigation__item__count ${
												unreadSessionsStatus.resetedAnimations
													? 'navigation__item__count--initial'
													: `${
															animateNavIcon
																? 'navigation__item__count--reanimate'
																: ''
													  }`
											}`}
										></span>
									);
								}
							})(item.to)}
						</Link>
					))}
				<div
					onClick={props.handleLogout}
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
