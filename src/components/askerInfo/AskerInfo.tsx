import * as React from 'react';
import { useContext } from 'react';
import { translate } from '../../resources/scripts/i18n/translate';
import { AskerInfoMonitoring } from './AskerInfoMonitoring';
import {
	typeIsSession,
	typeIsTeamSession,
	getSessionListPathForLocation
} from '../session/sessionHelpers';
import {
	SessionsDataContext,
	ActiveSessionGroupIdContext,
	getActiveSession
} from '../../globalState';
import { Link } from 'react-router-dom';
import { Loading } from '../app/Loading';
import { AskerInfoData } from './AskerInfoData';
import { ReactComponent as BackIcon } from '../../resources/img/icons/arrow-left.svg';
import { ReactComponent as PersonIcon } from '../../resources/img/icons/person.svg';
import '../profile/profile.styles';

export const AskerInfo = () => {
	const { sessionsData } = useContext(SessionsDataContext);
	const { activeSessionGroupId } = useContext(ActiveSessionGroupIdContext);
	const activeSession = getActiveSession(activeSessionGroupId, sessionsData);

	if (!activeSession) {
		return <Loading></Loading>;
	}

	return (
		<div className="profile__wrapper">
			<div className="profile__header">
				<div className="profile__header__wrapper">
					<Link
						to={`${getSessionListPathForLocation()}/${
							activeSession.session.groupId
						}/${activeSession.session.id}`}
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
				<div className="profile__content">
					<AskerInfoData />
					{((activeSession.session.monitoring &&
						typeIsSession(activeSession.type)) ||
						typeIsTeamSession(activeSession.type)) && (
						<AskerInfoMonitoring />
					)}
				</div>
			</div>
		</div>
	);
};
