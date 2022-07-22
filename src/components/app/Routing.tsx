import * as React from 'react';
import { useContext, useMemo } from 'react';
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
	LegalLinkInterface,
	ConsultingTypesContext,
	E2EEProvider,
	SessionTypeProvider
} from '../../globalState';
import { NavigationBar } from './NavigationBar';
import { Header } from '../header/Header';
import { FinishedAnonymousConversationHandler } from './FinishedAnonymousConversationHandler';
import { ReleaseNote } from '../releaseNote/ReleaseNote';
import { NonPlainRoutesWrapper } from './NonPlainRoutesWrapper';
import { Walkthrough } from '../walkthrough/Walkthrough';

interface RoutingProps {
	logout?: Function;
	legalLinks: Array<LegalLinkInterface>;
	spokenLanguages: string[];
}

export const Routing = (props: RoutingProps) => {
	const { userData } = useContext(UserDataContext);
	const { consultingTypes } = useContext(ConsultingTypesContext);

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

	const allRoutes = () =>
		[
			...(routerConfig.listRoutes || []),
			...(routerConfig.detailRoutes || []),
			...(routerConfig.userProfileRoutes || []),
			...(routerConfig.profileRoutes || []),
			...(routerConfig.appointmentRoutes || [])
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
				<Walkthrough />
				<E2EEProvider>
					<NonPlainRoutesWrapper logoutHandler={() => props.logout()}>
						<div className="app__wrapper">
							<NavigationBar
								routerConfig={routerConfig}
								onLogout={() => props.logout()}
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
												>
													<SessionTypeProvider
														type={
															route.type || null
														}
													>
														<route.component
															sessionTypes={
																route.sessionTypes
															}
														/>
													</SessionTypeProvider>
												</Route>
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
													render={(
														componentProps
													) => (
														<SessionTypeProvider
															type={
																route.type ||
																null
															}
														>
															<route.component
																{...componentProps}
																{...props}
																type={
																	route.type ||
																	null
																}
															/>
														</SessionTypeProvider>
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
																	path={
																		route.path
																	}
																	render={(
																		props
																	) => (
																		<SessionTypeProvider
																			type={
																				route.type ||
																				null
																			}
																		>
																			<route.component
																				{...props}
																				type={
																					route.type ||
																					null
																				}
																			/>
																		</SessionTypeProvider>
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
														exact={
															route.exact ?? true
														}
														key={`profile-${route.path}`}
														path={route.path}
														render={() => (
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

								<div className="contentWrapper__booking">
									<Switch>
										{routerConfig.appointmentRoutes?.map(
											(route: any): JSX.Element => (
												<Route
													exact={route.exact ?? true}
													key={`booking-${route.path}`}
													path={route.path}
													render={() => (
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
					</NonPlainRoutesWrapper>
				</E2EEProvider>
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
