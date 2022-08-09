import * as React from 'react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import {
	SESSION_LIST_TAB,
	SESSION_LIST_TYPES,
	SESSION_TYPES
} from '../session/sessionHelpers';
import { translate } from '../../utils/translate';
import {
	AUTHORITIES,
	hasUserAuthority,
	SessionTypeContext,
	UserDataContext
} from '../../globalState';
import { SessionsList } from './SessionsList';
import { ReactComponent as CreateGroupChatIcon } from '../../resources/img/icons/speech-bubble-plus.svg';
import './sessionsList.styles';
import { FixedLanguagesContext } from '../../globalState/provider/FixedLanguagesProvider';
import { useSearchParam } from '../../hooks/useSearchParams';

interface SessionsListWrapperProps {
	sessionTypes: SESSION_TYPES;
}

export const SessionsListWrapper = ({
	sessionTypes
}: SessionsListWrapperProps) => {
	const fixedLanguages = useContext(FixedLanguagesContext);
	const { userData } = useContext(UserDataContext);
	const { type } = useContext(SessionTypeContext);
	const sessionListTab = useSearchParam<SESSION_LIST_TAB>('sessionListTab');

	if (
		hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) ||
		hasUserAuthority(AUTHORITIES.ANONYMOUS_DEFAULT, userData)
	) {
		return (
			<div className="sessionsList__wrapper">
				<div
					className="sessionsList__header"
					data-cy="session-list-header"
				>
					<h2
						className="sessionsList__headline"
						data-cy="session-list-headline"
					>
						{translate('sessionList.user.headline')}
					</h2>
				</div>
				<SessionsList
					defaultLanguage={fixedLanguages[0]}
					sessionTypes={sessionTypes}
				/>
			</div>
		);
	}

	return (
		<div className="sessionsList__wrapper">
			<div className="sessionsList__header" data-cy="session-list-header">
				<h2
					className="sessionsList__headline"
					data-cy="session-list-headline"
				>
					{type === SESSION_LIST_TYPES.MY_SESSION
						? translate('sessionList.view.headline')
						: null}
					{type === SESSION_LIST_TYPES.TEAMSESSION &&
					!hasUserAuthority(
						AUTHORITIES.VIEW_ALL_PEER_SESSIONS,
						userData
					)
						? translate('navigation.consultant.teamsessions')
						: null}
					{type === SESSION_LIST_TYPES.TEAMSESSION &&
					hasUserAuthority(
						AUTHORITIES.VIEW_ALL_PEER_SESSIONS,
						userData
					)
						? translate('sessionList.peersessions.headline')
						: null}
					{type === SESSION_LIST_TYPES.ENQUIRY
						? translate('sessionList.preview.headline')
						: null}
				</h2>
				{type === SESSION_LIST_TYPES.MY_SESSION &&
				!hasUserAuthority(AUTHORITIES.CREATE_NEW_CHAT, userData) && // replace with featureToggle when implemented
				hasUserAuthority(AUTHORITIES.CREATE_NEW_CHAT, userData) ? (
					<Link
						className="sessionsList__createChatLink"
						to={{
							pathname: `/sessions/consultant/sessionView/createGroupChat${
								sessionListTab
									? `?sessionListTab=${sessionListTab}`
									: ''
							}`
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
			<SessionsList
				defaultLanguage={fixedLanguages[0]}
				sessionTypes={sessionTypes}
			/>
		</div>
	);
};
