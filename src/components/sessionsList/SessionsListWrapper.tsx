import * as React from 'react';
import { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
	typeIsSession,
	typeIsTeamSession,
	typeIsEnquiry,
	SESSION_TYPES,
	SESSION_LIST_TAB
} from '../session/sessionHelpers';
import { translate } from '../../utils/translate';
import {
	UserDataContext,
	AUTHORITIES,
	hasUserAuthority,
	SessionTypeContext
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
