import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { translate } from '../../resources/scripts/i18n/translate';
import {
	UserDataContext,
	UnreadSessionsStatusContext,
	hasUserAuthority,
	AUTHORITIES
} from '../../globalState';
import { initNavigationHandler } from './navigationHandler';
import { ReactComponent as EnvelopeIcon } from '../../resources/img/icons/envelope.svg';
import { ReactComponent as SpeechBubbleIcon } from '../../resources/img/icons/speech-bubble.svg';
import { ReactComponent as SpeechBubbleTeamIcon } from '../../resources/img/icons/speech-bubble-team.svg';
import { ReactComponent as PersonIcon } from '../../resources/img/icons/person.svg';
import { ReactComponent as LogoutIcon } from '../../resources/img/icons/out.svg';

export interface NavigationBarProps {
	handleLogout: any;
	routerConfig: any;
}

export const NavigationBar = (props: NavigationBarProps) => {
	const { userData } = useContext(UserDataContext);
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

	return (
		<div className="navigation__wrapper">
			{props.routerConfig.navigation.map((item, index) => (
				<Link
					key={index}
					className={`navigation__item ${
						location.pathname.indexOf(item.to) !== -1
							? 'navigation__item--active'
							: ''
					} ${
						animateNavIcon &&
						pathsToShowUnreadMessageNotification.includes(item.to)
							? 'navigation__item__count--active'
							: ''
					}`}
					to={item.to}
				>
					{
						{
							'envelope': (
								<EnvelopeIcon className="navigation__icon" />
							),
							'speech-bubbles': (
								<SpeechBubbleIcon className="navigation__icon" />
							),
							'speech-bubbles-team': (
								<SpeechBubbleTeamIcon className="navigation__icon" />
							),
							'person': (
								<PersonIcon className="navigation__icon" />
							)
						}[item.icon]
					}
					{(({ large, small }) => {
						if (small) {
							return (
								<>
									<span className="navigation__title navigation__title--large">
										{translate(large)}
									</span>
									<span className="navigation__title navigation__title--small">
										{translate(small)}
									</span>
								</>
							);
						} else {
							return (
								<>
									<span className="navigation__title">
										{translate(large)}
									</span>
								</>
							);
						}
					})(item.titleKeys)}
					{((to) => {
						if (
							pathsToShowUnreadMessageNotification.includes(to) &&
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
				className={
					!hasUserAuthority(AUTHORITIES.USER_DEFAULT, userData)
						? 'navigation__item navigation__item__logout navigation__item__logout--consultant'
						: 'navigation__item navigation__item__logout'
				}
			>
				<LogoutIcon className="navigation__icon" />
				<span className="navigation__title">
					{translate('app.logout')}
				</span>
			</div>
		</div>
	);
};
