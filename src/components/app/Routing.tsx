import * as React from 'react';
import { useContext, useEffect, useMemo } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import {
	RouterConfigUser,
	RouterConfigConsultant,
	RouterConfigTeamConsultant,
	RouterConfigMainConsultant,
	RouterConfigPeerConsultant,
	RouterConfigAnonymousAsker
} from './RouterConfig';
import { AbsenceHandler } from './AbsenceHandler';
import {
	UserDataContext,
	hasUserAuthority,
	AUTHORITIES,
	SessionsDataContext,
	LegalLinkInterface,
	ConsultingTypesContext
} from '../../globalState';
import { history } from './app';
import { NavigationBar } from './NavigationBar';
import { Header } from '../header/Header';
import { FinishedAnonymousConversationHandler } from './FinishedAnonymousConversationHandler';
import { ReleaseNote } from '../releaseNote/ReleaseNote';

interface routingProps {
	logout?: Function;
	legalLinks: Array<LegalLinkInterface>;
	spokenLanguages: string[];
}

export const Routing = (props: routingProps) => {
	const { userData } = useContext(UserDataContext);
	const { sessionsData } = useContext(SessionsDataContext);
	const { consultingTypes } = useContext(ConsultingTypesContext);
	const sessionGroupId = sessionsData?.mySessions?.[0]?.session?.groupId;
	const sessionId = sessionsData?.mySessions?.[0]?.session?.id;

	const routerConfig = useMemo(() => {
		if (hasUserAuthority(AUTHORITIES.VIEW_ALL_PEER_SESSIONS, userData)) {
			return RouterConfigMainConsultant();
		}
		if (hasUserAuthority(AUTHORITIES.USE_FEEDBACK, userData)) {
			return RouterConfigPeerConsultant();
		}
		if (
			hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) &&
			userData.inTeamAgency
		) {
			return RouterConfigTeamConsultant();
		}
		if (hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData)) {
			return RouterConfigConsultant();
		}
		if (hasUserAuthority(AUTHORITIES.ANONYMOUS_DEFAULT, userData)) {
			return RouterConfigAnonymousAsker();
		}
		return RouterConfigUser();
	}, [userData]);

	// Redirect anonymous live chat users to their one and only session
	useEffect(() => {
		if (hasUserAuthority(AUTHORITIES.ANONYMOUS_DEFAULT, userData)) {
			if (sessionGroupId && sessionId) {
				history.push(
					`/sessions/user/view/${sessionGroupId}/${sessionId}`
				);
			}
		}
	}, [sessionGroupId, sessionId, userData]);

	const allRoutes = () =>
		[
			...(routerConfig.listRoutes || []),
			...(routerConfig.detailRoutes || []),
			...(routerConfig.userProfileRoutes || []),
			...(routerConfig.profileRoutes || [])
		].map((route) => route.path, []);

	return (
		<Switch>
			{routerConfig.plainRoutes
				?.filter(
					(route: any) =>
						!route.condition ||
						route.condition(userData, consultingTypes)
				)
				.map(
					(route: any): JSX.Element => (
						<Route
							exact={route.exact ?? true}
							key={`plain-${route.path}`}
							path={route.path}
						>
							<route.component legalLinks={props.legalLinks} />
						</Route>
					)
				)}
			<Route path={allRoutes()}>
				<div className="app__wrapper">
					<NavigationBar
						routerConfig={routerConfig}
						handleLogout={() => props.logout()}
					/>

					<section className="contentWrapper">
						<Header />
						<div className="contentWrapper__list">
							<Switch>
								{routerConfig.listRoutes.map(
									(route: any): JSX.Element => (
										<Route
											exact={route.exact ?? true}
											key={`list-${route.path}`}
											path={route.path}
											component={route.component}
										/>
									)
								)}
							</Switch>
						</div>
						<div className="contentWrapper__detail">
							<Switch>
								{routerConfig.detailRoutes.map(
									(route: any): JSX.Element => (
										<Route
											exact={route.exact ?? true}
											key={`detail-${route.path}`}
											path={route.path}
											render={(componentProps) => (
												<route.component
													{...componentProps}
													{...props}
													type={route.type || null}
												/>
											)}
										/>
									)
								)}
							</Switch>

							{((hasUserProfileRoutes) => {
								if (hasUserProfileRoutes) {
									return (
										<div className="contentWrapper__userProfile">
											<Switch>
												{routerConfig.userProfileRoutes.map(
													(
														route: any
													): JSX.Element => (
														<Route
															exact={
																route.exact ??
																true
															}
															key={`userProfile-${route.path}`}
															path={route.path}
															render={(props) => (
																<route.component
																	{...props}
																	type={
																		route.type ||
																		null
																	}
																/>
															)}
														/>
													)
												)}
											</Switch>
										</div>
									);
								}
							})(
								typeof routerConfig.userProfileRoutes !==
									'undefined'
							)}
						</div>

						<div className="contentWrapper__profile">
							<Switch>
								{routerConfig.profileRoutes
									?.filter(
										(route: any) =>
											!route.condition ||
											route.condition(
												userData,
												consultingTypes
											)
									)
									.map(
										(route: any): JSX.Element => (
											<Route
												exact={route.exact ?? true}
												key={`profile-${route.path}`}
												path={route.path}
												render={() => (
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
							</Switch>
						</div>
					</section>
					{hasUserAuthority(
						AUTHORITIES.CONSULTANT_DEFAULT,
						userData
					) && <AbsenceHandler />}
					{hasUserAuthority(
						AUTHORITIES.ANONYMOUS_DEFAULT,
						userData
					) && <FinishedAnonymousConversationHandler />}
					{hasUserAuthority(
						AUTHORITIES.CONSULTANT_DEFAULT,
						userData
					) && <ReleaseNote />}
				</div>
			</Route>
			<Redirect
				from="*"
				to={
					'/sessions/' +
					(hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData)
						? 'consultant/sessionPreview'
						: 'user/view')
				}
			/>
		</Switch>
	);
};
