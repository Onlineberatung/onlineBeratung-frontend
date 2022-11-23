import React, { useContext } from 'react';
import { SESSION_LIST_TYPES } from '../../../../components/session/sessionHelpers';
import { SessionListItemComponent } from '../../../../components/sessionsListItem/SessionListItemComponent';
import {
	buildExtendedSession,
	SessionTypeProvider
} from '../../../../globalState';
import { useConsultantData } from '../../hooks/useConsultantData';
import { EmptyType } from '../EmptyState';
import { OverviewCard } from '../OverviewCard/OverviewCard';
import './sessionCard.styles.scss';
import { LanguagesContext } from '../../../../globalState/provider/LanguagesProvider';

interface SessionCardProps {
	type: SESSION_LIST_TYPES;
	allMessagesPaths: string;
	title: string;
	emptyType: EmptyType;
}

export const SessionCard = ({
	type,
	allMessagesPaths,
	title,
	emptyType
}: SessionCardProps) => {
	const { fixed: fixedLanguages } = useContext(LanguagesContext);
	const { sessions, total, isLoading } = useConsultantData({
		type,
		unReadOnly: true
	});

	return (
		<OverviewCard
			isLoading={isLoading}
			dataListLength={total}
			className="sessionCard"
			allMessagesPaths={allMessagesPaths}
			emptyType={emptyType}
			title={title}
		>
			<SessionTypeProvider type={type}>
				{sessions?.slice(0, 9).map((session, index) => (
					<SessionListItemComponent
						key={session.session.id}
						session={buildExtendedSession(session, '')}
						defaultLanguage={fixedLanguages[0]}
						index={index}
					/>
				))}
			</SessionTypeProvider>
		</OverviewCard>
	);
};
