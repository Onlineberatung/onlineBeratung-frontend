import * as React from 'react';
import { useCallback, useContext, VFC } from 'react';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';
import './sessionHeader.styles';
import './sessionHeader.yellowTheme.styles';
import { SessionGroupHeader } from './SessionGroupHeader';
import { SessionFeedbackHeader } from './SessionFeedbackHeader';
import { SessionChatHeader } from './SessionChatHeader';

export interface SessionHeaderProps {
	hasUserInitiatedStopOrLeaveRequest?: React.MutableRefObject<boolean>;
	isJoinGroupChatView?: boolean;
	bannedUsers: string[];
	className?: string;
}

export const SessionHeaderComponent: VFC<SessionHeaderProps> = ({
	hasUserInitiatedStopOrLeaveRequest,
	isJoinGroupChatView,
	bannedUsers,
	className
}) => {
	const { activeSession } = useContext(ActiveSessionContext);

	const SessionHeader = useCallback(() => {
		if (activeSession.isGroup) {
			return (
				<SessionGroupHeader
					hasUserInitiatedStopOrLeaveRequest={
						hasUserInitiatedStopOrLeaveRequest
					}
					isJoinGroupChatView={isJoinGroupChatView}
					bannedUsers={bannedUsers}
				/>
			);
		} else if (activeSession.isFeedback) {
			return <SessionFeedbackHeader />;
		}

		return (
			<SessionChatHeader
				hasUserInitiatedStopOrLeaveRequest={
					hasUserInitiatedStopOrLeaveRequest
				}
			/>
		);
	}, [
		activeSession.isFeedback,
		activeSession.isGroup,
		bannedUsers,
		hasUserInitiatedStopOrLeaveRequest,
		isJoinGroupChatView
	]);

	return (
		<div className={className}>
			<div className="sessionInfo">
				<SessionHeader />
			</div>
		</div>
	);
};
