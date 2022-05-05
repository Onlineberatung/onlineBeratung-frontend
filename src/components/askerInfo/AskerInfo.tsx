import * as React from 'react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { translate } from '../../utils/translate';
import { AskerInfoMonitoring } from './AskerInfoMonitoring';
import {
	getSessionListPathForLocation,
	SESSION_LIST_TYPES
} from '../session/sessionHelpers';
import {
	AUTHORITIES,
	getExtendedSession,
	hasUserAuthority,
	SessionsDataContext,
	SessionTypeContext,
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

export const AskerInfo = () => {
	const { rcGroupId: groupIdFromParam } = useParams();

	const { userData } = useContext(UserDataContext);
	const { sessions, ready } = useContext(SessionsDataContext);
	const { type } = useContext(SessionTypeContext);

	const [activeSession, setActiveSession] = useState(null);
	const [isPeerChat, setIsPeerChat] = useState(false);

	const [sessionListTab] = useState(
		new URLSearchParams(useLocation().search).get('sessionListTab')
	);

	useEffect(() => {
		if (!ready) {
			return;
		}

		const activeSession = getExtendedSession(groupIdFromParam, sessions);
		if (!activeSession) {
			// ToDo: Handle error
			return;
		}
		setActiveSession(activeSession);
		setIsPeerChat(activeSession.item.isPeerChat);
	}, [groupIdFromParam, ready, sessions]);

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
		[
			activeSession.isGroup,
			activeSession.isLive,
			isPeerChat,
			type,
			userData
		]
	);

	if (!activeSession) {
		return <Loading></Loading>;
	}

	return (
		<ActiveSessionContext.Provider value={activeSession}>
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
