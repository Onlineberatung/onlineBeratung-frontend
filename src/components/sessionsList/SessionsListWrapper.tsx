import * as React from 'react';
import { useContext } from 'react';
import {
	typeIsSession,
	typeIsTeamSession,
	typeIsEnquiry,
	getTypeOfLocation
} from '../session/sessionHelpers';
import { translate } from '../../resources/scripts/i18n/translate';
import {
	UserDataContext,
	AUTHORITIES,
	hasUserAuthority
} from '../../globalState';
import { SessionsList } from './SessionsList';
import { Link } from 'react-router-dom';
import { ReactComponent as CreateGroupChatIcon } from '../../resources/img/icons/speech-bubble-plus.svg';
import './sessionsList.styles';

export const SessionsListWrapper = () => {
	const type = getTypeOfLocation();
	const { userData } = useContext(UserDataContext);

	if (hasUserAuthority(AUTHORITIES.USER_DEFAULT, userData)) {
		return (
			<div className="sessionsList__wrapper">
				<div className="sessionsList__header">
					<h2 className="sessionsList__headline">
						{translate('sessionList.user.headline')}
					</h2>
				</div>
				<SessionsList />
			</div>
		);
	}

	return (
		<div className="sessionsList__wrapper">
			<div className="sessionsList__header">
				<h2 className="sessionsList__headline">
					{typeIsSession(type)
						? translate('sessionList.view.headline')
						: null}
					{typeIsTeamSession(type) &&
					!hasUserAuthority(
						AUTHORITIES.VIEW_ALL_PEER_SESSIONS,
						userData
					)
						? translate('navigation.consultant.teamsessions')
						: null}
					{typeIsTeamSession(type) &&
					hasUserAuthority(
						AUTHORITIES.VIEW_ALL_PEER_SESSIONS,
						userData
					)
						? translate('sessionList.peersessions.headline')
						: null}
					{typeIsEnquiry(type)
						? translate('sessionList.preview.headline')
						: null}
				</h2>
				{typeIsSession(type) &&
				hasUserAuthority(AUTHORITIES.CREATE_NEW_CHAT, userData) ? (
					<Link
						className="sessionsList__createChatLink"
						to={{
							pathname: `/sessions/consultant/sessionView/createGroupChat`
						}}
					>
						<span
							className="sessionsList__createChatButton"
							title={translate(
								'sessionList.createChat.buttonTitle'
							)}
						>
							<CreateGroupChatIcon />
						</span>
					</Link>
				) : (
					<div className="sessionMenuPlaceholder"></div>
				)}
			</div>
			<SessionsList />
		</div>
	);
};
