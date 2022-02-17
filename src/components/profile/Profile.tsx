import * as React from 'react';
import { ComponentType, useContext, useEffect, useState } from 'react';
import { logout } from '../logout/logout';
import {
	AUTHORITIES,
	hasUserAuthority,
	useConsultingTypes,
	UserDataContext
} from '../../globalState';
import { ConsultantPrivateData } from './ConsultantPrivateData';
import { ConsultantInformation } from './ConsultantInformation';
import { consultingTypeSelectOptionsSet } from './profileHelpers';
import { AskerAboutMeData } from './AskerAboutMeData';
import { AskerConsultingTypeData } from './AskerConsultingTypeData';
import { AskerRegistration } from './AskerRegistration';
import {
	setProfileWrapperActive,
	setProfileWrapperInactive
} from '../app/navigationHandler';
import { ReactComponent as PersonIcon } from '../../resources/img/icons/person.svg';
import { ReactComponent as LogoutIcon } from '../../resources/img/icons/out.svg';
import { ReactComponent as BackIcon } from '../../resources/img/icons/arrow-left.svg';
import { DeleteAccount } from './DeleteAccount';
import { AbsenceFormular } from '../absenceFormular/AbsenceFormular';
import { PasswordReset } from '../passwordReset/PasswordReset';
import { TwoFactorAuth } from '../twoFactorAuth/TwoFactorAuth';
import { ConsultantStatistics } from './ConsultantStatistics';
import { LegalInformationLinksProps } from '../login/LegalInformationLinks';
import './profile.styles';
import { ConsultantSpokenLanguages } from './ConsultantSpokenLanguages';
import {
	Route,
	Switch,
	NavLink,
	Link,
	Redirect,
	useLocation
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
import { ConsultantAgencies } from './ConsultantAgencies';

interface ProfileProps {
	legalComponent: ComponentType<LegalInformationLinksProps>;
	spokenLanguages: string[];
}

interface TabGroups {
	title: string;
	url: string;
	condition?: (userData, consultingTypes) => boolean;
	elements: SingleComponentType[];
}

interface TabType {
	title: string;
	url: string;
	condition?: (userData, consultingTypes) => boolean;
	elements: (TabGroups | SingleComponentType)[];
}

type SingleComponentType = {
	condition?: (userData, consultingTypes) => boolean;
	component: any;
	boxed?: boolean;
	order?: number;
	fullWidth?: boolean;
};

export const isTabGroup = (
	item: TabGroups | SingleComponentType
): item is TabGroups => {
	return item.hasOwnProperty('elements');
};

type TabsType = TabType[];

const ViewTabs: TabsType = [
	{
		title: 'Allgemeines',
		url: '/allgemeines',
		elements: [
			{
				title: 'Öffentliche Daten',
				url: '/oeffentlich',
				elements: [
					{
						condition: (userData) =>
							hasUserAuthority(
								AUTHORITIES.CONSULTANT_DEFAULT,
								userData
							),
						component: ConsultantInformation
					},
					{
						condition: (userData) =>
							hasUserAuthority(
								AUTHORITIES.CONSULTANT_DEFAULT,
								userData
							),
						component: ConsultantSpokenLanguages
					},
					{
						condition: (userData) =>
							hasUserAuthority(
								AUTHORITIES.CONSULTANT_DEFAULT,
								userData
							),
						component: ConsultantAgencies
					},
					{
						condition: (userData) =>
							!hasUserAuthority(
								AUTHORITIES.CONSULTANT_DEFAULT,
								userData
							),
						component: AskerConsultingTypeData,
						boxed: false,
						order: 2
					},
					{
						condition: (userData, consultingTypes) =>
							!hasUserAuthority(
								AUTHORITIES.CONSULTANT_DEFAULT,
								userData
							) &&
							consultingTypeSelectOptionsSet(
								userData,
								consultingTypes
							).length > 0,
						component: AskerRegistration,
						order: 3
					}
				]
			},
			{
				title: 'Private Daten',
				url: '/privat',
				elements: [
					{
						condition: (userData) =>
							hasUserAuthority(
								AUTHORITIES.CONSULTANT_DEFAULT,
								userData
							),
						component: ConsultantPrivateData
					},
					{
						condition: (userData) =>
							!hasUserAuthority(
								AUTHORITIES.CONSULTANT_DEFAULT,
								userData
							),
						component: AskerAboutMeData,
						order: 1
					}
				]
			}
		]
	},
	{
		title: 'Meine Aktivitäten',
		url: '/aktivitaeten',
		condition: (userData) =>
			hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData),
		elements: [
			{
				title: 'Meine Statistik',
				url: '/statistik',
				elements: [
					{
						component: ConsultantStatistics
					}
				]
			},
			{
				title: 'Meine Abwesenheit',
				url: '/abwesenheit',
				elements: [
					{
						component: AbsenceFormular
					}
				]
			}
		]
	},
	{
		title: 'Sicherheit',
		url: '/sicherheit',
		elements: [
			{
				title: 'Passwort ändern',
				url: '/passwort',
				elements: [
					{
						component: PasswordReset
					}
				]
			},
			{
				title: '2-Faktor-Authentifizierung',
				url: '/2fa',
				elements: [
					{
						condition: (userData) =>
							userData.twoFactorAuth?.isEnabled,
						component: TwoFactorAuth
					}
				]
			},
			{
				condition: (userData) =>
					hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData),
				component: DeleteAccount,
				boxed: false,
				order: 99,
				fullWidth: true
			}
		]
	}
];

const solveCondition = (condition, ...params) => {
	return !condition || condition(...params);
};

const solveTabConditions = (tab: TabType, ...params) => {
	return (
		solveCondition(tab.condition, ...params) &&
		tab.elements.some((element) => solveGroupConditions(element, ...params))
	);
};

const solveGroupConditions = (
	element: TabGroups | SingleComponentType,
	...params
) => {
	return solveCondition(element.condition, ...params) && isTabGroup(element)
		? element.elements.some((element) =>
				solveCondition(element.condition, ...params)
		  )
		: true;
};

export const Profile = (props: ProfileProps) => {
	const { userData } = useContext(UserDataContext);
	const consultingTypes = useConsultingTypes();
	const [mobileMenu, setMobileMenu] = useState<
		(LinkMenuGroupType | LinkMenuItemType | LinkMenuComponentType)[]
	>([]);

	const { fromL } = useResponsive();

	useEffect(() => {
		setProfileWrapperActive();

		return () => {
			setProfileWrapperInactive();
		};
	}, []);

	useEffect(() => {
		setMobileMenu(
			ViewTabs.filter((tab) =>
				solveTabConditions(tab, userData, consultingTypes)
			).map(
				(tab): LinkMenuGroupType => ({
					title: tab.title,
					items: tab.elements
						.filter((element) =>
							solveGroupConditions(
								element,
								userData,
								consultingTypes
							)
						)
						.map((element) =>
							isTabGroup(element)
								? {
										title: element.title,
										url: `/profile${tab.url}${element.url}`
								  }
								: {
										component: (
											<element.component
												spokenLanguages={
													props.spokenLanguages
												}
											/>
										)
								  }
						)
				})
			)
		);
	}, [consultingTypes, props.spokenLanguages, userData]);

	const location = useLocation();
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

	return (
		<div className="profile__wrapper">
			<div className="profile__header">
				<div className="profile__header__wrapper flex flex--jc-sb flex-l--fd-column flex-xl--fd-row">
					<div className="flex__col--no-grow flex flex__col--25p flex--ai-c">
						{fromL || !subpage ? (
							<>
								<div className="profile__icon flex__col--no-grow">
									<PersonIcon className="profile__icon--user" />
								</div>
								<div className="text--nowrap text--bold">
									{hasUserAuthority(
										AUTHORITIES.CONSULTANT_DEFAULT,
										userData
									)
										? `${userData.firstName} ${userData.lastName}`
										: userData.userName}
								</div>
							</>
						) : (
							<Link to={`/profile`}>
								<BackIcon />
							</Link>
						)}
					</div>
					<div className="profile__nav flex flex--jc-fs flex-xl--jc-c flex--ai-s flex__col--50p">
						{fromL ? (
							ViewTabs.filter((tab) =>
								solveTabConditions(
									tab,
									userData,
									consultingTypes
								)
							).map((tab) => (
								<div className="text--nowrap flex__col--no-grow">
									<NavLink
										to={`/profile${tab.url}`}
										activeClassName="active"
									>
										{tab.title}
									</NavLink>
								</div>
							))
						) : (
							<div className="title text--bold text--center">
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
							ViewTabs.filter((tab) =>
								solveTabConditions(
									tab,
									userData,
									consultingTypes
								)
							).map((tab) => (
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
													element={element}
													index={i}
													spokenLanguages={
														props.spokenLanguages
													}
												/>
											))}
									</div>
								</Route>
							))
						) : (
							// Render submenu for mobile
							<Route
								path={ViewTabs.filter((tab) =>
									solveTabConditions(
										tab,
										userData,
										consultingTypes
									)
								).map((tab) => `/profile${tab.url}`)}
								exact
							>
								<div className="profile__content">
									<LinkMenu items={mobileMenu} />
								</div>
							</Route>
						)}

						{!fromL &&
							// Render groups as routes for mobile
							ViewTabs.filter((tab) =>
								solveTabConditions(
									tab,
									userData,
									consultingTypes
								)
							).map((tab) => {
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
														spokenLanguages={
															props.spokenLanguages
														}
													/>
												</div>
											</Route>
										) : (
											<Route
												path={`/profile${tab.url}`}
												key={`/profile${tab.url}`}
											>
												<element.component
													spokenLanguages={
														props.spokenLanguages
													}
												/>
											</Route>
										)
									);
							})}

						<Redirect to={`/profile${ViewTabs[0].url}`} />
					</Switch>
				</div>

				<div className="profile__footer">
					<props.legalComponent textStyle={'standard'} />
				</div>
			</div>
		</div>
	);
};

const ProfileItem = ({
	element,
	spokenLanguages,
	index
}: {
	element: SingleComponentType;
	spokenLanguages: string[];
	index: number;
}) => (
	<div
		className={`profile__item ${
			element.fullWidth ? 'full' : index % 2 === 0 ? 'odd' : 'even'
		}`}
	>
		{element.boxed === false ? (
			<element.component spokenLanguages={spokenLanguages} />
		) : (
			<Box>
				<element.component spokenLanguages={spokenLanguages} />
			</Box>
		)}
	</div>
);

const ProfileGroup = ({
	group,
	spokenLanguages
}: {
	group: TabGroups;
	spokenLanguages: string[];
}) => {
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
					<ProfileItem
						element={element}
						spokenLanguages={spokenLanguages}
						index={i}
					/>
				))}
		</>
	);
};
