import * as React from 'react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ReactComponent as BackIcon } from '../../resources/img/icons/arrow-left.svg';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';
import { useSearchParam } from '../../hooks/useSearchParams';
import { SESSION_LIST_TAB } from '../session/sessionHelpers';
import { SessionTypeContext } from '../../globalState';

export const SessionFeedbackHeader = () => {
	const { t: translate } = useTranslation([
		'common',
		'consultingTypes',
		'agencies'
	]);
	const sessionListTab = useSearchParam<SESSION_LIST_TAB>('sessionListTab');

	const { activeSession } = useContext(ActiveSessionContext);
	const { path: listPath } = useContext(SessionTypeContext);

	return (
		<>
			<div className="sessionInfo__feedbackHeaderWrapper">
				<Link
					to={{
						pathname: `${listPath}/${activeSession.item.groupId}
							/${activeSession.item.id}`,
						search: `${
							sessionListTab
								? `?sessionListTab=${sessionListTab}`
								: ''
						}`
					}}
					className="sessionInfo__feedbackBackButton"
				>
					<BackIcon />
				</Link>
				<div className="sessionInfo__username">
					<h3>{translate('session.feedback.label')}</h3>
				</div>
			</div>
			<div className="sessionInfo__feedbackMetaInfo">
				{activeSession.user.username && (
					<div className="sessionInfo__metaInfo__content">
						{activeSession.user.username}
					</div>
				)}
			</div>
		</>
	);
};
