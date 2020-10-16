import * as React from 'react';
import { useContext, useEffect } from 'react';
import { Route, Link } from 'react-router-dom';
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { translate } from '../../../resources/ts/i18n/translate';
import {
	RouterConfigUser,
	RouterConfigConsultant,
	RouterConfigTeamConsultant,
	RouterConfigMainConsultant,
	RouterConfigU25Consultant
} from './RouterConfig';
import { AbsenceHandler } from './AbsenceHandler';
import {
	UserDataContext,
	UnreadSessionsStatusContext,
	hasUserAuthority,
	AUTHORITIES
} from '../../../globalState';
import { history } from './app';
import { initNavigationHandler } from './navigationHandler';
import { SessionsListWrapper } from '../../sessionsList/ts/SessionsListWrapper';
import { config } from '../../../resources/ts/config';
import { getTokenFromCookie } from '../../sessionCookie/ts/accessSessionCookie';

export const AppRouter = (props) => {
	const { userData } = useContext(UserDataContext);
	const { unreadSessionsStatus } = useContext(UnreadSessionsStatusContext);

	let routerConfig = RouterConfigUser();
	if (hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData)) {
		routerConfig = RouterConfigConsultant();
	}

	if (
		hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) &&
		userData.inTeamAgency
	) {
		routerConfig = RouterConfigTeamConsultant();
	}

	if (hasUserAuthority(AUTHORITIES.USE_FEEDBACK, userData)) {
		routerConfig = RouterConfigU25Consultant();
	}

	if (hasUserAuthority(AUTHORITIES.VIEW_ALL_PEER_SESSIONS, userData)) {
		routerConfig = RouterConfigMainConsultant();
	}

	useEffect(() => {
		history.push(
			'/sessions/' +
				(hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData)
					? 'consultant/sessionPreview'
					: 'user/view')
		);
		initNavigationHandler();

		initLiveServiceSocket();
	}, []);

	const initLiveServiceSocket = () => {
		const socket = new SockJS(config.endpoints.liveservice);
		const stompClient = Stomp.over(socket);
		// implement for release to deactivate stomp logging
		// stompClient.debug = null;

		stompClient.connect(
			{
				accessToken: getTokenFromCookie('keycloak')
			},
			(frame) => {
				console.log('Connected: ' + frame);
				stompClient.subscribe('/events', function (message) {
					console.log(JSON.parse(message.body));
				});
			}
		);
		stompClient.onWebSocketClose = (error) => {
			console.log('Error', error);
		};
	};

	return (
		<div className="app__wrapper">
			<div className="navigation__wrapper">
				{routerConfig.navigation.map((item, index) => (
					<Link
						key={index}
						className={`navigation__item ${
							window.location.href.indexOf(item.to) != -1
								? 'navigation__item--active'
								: null
						}`}
						to={item.to}
					>
						{((icon) => {
							switch (icon) {
								case 'speech-bubbles':
									return (
										<svg
											className="navigation__icon"
											xmlns="http://www.w3.org/2000/svg"
											xmlnsXlink="http://www.w3.org/1999/xlink"
											width="72"
											height="72"
											viewBox="0 0 72 72"
										>
											<defs>
												<path
													id="speech-bubble-a"
													d="M51.7091882,23.2881356 L62.0338983,23.2881356 C64.2152542,23.2881356 66,25.1644068 66,27.4576271 L66,64.9830508 L57.0677966,56.6440678 L30.3050847,56.6440678 C28.1237288,56.6440678 26.3389831,54.7677966 26.3389831,52.4745763 L26.3389831,43.8148631 L43.2471008,43.8148631 C47.9115211,43.8148631 51.7091882,39.8224438 51.7091882,34.9188225 L51.7091882,23.2881356 Z M41.6949153,6 C43.8762712,6 45.6610169,7.83050847 45.6610169,10.0677966 L45.6610169,34.4745763 C45.6610169,36.7118644 43.8762712,38.5423729 41.6949153,38.5423729 L14.9322034,38.5423729 L6,46.6779661 L6,10.0677966 C6,7.83050847 7.78474576,6 9.96610169,6 L41.6949153,6 Z"
												/>
											</defs>
											<use xlinkHref="#speech-bubble-a"></use>
										</svg>
									);
								case 'envelope':
									return (
										<svg
											className="navigation__icon"
											xmlns="http://www.w3.org/2000/svg"
											xmlnsXlink="http://www.w3.org/1999/xlink"
											width="72"
											height="72"
											viewBox="0 0 72 72"
										>
											<defs>
												<path
													id="envelope-a"
													d="M65.9962502,28 L65.9962502,55.4657784 C65.9962502,56.9883189 65.471908,58.2913243 64.4232235,59.3747946 C63.3745391,60.4582649 62.1133679,61 60.63971,61 L11.3565402,61 C9.88288232,61 8.62171114,60.4582649 7.57302669,59.3747946 C6.52434223,58.2913243 6,56.9883189 6,55.4657784 L6,28 C6.9824386,29.1299601 8.10986813,30.1333646 9.38228861,31.0102137 C17.4617836,36.683259 23.008312,40.6613642 26.0218736,42.9445292 C27.2942941,43.9130664 28.3267296,44.6685255 29.1191801,45.2109063 C29.9116305,45.7532872 30.9665646,46.3066448 32.2839823,46.8709791 C33.6013999,47.4353135 34.8288232,47.7181263 35.9662521,47.7194177 L36.0337479,47.7194177 C37.1724267,47.7194177 38.39985,47.4366048 39.7160177,46.8709791 C41.0321855,46.3053534 42.0871196,45.7519958 42.8808199,45.2109063 C43.6745203,44.6698169 44.7069558,43.9143578 45.9781264,42.9445292 C49.7728892,40.1086523 55.3306668,36.1305471 62.6514593,31.0102137 C63.9238798,30.1114111 65.04006,29.1080066 66,28 L65.9962502,28 Z M66,18.359955 C66,20.1234846 65.4531592,21.808274 64.3594775,23.4143232 C63.2657959,25.0203725 61.904006,26.3927009 60.2741079,27.5313086 C51.8821324,33.3568304 46.6593338,36.983877 44.6057121,38.4124484 C44.3819761,38.5686789 43.9076308,38.9092613 43.1826761,39.4341957 C42.4577214,39.9591301 41.855259,40.3834521 41.375289,40.7071616 C40.895319,41.0308711 40.3147303,41.3933258 39.6335229,41.7945257 C38.9523155,42.1957255 38.3104806,42.4969379 37.7080182,42.6981627 C37.1055559,42.8993876 36.5474658,43 36.0337479,43 L35.9662521,43 C35.4525342,43 34.8944441,42.8993876 34.2919818,42.6981627 C33.6895194,42.4969379 33.0476845,42.1957255 32.3664771,41.7945257 C31.6852697,41.3933258 31.104681,41.0308711 30.624711,40.7071616 C30.144741,40.3834521 29.5422786,39.9591301 28.8173239,39.4341957 C28.0923692,38.9092613 27.6180239,38.5686789 27.3942879,38.4124484 C25.3631648,36.983877 22.4389726,34.9472566 18.6217111,32.3025872 C14.8044497,29.6579178 12.5164677,28.0674916 11.7577651,27.5313086 C10.3741016,26.5939258 9.06855822,25.3047119 7.84113493,23.663667 C6.61371164,22.0226222 6,20.4990626 6,19.0929884 C6,17.351956 6.46309606,15.9015123 7.38928817,14.7416573 C8.31548028,13.5818023 9.63789763,13.0012498 11.3565402,13 L60.63971,13 C62.0908693,13 63.3464158,13.5243095 64.4063496,14.5729284 C65.4662834,15.6215473 65.9962502,16.8826397 65.9962502,18.3562055 L66,18.359955 Z"
												/>
											</defs>
											<use xlinkHref="#envelope-a" />
										</svg>
									);
								case 'person':
									return (
										<svg
											className="navigation__icon"
											xmlns="http://www.w3.org/2000/svg"
											xmlnsXlink="http://www.w3.org/1999/xlink"
											width="72"
											height="72"
											viewBox="0 0 72 72"
										>
											<defs>
												<path
													id="person-a"
													d="M35.9230769,28 C33,28 30.3846154,26.9305556 28.2307692,24.7916667 C26.0769231,22.6527778 25,20.0555556 25,17 C25,13.9444444 26.0769231,11.5 28.0769231,9.20833333 C30.2307692,7.06944444 32.8461538,6 35.9230769,6 C39,6 41.6153846,7.06944444 43.7692308,9.20833333 C45.9230769,11.3472222 47,13.9444444 47,17 C47,20.0555556 45.9230769,22.6527778 43.7692308,24.7916667 C41.6153846,26.9305556 39,28 35.9230769,28 Z M27.5290807,32.8491306 C29.7354597,35.1432731 32.4146341,36.2903443 35.4090056,36.2903443 C38.5609756,36.2903443 41.2401501,35.1432731 43.4465291,32.8491306 C43.711905,32.5731988 43.9613216,32.2901553 44.194779,32 L46.7560976,32 C52.4136487,32 57,36.8021314 57,42.7258607 L57,58.8146517 C50.747518,63.6048839 43.373759,66 36,66 C28.626241,66 21.252482,63.6048839 15,58.8146517 L15,42.7258607 C15,36.8021314 19.5863513,32 25.2439024,32 L26.7808308,32 C27.0142881,32.2901553 27.2637048,32.5731988 27.5290807,32.8491306 Z"
												/>
											</defs>
											<use xlinkHref="#person-a" />
										</svg>
									);
								case 'speech-bubbles-team':
									return (
										<svg
											className="navigation__icon"
											xmlns="http://www.w3.org/2000/svg"
											xmlnsXlink="http://www.w3.org/1999/xlink"
											width="72"
											height="72"
											viewBox="0 0 72 72"
										>
											<defs>
												<path
													id="speech-bubble-team-a"
													d="M27,8 C28.1,8 29,8.9160898 29,10.0357551 L29,22.2502857 C29,23.369951 28.1,24.2860408 27,24.2860408 L13.5042735,24.2860408 L9,28.3575511 L9,10.0357551 C9,8.9160898 9.9,8 11,8 L27,8 Z M43.8,31 C45.56,31 47,32.4657437 47,34.2572082 L47,53.8004572 C47,55.5919217 45.56,57.0576654 43.8,57.0576654 L22.2068376,57.0576654 L15,63.5720817 L15,34.2572082 C15,32.4657437 16.44,31 18.2,31 L43.8,31 Z M53,37.1718531 L53,32.2572082 C53,28.2723141 49.7851594,25 45.8,25 L38,25 L38,18.6464816 C38,17.1909167 39.17,16 40.6,16 L61.4,16 C62.83,16 64,17.1909167 64,18.6464816 L64,42.4648164 L58.1444444,37.1718531 L53,37.1718531 Z"
												/>
											</defs>
											<use xlinkHref="#speech-bubble-team-a" />
										</svg>
									);
							}
						})(item.icon)}
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
							switch (to) {
								case '/sessions/consultant/sessionView':
									return unreadSessionsStatus.sessions !==
										'0' ? (
										<span className="navigation__item__count">
											{unreadSessionsStatus.sessions}
										</span>
									) : null;
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
					<svg
						className="navigation__icon"
						xmlns="http://www.w3.org/2000/svg"
						xmlnsXlink="http://www.w3.org/1999/xlink"
						width="72"
						height="72"
						viewBox="0 0 72 72"
					>
						<defs>
							<path
								id="out-a"
								d="M41,6 L10,6 C8.8954305,6 8,6.8954305 8,8 L8,64 C8,65.1045695 8.8954305,66 10,66 L41,66 L41,6 Z M41,13 L41,59 L15,59 L15,13 L41,13 Z M50.2647746,21.5814976 L63.4416307,34.5863568 C63.8138769,34.9342368 64,35.3698996 64,35.8933452 C64,36.4167908 63.8138769,36.8524535 63.4416307,37.2003335 L50.2647746,50.2051928 C49.6959736,50.8055838 49.009679,50.9410511 48.2058908,50.6115946 C47.4416331,50.2821382 47.0595043,49.7110081 47.0595043,48.8982044 L47.0595043,41.467553 L33.8826482,41.467553 C33.373143,41.467553 32.9317184,41.2838593 32.5583741,40.9164721 C32.1850299,40.5490848 31.9989068,40.113422 32.0000048,39.6094837 L32.0000048,32.1788323 C32.0000048,31.6759777 32.1861279,31.2403149 32.5583741,30.8718439 C32.9306203,30.5033729 33.372045,30.3196792 33.8826482,30.320763 L47.0595043,30.320763 L47.0595043,22.8901115 C47.0595043,22.0773078 47.4416331,21.5061778 48.2058908,21.1767213 C49.009679,20.8456393 49.6959736,20.9811066 50.2647746,21.5814976 Z"
							/>
						</defs>
						<use xlinkHref="#out-a" />
					</svg>
					<span className="navigation__title">
						{translate('app.logout')}
					</span>
				</div>
			</div>

			<section className="contentWrapper">
				<div className="contentWrapper__header">
					<h1 className="contentWrapper__title">
						{translate('app.title')}
					</h1>
					<p className="contentWrapper__claim">
						{translate('app.claim')}
					</p>
				</div>
				<div className="contentWrapper__list">
					{routerConfig.listRoutes.map((route, index) => (
						<Route
							key={index}
							path={route.path}
							component={SessionsListWrapper}
						/>
					))}
				</div>
				<div className="contentWrapper__detail">
					{routerConfig.detailRoutes.map((route, index) => (
						<Route
							exact
							key={index}
							path={route.path}
							component={(props) => (
								<route.component
									{...props}
									type={route.type || null}
								/>
							)}
						/>
					))}

					{((hasUserProfileRoutes) => {
						if (hasUserProfileRoutes) {
							return (
								<div className="contentWrapper__userProfile">
									{routerConfig.userProfileRoutes.map(
										(route, index) => (
											<Route
												exact
												key={index}
												path={route.path}
												component={(props) => (
													<route.component
														{...props}
														type={
															route.type || null
														}
													/>
												)}
											/>
										)
									)}
								</div>
							);
						}
					})(typeof routerConfig.userProfileRoutes !== 'undefined')}
				</div>
				{((hasProfileRoutes) => {
					if (hasProfileRoutes) {
						return (
							<div className="contentWrapper__profile">
								{routerConfig.profileRoutes.map(
									(route, index) => (
										<Route
											exact
											key={index}
											path={route.path}
											component={(props) => (
												<route.component
													{...props}
													type={route.type || null}
												/>
											)}
										/>
									)
								)}
							</div>
						);
					}
				})(typeof routerConfig.profileRoutes !== 'undefined')}
			</section>
			<AbsenceHandler></AbsenceHandler>
		</div>
	);
};
