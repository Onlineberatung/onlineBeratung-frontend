import * as React from 'react';
import { useContext, useState } from 'react';
import { translate } from '../../utils/translate';
import { AskerInfoMonitoring } from './AskerInfoMonitoring';
import {
	typeIsSession,
	typeIsTeamSession,
	getSessionListPathForLocation,
	typeIsEnquiry,
	getTypeOfLocation,
	isGroupChatForSessionItem
} from '../session/sessionHelpers';
import {
	SessionsDataContext,
	ActiveSessionGroupIdContext,
	getActiveSession,
	UserDataContext,
	hasUserAuthority,
	AUTHORITIES,
	isAnonymousSession
} from '../../globalState';
import { Link, useLocation } from 'react-router-dom';
import { Loading } from '../app/Loading';
import { AskerInfoData } from './AskerInfoData';
import { ReactComponent as BackIcon } from '../../resources/img/icons/arrow-left.svg';
import { ReactComponent as PersonIcon } from '../../resources/img/icons/person.svg';
import { AskerInfoAssign } from './AskerInfoAssign';
import '../profile/profile.styles';
import './askerInfo.styles';

export const AskerInfo = () => {
	const { userData } = useContext(UserDataContext);
	const { sessionsData } = useContext(SessionsDataContext);
	const { activeSessionGroupId } = useContext(ActiveSessionGroupIdContext);
	const activeSession = getActiveSession(activeSessionGroupId, sessionsData);
	const [sessionListTab] = useState(
		new URLSearchParams(useLocation().search).get('sessionListTab')
	);
	const isLiveChat = isAnonymousSession(activeSession?.session);
	const isGroupChat = isGroupChatForSessionItem(activeSession);
	const sessionListType = getTypeOfLocation();
	const isPeerChat = activeSession?.session?.isPeerChat;

	if (!activeSession) {
		return <Loading></Loading>;
	}

	const isSessionAssignAvailable = () =>
		!hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) &&
		!isLiveChat &&
		!isGroupChat &&
		((typeIsEnquiry(sessionListType) &&
			hasUserAuthority(
				AUTHORITIES.ASSIGN_CONSULTANT_TO_ENQUIRY,
				userData
			) &&
			isPeerChat) ||
			(!typeIsEnquiry(sessionListType) &&
				((isPeerChat &&
					hasUserAuthority(
						AUTHORITIES.ASSIGN_CONSULTANT_TO_PEER_SESSION,
						userData
					)) ||
					(!isPeerChat &&
						hasUserAuthority(
							AUTHORITIES.ASSIGN_CONSULTANT_TO_SESSION,
							userData
						)))));

	return (
		<div className="profile__wrapper">
			<div className="profile__header">
				<div className="profile__header__wrapper">
					<Link
						to={`${getSessionListPathForLocation()}/${
							activeSession.session.groupId
						}/${activeSession.session.id}${
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
					{activeSession.session.monitoring &&
						(typeIsSession(activeSession.type) ||
							typeIsTeamSession(activeSession.type)) && (
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
	);
};
