import * as React from 'react';
import { useState, useRef, useContext, useEffect, Fragment } from 'react';
import { logout } from '../logout/logout';
import {
	AUTHORITIES,
	hasUserAuthority,
	LocaleContext,
	useConsultingTypes,
	UserDataContext
} from '../../globalState';
import {
	setProfileWrapperActive,
	setProfileWrapperInactive
} from '../app/navigationHandler';
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
	TabGroups
} from '../../utils/tabsHelper';
import { useTranslation } from 'react-i18next';
import { LegalLinksContext } from '../../globalState/provider/LegalLinksProvider';
import { useAppConfig } from '../../hooks/useAppConfig';

export const Profile = () => {
	const settings = useAppConfig();
	const { t: translate } = useTranslation();
	const location = useLocation();
	const consultingTypes = useConsultingTypes();
	const { fromL } = useResponsive();

	const legalLinks = useContext(LegalLinksContext);
	const { userData } = useContext(UserDataContext);

	const [mobileMenu, setMobileMenu] = useState<
		(LinkMenuGroupType | LinkMenuItemType | LinkMenuComponentType)[]
	>([]);

	const scrollContainer = useRef<HTMLDivElement>();

	const { selectableLocales } = useContext(LocaleContext);

	useEffect(() => {
		setProfileWrapperActive();

		return () => {
			setProfileWrapperInactive();
		};
	}, []);

	useEffect(() => {
		scrollContainer.current.scrollTo(0, 0);
	}, [location]);

	useEffect(() => {
		setMobileMenu(
			profileRoutes(settings, selectableLocales)
				.filter((tab) =>
					solveTabConditions(tab, userData, consultingTypes)
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
											consultingTypes
									  )
									: solveCondition(
											element.condition,
											userData,
											consultingTypes
									  )
							)
							.map((element) =>
								isTabGroup(element)
									? {
											title: translate(element.title),
											url: `/profile${tab.url}${element.url}`
									  }
									: {
											component: <element.component />
									  }
							)
					})
				)
		);
	}, [consultingTypes, translate, settings, userData, selectableLocales]);

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

	return (
		<div className="profile__wrapper" ref={scrollContainer}>
			<div className="profile__header">
				<div className="profile__header__wrapper flex flex--jc-sb flex-l--fd-column flex-xl--fd-row">
					<div className="flex flex__col--25p flex--ai-c">
						{fromL || !subpage ? (
							<>
								<div className="profile__icon flex__col--no-grow">
									<PersonIcon className="profile__icon--user" />
								</div>
								<h3 className="text--nowrap">{headline}</h3>
							</>
						) : (
							<Link to={`/profile`}>
								<BackIcon />
							</Link>
						)}
					</div>
					<div className="profile__nav flex flex__col--grow flex__col--shrink flex--jc-c flex--ai-s flex__col--50p">
						{fromL ? (
							profileRoutes(settings, selectableLocales)
								.filter((tab) =>
									solveTabConditions(
										tab,
										userData,
										consultingTypes
									)
								)
								.map((tab) => (
									<div
										key={tab.url}
										className="text--nowrap flex__col--no-grow"
									>
										<NavLink
											to={generatePath(
												`/profile${tab.url}`
											)}
											activeClassName="active"
										>
											{translate(tab.title)}
										</NavLink>
									</div>
								))
						) : (
							<div className="title text--nowrap text--bold text--center">
								{subpage?.title}
							</div>
						)}
					</div>
					<div className="profile__header__actions flex__col--25p flex flex--ai-c flex--jc-fe">
						{!fromL && !subpage && (
							<div
								onClick={handleLogout}
								className="profile__header__logout flex__col--no-grow"
							>
								<LogoutIcon />
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
							profileRoutes(settings, selectableLocales)
								.filter((tab) =>
									solveTabConditions(
										tab,
										userData,
										consultingTypes
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
														consultingTypes
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
								path={profileRoutes(settings, selectableLocales)
									.filter((tab) =>
										solveTabConditions(
											tab,
											userData,
											consultingTypes
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
							profileRoutes(settings, selectableLocales)
								.filter((tab) =>
									solveTabConditions(
										tab,
										userData,
										consultingTypes
									)
								)
								.map((tab) => {
									return tab.elements
										.filter((element) =>
											solveGroupConditions(
												element,
												userData,
												consultingTypes
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
								profileRoutes(settings, selectableLocales)[0]
									.url
							}`}
						/>
					</Switch>
				</div>

				<div className="profile__footer">
					{legalLinks.map((legalLink, index) => (
						<Fragment key={legalLink.url}>
							{index > 0 && (
								<Text
									type="infoSmall"
									className="profile__footer__separator"
									text=" | "
								/>
							)}
							<a
								key={legalLink.url}
								href={legalLink.url}
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
	const consultingTypes = useConsultingTypes();

	return (
		<>
			{group.elements
				.filter((element) =>
					solveCondition(element.condition, userData, consultingTypes)
				)
				.sort((a, b) => (a?.order || 99) - (b?.order || 99))
				.map((element, i) => (
					<ProfileItem key={i} element={element} index={i} />
				))}
		</>
	);
};
