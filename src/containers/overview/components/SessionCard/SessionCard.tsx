import React, { useContext } from 'react';
import { SESSION_LIST_TYPES } from '../../../../components/session/sessionHelpers';
import { SessionListItemComponent } from '../../../../components/sessionsListItem/SessionListItemComponent';
import {
	buildExtendedSession,
	SessionTypeProvider
} from '../../../../globalState';
import { FixedLanguagesContext } from '../../../../globalState/provider/FixedLanguagesProvider';
import { useConsultantData } from '../../hooks/useConsultantData';
import { EmptyType } from '../EmptyState';
import { OverviewCard } from '../OverviewCard/OverviewCard';
import './sessionCard.styles.scss';

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
	const fixedLanguages = useContext(FixedLanguagesContext);
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
				{sessions?.slice(0, 9).map((session) => (
					<SessionListItemComponent
						key={session.session.id}
						session={buildExtendedSession(session, '')}
						defaultLanguage={fixedLanguages[0]}
					/>
				))}
			</SessionTypeProvider>
		</OverviewCard>
	);
};
