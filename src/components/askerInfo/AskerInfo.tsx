import * as React from 'react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { translate } from '../../utils/translate';
import { AskerInfoMonitoring } from './AskerInfoMonitoring';
import {
	SESSION_LIST_TAB,
	SESSION_LIST_TYPES
} from '../session/sessionHelpers';
import {
	AUTHORITIES,
	hasUserAuthority,
	SessionTypeContext,
	TenantContext,
	UserDataContext
} from '../../globalState';
import { history } from '../app/app';
import { Loading } from '../app/Loading';
import { ReactComponent as BackIcon } from '../../resources/img/icons/arrow-left.svg';
import { AskerInfoAssign } from './AskerInfoAssign';
import '../profile/profile.styles';
import './askerInfo.styles';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';
import { useSearchParam } from '../../hooks/useSearchParams';
import { useSession } from '../../hooks/useSession';
import { useResponsive } from '../../hooks/useResponsive';
import {
	desktopView,
	mobileListView,
	mobileUserProfileView
} from '../app/navigationHandler';
import { AskerInfoTools } from './AskerInfoTools';
import { ProfileBox } from './ProfileBox';
import { ProfileDataItem } from './ProfileDataItem';

export const AskerInfo = () => {
	const { tenant } = useContext(TenantContext);
	const { rcGroupId: groupIdFromParam } = useParams();

	const { userData } = useContext(UserDataContext);
	const { type, path: listPath } = useContext(SessionTypeContext);

	const { session: activeSession, ready } = useSession(groupIdFromParam);
	const [isPeerChat, setIsPeerChat] = useState(false);

	const sessionListTab = useSearchParam<SESSION_LIST_TAB>('sessionListTab');

	useEffect(() => {
		if (!ready) {
			return;
		}

		if (!activeSession) {
			history.push(
				listPath +
					(sessionListTab ? `?sessionListTab=${sessionListTab}` : '')
			);
			return;
		}

		setIsPeerChat(activeSession.item.isPeerChat);
	}, [activeSession, listPath, ready, sessionListTab]);

	const { fromL } = useResponsive();
	useEffect(() => {
		if (!fromL) {
			mobileUserProfileView();
			return () => {
				mobileListView();
			};
		}
		desktopView();
	}, [fromL]);

	const isSessionAssignAvailable = useCallback(
		() =>
			!hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) &&
			!activeSession.isLive &&
			!activeSession.isGroup &&
			((type === SESSION_LIST_TYPES.ENQUIRY &&
				hasUserAuthority(
					AUTHORITIES.ASSIGN_CONSULTANT_TO_ENQUIRY,
					userData
				) &&
				isPeerChat) ||
				(type !== SESSION_LIST_TYPES.ENQUIRY &&
					((isPeerChat &&
						hasUserAuthority(
							AUTHORITIES.ASSIGN_CONSULTANT_TO_PEER_SESSION,
							userData
						)) ||
						(!isPeerChat &&
							hasUserAuthority(
								AUTHORITIES.ASSIGN_CONSULTANT_TO_SESSION,
								userData
							))))),
		[activeSession, isPeerChat, type, userData]
	);

	if (!activeSession) {
		return <Loading></Loading>;
	}

	return (
		<ActiveSessionContext.Provider value={{ activeSession }}>
			<div className="profile__wrapper">
				<div className="profile__header">
					<div className="profile__header__wrapper">
						<Link
							to={`${listPath}/${activeSession.item.groupId}/${
								activeSession.item.id
							}${
								sessionListTab
									? `?sessionListTab=${sessionListTab}`
									: ''
							}`}
							className="profile__header__backButton"
						>
							<BackIcon />
						</Link>
						<h3 className="profile__header__title profile__header__title--withBackButton">
							{translate('profile.header.title')}
						</h3>
					</div>
					<div className="profile__header__metaInfo">
						<p className="profile__header__username profile__header__username--withBackButton">
							{activeSession.user.username}
						</p>
					</div>
				</div>
				<div className="askerInfo__contentContainer">
					<ProfileBox title="profile.profilInformation">
						<ProfileDataItem title="profile.age" content="23" />
						<ProfileDataItem
							title="profile.gender"
							content="Weiblich"
						/>
						<ProfileDataItem
							title="profile.status"
							content="Betroffene"
						/>
						<ProfileDataItem
							title="profile.postalCode"
							content="44444"
						/>
					</ProfileBox>

					{tenant?.settings?.featureToolsEnabled && (
						<ProfileBox title="profile.tools">
							<AskerInfoTools />
						</ProfileBox>
					)}

					<ProfileBox title="profile.topic">
						<ProfileDataItem
							title="profile.mainTopic"
							content="Alkohol"
						/>
						<ProfileDataItem
							title="profile.selectedTopics"
							content="Weiblich"
						/>
					</ProfileBox>

					{activeSession.item.monitoring &&
						(type === SESSION_LIST_TYPES.MY_SESSION ||
							type === SESSION_LIST_TYPES.TEAMSESSION) && (
							<ProfileBox title="userProfile.monitoring.title">
								<AskerInfoMonitoring />
							</ProfileBox>
						)}

					{isSessionAssignAvailable() && (
						<ProfileBox title="userProfile.reassign.title">
							<AskerInfoAssign />
						</ProfileBox>
					)}
				</div>
			</div>
		</ActiveSessionContext.Provider>
	);
};
