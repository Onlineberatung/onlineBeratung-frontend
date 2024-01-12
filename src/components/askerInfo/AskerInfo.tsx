import * as React from 'react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
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
import { Loading } from '../app/Loading';
import { AskerInfoData } from './AskerInfoData';
import { ReactComponent as BackIcon } from '../../resources/img/icons/arrow-left.svg';
import { ReactComponent as PersonIcon } from '../../resources/img/icons/person.svg';
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
import { useTranslation } from 'react-i18next';
import { AskerInfoTools } from './AskerInfoTools';
import { Box } from '../box/Box';
import { RocketChatUsersOfRoomProvider } from '../../globalState/provider/RocketChatUsersOfRoomProvider';

export const AskerInfo = () => {
	const { t: translate } = useTranslation();
	const { tenant } = useContext(TenantContext);
	const { rcGroupId: groupIdFromParam } = useParams<{ rcGroupId: string }>();
	const history = useHistory();

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
	}, [activeSession, history, listPath, ready, sessionListTab]);

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
			<RocketChatUsersOfRoomProvider>
				<div className="askerInfo__wrapper">
					<div className="askerInfo__header">
						<div className="askerInfo__header__wrapper">
							<Link
								to={`${listPath}/${
									activeSession.item.groupId
								}/${activeSession.item.id}${
									sessionListTab
										? `?sessionListTab=${sessionListTab}`
										: ''
								}`}
								className="askerInfo__header__backButton"
							>
								<BackIcon
									aria-label={translate('app.back')}
									title={translate('app.back')}
								/>
							</Link>
							<h3 className="askerInfo__header__title">
								{translate('profile.header.title')}
							</h3>
						</div>
						<div className="askerInfo__header__metaInfo">
							<p className="askerInfo__header__username askerInfo__header__username--withBackButton">
								{activeSession.user.username}
							</p>
						</div>
					</div>
					<div className="askerInfo__innerWrapper">
						<div className="askerInfo__user">
							<div className="askerInfo__icon">
								<PersonIcon
									className="askerInfo__icon--user"
									title={translate(
										'profile.data.profileIcon'
									)}
									aria-label={translate(
										'profile.data.profileIcon'
									)}
								/>
							</div>
							<h2>{activeSession.user.username}</h2>
						</div>
						<div className="askerInfo__content">
							<Box>
								<AskerInfoData />
							</Box>
							{tenant?.settings?.featureToolsEnabled && (
								<Box>
									<AskerInfoTools />
								</Box>
							)}
							{isSessionAssignAvailable() && (
								<Box>
									<div className="askerInfo__assign">
										<AskerInfoAssign />
									</div>
								</Box>
							)}
						</div>
					</div>
				</div>
			</RocketChatUsersOfRoomProvider>
		</ActiveSessionContext.Provider>
	);
};
