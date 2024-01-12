import * as React from 'react';
import { useContext, useMemo, Suspense } from 'react';
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
import { TwoFactorNag } from '../twoFactorAuth/TwoFactorNag';
import { useAppConfig } from '../../hooks/useAppConfig';
import { useAskerHasAssignedConsultant } from '../../containers/bookings/hooks/useAskerHasAssignedConsultant';
import { TermsAndConditions } from '../termsandconditions/TermsAndConditions';
import { Loading } from './Loading';

interface RoutingProps {
	logout?: Function;
}

export const Routing = (props: RoutingProps) => {
	const settings = useAppConfig();
	const { userData } = useContext(UserDataContext);
	const { consultingTypes } = useContext(ConsultingTypesContext);
	const hasAssignedConsultant = useAskerHasAssignedConsultant();

	const routerConfig = useMemo(() => {
		if (hasUserAuthority(AUTHORITIES.VIEW_ALL_PEER_SESSIONS, userData)) {
			return RouterConfigMainConsultant(settings);
		}
		if (hasUserAuthority(AUTHORITIES.USE_FEEDBACK, userData)) {
			return RouterConfigPeerConsultant(settings);
		}
		if (
			hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) &&
			userData.inTeamAgency
		) {
			return RouterConfigTeamConsultant(settings);
		}
		if (hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData)) {
			return RouterConfigConsultant(settings);
		}
		if (hasUserAuthority(AUTHORITIES.ANONYMOUS_DEFAULT, userData)) {
			return RouterConfigAnonymousAsker();
		}
		return RouterConfigUser(settings, hasAssignedConsultant);
	}, [userData, settings, hasAssignedConsultant]);

	const allRoutes = () =>
		[
			...(routerConfig.listRoutes || []),
			...(routerConfig.detailRoutes || []),
			...(routerConfig.userProfileRoutes || []),
			...(routerConfig.profileRoutes || []),
			...(routerConfig.appointmentRoutes || []),
			...(routerConfig.toolsRoutes || [])
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
							<route.component />
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
								<div className="contentWrapper__content">
									<Switch>
										<Route
											path={[
												...(routerConfig.listRoutes?.map(
													(route: any) => route.path
												) || []),
												...(routerConfig.detailRoutes?.map(
													(route: any) => route.path
												) || [])
											]}
										>
											<div className="contentWrapper__list">
												<Switch>
													{routerConfig.listRoutes.map(
														(
															route: any
														): JSX.Element => (
															<Route
																exact={
																	route.exact ??
																	true
																}
																key={`list-${route.path}`}
																path={
																	route.path
																}
															>
																<SessionTypeProvider
																	type={
																		route.type ||
																		null
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
												<Suspense
													fallback={<Loading />}
												>
													<Switch>
														{typeof routerConfig.userProfileRoutes !==
															'undefined' &&
															routerConfig.userProfileRoutes.map(
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
																			<div className="contentWrapper__userProfile">
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
																			</div>
																		)}
																	/>
																)
															)}

														{routerConfig.detailRoutes.map(
															(
																route: any
															): JSX.Element => (
																<Route
																	exact={
																		route.exact ??
																		true
																	}
																	key={`detail-${route.path}`}
																	path={
																		route.path
																	}
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
												</Suspense>
											</div>
										</Route>
										<Route
											path={
												routerConfig.profileRoutes?.map(
													(route: any) => route.path
												) || []
											}
										>
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
															(
																route: any
															): JSX.Element => (
																<Route
																	exact={
																		route.exact ??
																		true
																	}
																	key={`profile-${route.path}`}
																	path={
																		route.path
																	}
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
										</Route>
										<Route
											path={
												routerConfig.appointmentRoutes?.map(
													(route: any) => route.path
												) || []
											}
										>
											<div className="contentWrapper__booking">
												<Switch>
													{routerConfig.appointmentRoutes?.map(
														(
															route: any
														): JSX.Element => (
															<Route
																exact={
																	route.exact ??
																	true
																}
																key={`booking-${route.path}`}
																path={
																	route.path
																}
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
										</Route>
										<Route
											path={
												routerConfig.toolsRoutes?.map(
													(route: any) => route.path
												) || []
											}
										>
											<div className="contentWrapper__tools">
												<Switch>
													{routerConfig.toolsRoutes?.map(
														(
															route: any
														): JSX.Element => (
															<Route
																exact={
																	route.exact ??
																	true
																}
																key={`tools-${route.path}`}
																path={
																	route.path
																}
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
										</Route>
									</Switch>
								</div>
							</section>
							{(hasUserAuthority(
								AUTHORITIES.ASKER_DEFAULT,
								userData
							) ||
								hasUserAuthority(
									AUTHORITIES.CONSULTANT_DEFAULT,
									userData
								)) && <TermsAndConditions />}
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
							{hasUserAuthority(
								AUTHORITIES.CONSULTANT_DEFAULT,
								userData
							) && <TwoFactorNag />}
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
