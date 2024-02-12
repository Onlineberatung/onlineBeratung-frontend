import * as React from 'react';
import { useContext, useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { SESSION_LIST_TAB } from '../session/sessionHelpers';
import { SessionTypeContext, ActiveSessionProvider } from '../../globalState';
import { Loading } from '../app/Loading';
import { ReactComponent as BackIcon } from '../../resources/img/icons/arrow-left.svg';
import { ReactComponent as PersonIcon } from '../../resources/img/icons/person.svg';
import './askerInfo.styles';
import { useSearchParam } from '../../hooks/useSearchParams';
import { useSession } from '../../hooks/useSession';
import { useResponsive } from '../../hooks/useResponsive';
import {
	desktopView,
	mobileListView,
	mobileUserProfileView
} from '../app/navigationHandler';
import { useTranslation } from 'react-i18next';
import { RocketChatUsersOfRoomProvider } from '../../globalState/provider/RocketChatUsersOfRoomProvider';
import { AskerInfoContent } from './AskerInfoContent';

export const AskerInfo = () => {
	const { t: translate } = useTranslation();
	const { rcGroupId: groupIdFromParam } = useParams<{ rcGroupId: string }>();
	const history = useHistory();

	const { path: listPath } = useContext(SessionTypeContext);

	const { session: activeSession, ready } = useSession(groupIdFromParam);

	const sessionListTab = useSearchParam<SESSION_LIST_TAB>('sessionListTab');

	useEffect(() => {
		if (!ready || activeSession) {
			return;
		}

		history.push(
			listPath +
				(sessionListTab ? `?sessionListTab=${sessionListTab}` : '')
		);
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

	if (!activeSession) {
		return <Loading />;
	}

	return (
		<ActiveSessionProvider activeSession={activeSession}>
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
							<AskerInfoContent />
						</div>
					</div>
				</div>
			</RocketChatUsersOfRoomProvider>
		</ActiveSessionProvider>
	);
};
