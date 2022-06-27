import * as React from 'react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { translate } from '../../utils/translate';
import { AskerInfoMonitoring } from './AskerInfoMonitoring';
import {
	getSessionListPathForLocation,
	SESSION_LIST_TAB,
	SESSION_LIST_TYPES
} from '../session/sessionHelpers';
import {
	AUTHORITIES,
	hasUserAuthority,
	SessionTypeContext,
	UserDataContext
} from '../../globalState';
import { history } from '../app/app';
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

export const AskerInfo = () => {
	const { rcGroupId: groupIdFromParam } = useParams();

	const { userData } = useContext(UserDataContext);
	const { type } = useContext(SessionTypeContext);

	const { session: activeSession, ready } = useSession(groupIdFromParam);
	const [isPeerChat, setIsPeerChat] = useState(false);

	const sessionListTab = useSearchParam<SESSION_LIST_TAB>('sessionListTab');

	useEffect(() => {
		if (!ready) {
			return;
		}

		if (!activeSession) {
			history.push(
				getSessionListPathForLocation() +
					(sessionListTab ? `?sessionListTab=${sessionListTab}` : '')
			);
			return;
		}

		setIsPeerChat(activeSession.item.isPeerChat);
	}, [activeSession, ready, sessionListTab]);

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
							to={`${getSessionListPathForLocation()}/${
								activeSession.item.groupId
							}/${activeSession.item.id}${
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
				<div className="profile__innerWrapper">
					<div className="profile__user">
						<div className="profile__icon">
							<PersonIcon className="profile__icon--user" />
						</div>
						<h2>{activeSession.user.username}</h2>
					</div>
					<div className="profile__content askerInfo__content">
						<div>
							<AskerInfoData />
						</div>
						{activeSession.item.monitoring &&
							(type === SESSION_LIST_TYPES.MY_SESSION ||
								type === SESSION_LIST_TYPES.TEAMSESSION) && (
								<div>
									<AskerInfoMonitoring />
								</div>
							)}
						{isSessionAssignAvailable() && (
							<div className="askerInfo__assign">
								<AskerInfoAssign />
							</div>
						)}
					</div>
				</div>
			</div>
		</ActiveSessionContext.Provider>
	);
};
