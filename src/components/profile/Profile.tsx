import * as React from 'react';
import { useState, useRef, useContext, useEffect, Fragment } from 'react';
import { logout } from '../logout/logout';
import {
	AgencySpecificContext,
	AUTHORITIES,
	ConsultingTypesContext,
	hasUserAuthority,
	LocaleContext,
	UserDataContext,
	useTenant
} from '../../globalState';
import { ReactComponent as PersonIcon } from '../../resources/img/icons/person.svg';
import { ReactComponent as LogoutIcon } from '../../resources/img/icons/out.svg';
import { ReactComponent as BackIcon } from '../../resources/img/icons/arrow-left.svg';
import { Text } from '../text/Text';
import './profile.styles';
import profileRoutes from './profile.routes';
import {
	Link,
	NavLink,
	Redirect,
	Route,
	Switch,
	useLocation,
	generatePath
} from 'react-router-dom';
import { Box } from '../box/Box';
import { useResponsive } from '../../hooks/useResponsive';
import {
	isLinkMenuComponent,
	isLinkMenuGroup,
	isLinkMenuItem,
	LinkMenu,
	LinkMenuComponentType,
	LinkMenuGroupType,
	LinkMenuItemType
} from '../mobile/linkMenu/LinkMenu';
import {
	solveTabConditions,
	isTabGroup,
	solveCondition,
	solveGroupConditions,
	COLUMN_LEFT,
	SingleComponentType,
	TabGroups,
	TabType
} from '../../utils/tabsHelper';
import { useTranslation } from 'react-i18next';
import { LegalLinksContext } from '../../globalState/provider/LegalLinksProvider';
import { useAppConfig } from '../../hooks/useAppConfig';
import useIsFirstVisit from '../../utils/useIsFirstVisit';

export const Profile = () => {
	const settings = useAppConfig();
	const tenant = useTenant();
	const { t: translate } = useTranslation();
	const location = useLocation();
	const { fromL } = useResponsive();
	const isFirstVisit = useIsFirstVisit();

	const legalLinks = useContext(LegalLinksContext);
	const { userData } = useContext(UserDataContext);
	const { specificAgency } = useContext(AgencySpecificContext);
	const { consultingTypes } = useContext(ConsultingTypesContext);

	const [mobileMenu, setMobileMenu] = useState<
		(LinkMenuGroupType | LinkMenuItemType | LinkMenuComponentType)[]
	>([]);

	const scrollContainer = useRef<HTMLDivElement>();
	const ref_tabs = useRef<any>([]);

	const { selectableLocales } = useContext(LocaleContext);

	useEffect(() => {
		// Navigation is hidden and header shown on small screens if there is no enquiry yet. Should be as usual on profile routes
		document
			.querySelector('.navigation__wrapper')
			?.classList.remove('navigation__wrapper--mobileHidden');
		document.querySelector('.header')?.classList.remove('header--mobile');
	}, []);

	useEffect(() => {
		scrollContainer.current.scrollTo(0, 0);
	}, [location]);

	useEffect(() => {
		setMobileMenu(
			profileRoutes(settings, tenant, selectableLocales, isFirstVisit)
				.filter((tab) =>
					solveTabConditions(tab, userData, consultingTypes ?? [])
				)
				.map(
					(tab): LinkMenuGroupType => ({
						title: translate(tab.title),
						items: tab.elements
							.filter((element) =>
								isTabGroup(element)
									? solveGroupConditions(
											element,
											userData,
											consultingTypes ?? []
									  )
									: solveCondition(
											element.condition,
											userData,
											consultingTypes ?? []
									  )
							)
							.map((element) =>
								isTabGroup(element)
									? {
											title: translate(element.title),
											url: (element as unknown as TabType)
												.externalLink
												? element.url
												: `/profile${tab.url}${element.url}`,
											showBadge: (
												element as unknown as TabType
											)?.notificationBubble,
											externalLink: element.externalLink
									  }
									: {
											component: <element.component />
									  }
							)
					})
				)
		);
	}, [
		consultingTypes,
		translate,
		settings,
		userData,
		selectableLocales,
		tenant,
		isFirstVisit
	]);

	const [subpage, setSubpage] = useState(undefined);
	useEffect(() => {
		setSubpage(
			mobileMenu
				.reduce(
					(acc, curr) =>
						isLinkMenuComponent(curr)
							? acc
							: acc.concat(
									isLinkMenuGroup(curr)
										? curr.items
												.map((c) =>
													isLinkMenuItem(c)
														? {
																title: c.title,
																url: c.url
														  }
														: null
												)
												.filter(Boolean)
										: { title: curr.title, url: curr.url }
							  ),
					[]
				)
				.find(({ url }) => url === location.pathname)
		);
	}, [mobileMenu, location.pathname]);

	const handleLogout = () => {
		logout();
	};

	const isConsultant = hasUserAuthority(
		AUTHORITIES.CONSULTANT_DEFAULT,
		userData
	);

	let headline = userData.userName;

	if (isConsultant) {
		// 'firstName lastName' before displayName
		if (userData.firstName || userData.lastName)
			headline = `${userData.firstName} ${userData.lastName}`;
		else if (userData.displayName) headline = userData.displayName;
	}

	const handleKeyDownTabs = (e, index) => {
		if (e.key === 'Enter' || e.key === ' ') {
			ref_tabs.current[index].click();
		}
		if (e.key === 'ArrowLeft') {
			if (index === 0) {
				ref_tabs.current[ref_tabs.current.length - 1].focus();
				ref_tabs.current[ref_tabs.current.length - 1].setAttribute(
					'tabindex',
					'0'
				);
				ref_tabs.current[0].setAttribute('tabindex', '-1');
			} else {
				ref_tabs.current[index - 1].focus();
				ref_tabs.current[index - 1].setAttribute('tabindex', '0');
				ref_tabs.current[index].setAttribute('tabindex', '-1');
			}
		}
		if (e.key === 'ArrowRight') {
			if (index === ref_tabs.current.length - 1) {
				ref_tabs.current[0].focus();
				ref_tabs.current[0].setAttribute('tabindex', '0');
				ref_tabs.current[ref_tabs.current.length - 1].setAttribute(
					'tabindex',
					'-1'
				);
			} else {
				ref_tabs.current[index + 1].focus();
				ref_tabs.current[index + 1].setAttribute('tabindex', '0');
				ref_tabs.current[index].setAttribute('tabindex', '-1');
			}
		}
	};

	return (
		<div className="profile__wrapper" ref={scrollContainer}>
			<div className="profile__header">
				<div className="profile__header__wrapper flex flex--jc-sb flex-l--fd-column flex-xl--fd-row">
					<div
						className={`profile__header__name flex flex--ai-c ${
							(fromL || subpage) && 'flex__col--25p'
						}`}
					>
						{fromL || !subpage ? (
							<>
								<div className="profile__icon flex__col--no-grow">
									<PersonIcon
										aria-label={translate(
											'profile.data.profileIcon'
										)}
										className="profile__icon--user"
										title={translate(
											'profile.data.profileIcon'
										)}
									/>
								</div>
								<h3 className="text--nowrap text--ellipsis">
									{headline}
								</h3>
							</>
						) : (
							<Link to={`/profile`}>
								<BackIcon
									title={translate('app.back')}
									aria-label={translate('app.back')}
								/>
							</Link>
						)}
					</div>
					<div
						className="profile__nav flex flex__col--grow flex__col--shrink flex--jc-c flex--ai-s flex-l__col--50p"
						role="tablist"
					>
						{fromL
							? profileRoutes(
									settings,
									tenant,
									selectableLocales,
									isFirstVisit
							  )
									.filter((tab) =>
										solveTabConditions(
											tab,
											userData,
											consultingTypes ?? []
										)
									)
									.map((tab, index) => (
										<div
											key={tab.url}
											className="text--nowrap flex__col--no-grow profile__nav__item"
										>
											<NavLink
												to={generatePath(
													`/profile${tab.url}`
												)}
												activeClassName="active"
												role="tab"
												tabIndex={index === 0 ? 0 : -1}
												ref={(el) =>
													(ref_tabs.current[index] =
														el)
												}
												onKeyDown={(e) =>
													handleKeyDownTabs(e, index)
												}
											>
												{translate(tab.title)}
												{tab.notificationBubble && (
													<span className="profile__nav__item__badge" />
												)}
											</NavLink>
										</div>
									))
							: subpage && (
									<div className="title text--nowrap text--bold text--center flex__col--50p">
										{subpage?.title}
									</div>
							  )}
					</div>
					<div
						className={`profile__header__actions flex flex--ai-c flex--jc-fe ${
							subpage && 'flex__col--25p'
						}`}
					>
						{!fromL && !subpage && (
							<div
								onClick={handleLogout}
								className="profile__header__logout flex__col--no-grow"
							>
								<LogoutIcon
									title={translate('app.logout')}
									aria-label={translate('app.logout')}
								/>
							</div>
						)}
					</div>
				</div>
			</div>
			<div className="profile__innerWrapper">
				<div>
					<Switch>
						{fromL ? (
							// Render tabs for desktop
							profileRoutes(
								settings,
								tenant,
								selectableLocales,
								isFirstVisit
							)
								.filter((tab) =>
									solveTabConditions(
										tab,
										userData,
										consultingTypes ?? []
									)
								)
								.map((tab) => (
									<Route
										path={`/profile${tab.url}`}
										key={`/profile${tab.url}`}
									>
										<div className="profile__content">
											{tab.elements
												.reduce(
													(
														acc: SingleComponentType[],
														element
													) =>
														acc.concat(
															isTabGroup(element)
																? element.elements
																: element
														),
													[]
												)
												.filter((element) =>
													solveCondition(
														element.condition,
														userData,
														consultingTypes ?? []
													)
												)
												.sort(
													(a, b) =>
														(a?.order || 99) -
														(b?.order || 99)
												)
												.map((element, i) => (
													<ProfileItem
														key={i}
														element={element}
														index={i}
													/>
												))}
										</div>
									</Route>
								))
						) : (
							// Render submenu for mobile
							<Route
								path={profileRoutes(
									settings,
									tenant,
									selectableLocales,
									isFirstVisit
								)
									.filter((tab) =>
										solveTabConditions(
											tab,
											userData,
											consultingTypes ?? []
										)
									)
									.map((tab) => `/profile${tab.url}`)}
								exact
							>
								<div className="profile__content">
									<LinkMenu items={mobileMenu} />
								</div>
							</Route>
						)}

						{!fromL &&
							// Render groups as routes for mobile
							profileRoutes(
								settings,
								tenant,
								selectableLocales,
								isFirstVisit
							)
								.filter((tab) =>
									solveTabConditions(
										tab,
										userData,
										consultingTypes ?? []
									)
								)
								.map((tab) => {
									return tab.elements
										.filter((element) =>
											solveGroupConditions(
												element,
												userData,
												consultingTypes ?? []
											)
										)
										.map((element) =>
											isTabGroup(element) ? (
												<Route
													path={`/profile${tab.url}${element.url}`}
													key={`/profile${tab.url}${element.url}`}
												>
													<div className="profile__content">
														<ProfileGroup
															group={element}
															key={`/profile${tab.url}${element.url}`}
														/>
													</div>
												</Route>
											) : (
												<Route
													path={`/profile${tab.url}`}
													key={`/profile${tab.url}`}
												>
													<element.component />
												</Route>
											)
										);
								})}

						<Redirect
							to={`/profile${
								profileRoutes(
									settings,
									tenant,
									selectableLocales,
									isFirstVisit
								)[0].url
							}`}
						/>
					</Switch>
				</div>
				<div className="profile__footer">
					{legalLinks.map((legalLink, index) => (
						<Fragment
							key={legalLink.getUrl({ aid: specificAgency?.id })}
						>
							{index > 0 && (
								<Text
									type="infoSmall"
									className="profile__footer__separator"
									text=" | "
								/>
							)}
							<a
								key={legalLink.getUrl({
									aid: specificAgency?.id
								})}
								href={legalLink.getUrl({
									aid: specificAgency?.id
								})}
								target="_blank"
								rel="noreferrer"
							>
								<Text
									className="profile__footer__item"
									type="infoSmall"
									text={translate(legalLink.label)}
								/>
							</a>
						</Fragment>
					))}
				</div>
			</div>
		</div>
	);
};

const ProfileItem = ({
	element
}: {
	element: SingleComponentType;
	index: number;
}) => (
	<div
		className={`profile__item ${
			element.fullWidth
				? 'full'
				: element.column === COLUMN_LEFT
				? 'left'
				: 'right'
		}`}
	>
		{element.boxed === false ? (
			<element.component />
		) : (
			<Box>
				<element.component />
			</Box>
		)}
	</div>
);

const ProfileGroup = ({ group }: { group: TabGroups }) => {
	const { userData } = useContext(UserDataContext);
	const { consultingTypes } = useContext(ConsultingTypesContext);

	return (
		<>
			{group.elements
				.filter((element) =>
					solveCondition(
						element.condition,
						userData,
						consultingTypes ?? []
					)
				)
				.sort((a, b) => (a?.order || 99) - (b?.order || 99))
				.map((element, i) => (
					<ProfileItem key={i} element={element} index={i} />
				))}
		</>
	);
};
