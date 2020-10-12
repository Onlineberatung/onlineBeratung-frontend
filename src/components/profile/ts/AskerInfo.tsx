import * as React from 'react';
import { useContext } from 'react';
import { translate } from '../../../resources/ts/i18n/translate';
import { UserMonitoring } from './UserMonitoring';
import {
	typeIsSession,
	typeIsTeamSession,
	getSessionListPathForLocation
} from '../../session/ts/sessionHelpers';
import {
	SessionsDataContext,
	ActiveSessionGroupIdContext,
	getActiveSession
} from '../../../globalState';
import { Link } from 'react-router-dom';
import { Loading } from '../../app/ts/Loading';
import { UserDataView } from './UserDataView';

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
						<svg
							xmlns="http://www.w3.org/2000/svg"
							xmlnsXlink="http://www.w3.org/1999/xlink"
							width="72"
							height="72"
							viewBox="0 0 72 72"
						>
							<defs>
								<path
									id="arrow-left-a"
									d="M45.0252206,6.96804002 C45.4962829,6.4969777 46.0611408,6.26144654 46.7197943,6.26144654 C47.3784479,6.26144654 47.9433058,6.4969777 48.4143681,6.96804002 L54.5548531,13.1460432 C55.0259154,13.6171055 55.2614465,14.1757104 55.2614465,14.8218578 C55.2614465,15.4680053 55.0259154,16.0266102 54.5548531,16.4976725 L34.791079,36.2614465 L54.5548531,56.0252206 C55.0259154,56.4962829 55.2614465,57.0548878 55.2614465,57.7010352 C55.2614465,58.3471827 55.0259154,58.9057875 54.5548531,59.3768499 L48.4143681,65.5548531 C47.9433058,66.0259154 47.3784479,66.2614465 46.7197943,66.2614465 C46.0611408,66.2614465 45.4962829,66.0259154 45.0252206,65.5548531 L17.4451469,37.9372612 C16.9740846,37.4661988 16.7385535,36.907594 16.7385535,36.2614465 C16.7385535,35.6152991 16.9740846,35.0566942 17.4451469,34.5856319 L45.0252206,6.96804002 Z"
								/>
							</defs>
							<use xlinkHref="#arrow-left-a" />
						</svg>
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
					<div className="profile__icon profile__icon--user"></div>
					<h2>{activeSession.user.username}</h2>
				</div>
				<div className="profile__content">
					<UserDataView />
					{(activeSession.session.monitoring &&
						typeIsSession(activeSession.type)) ||
					typeIsTeamSession(activeSession.type) ? (
						<UserMonitoring />
					) : null}
				</div>
			</div>
		</div>
	);
};
