import { SessionHeaderComponent } from '../sessionHeader/SessionHeaderComponent';
import { SessionStream } from './SessionStream';
import { SessionMonitoring } from './SessionMonitoring';
import { SESSION_LIST_TYPES } from './sessionHelpers';
import { AcceptAssign } from './AcceptAssign';
import {
	AUTHORITIES,
	hasUserAuthority,
	SessionTypeContext,
	STATUS_FINISHED,
	UserDataContext
} from '../../globalState';
import { MessageSubmitComponent } from '../messageSubmitInterface/MessageSubmitComponent';
import * as React from 'react';
import { useCallback, useContext, useRef, useState } from 'react';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';
import { DragAndDropArea } from '../dragAndDropArea/DragAndDropArea';
import clsx from 'clsx';
import { RoomContext } from '../../globalState/provider/RoomProvider';

export const Session = ({
	bannedUsers,
	checkMutedUserForThisSession
}: {
	bannedUsers: string[];
	checkMutedUserForThisSession: () => void;
}) => {
	const { type } = useContext(SessionTypeContext);
	const { userData } = useContext(UserDataContext);
	const { activeSession, readActiveSession } =
		useContext(ActiveSessionContext);
	const { subscription } = useContext(RoomContext);

	const hasUserInitiatedStopOrLeaveRequest = useRef<boolean>(false);

	const [isScrolledToBottom, setIsScrolledToBottom] =
		useState<boolean>(false);
	const [monitoringButtonVisible, setMonitoringButtonVisible] =
		useState(false);

	const setSessionRead = useCallback(async () => {
		console.log(
			type === SESSION_LIST_TYPES.ENQUIRY,
			!hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) &&
				activeSession.isLive &&
				activeSession.item.status === STATUS_FINISHED
		);
		if (
			type === SESSION_LIST_TYPES.ENQUIRY ||
			(!hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) &&
				activeSession.isLive &&
				activeSession.item.status === STATUS_FINISHED)
		) {
			return;
		}
		console.log('READ');

		await readActiveSession();
	}, [
		activeSession.isLive,
		activeSession.item.status,
		readActiveSession,
		type,
		userData
	]);

	const handleScrolledToBottom = useCallback(
		(bottom) => {
			setIsScrolledToBottom(bottom);

			if (!bottom || !subscription?.unread) {
				return;
			}
			setSessionRead().then();
		},
		[setSessionRead, subscription]
	);

	return (
		<div
			className={clsx(
				'session flex flex--fd-column',
				activeSession.isFeedback && 'session--yellowTheme'
			)}
		>
			<SessionHeaderComponent
				className="flex__col--0"
				hasUserInitiatedStopOrLeaveRequest={
					hasUserInitiatedStopOrLeaveRequest
				}
				bannedUsers={bannedUsers}
			/>

			<DragAndDropArea className="flex__col--1 flex flex--fd-column flex--jc-fe ofy--h">
				<SessionStream
					checkMutedUserForThisSession={checkMutedUserForThisSession}
					bannedUsers={bannedUsers}
					onScrolledToBottom={handleScrolledToBottom}
					className="flex__col--1"
				/>

				<SessionMonitoring
					className="flex__col--0"
					visible={monitoringButtonVisible}
				/>

				{type === SESSION_LIST_TYPES.ENQUIRY && (
					<AcceptAssign
						className="flex__col--0"
						assignable={
							!activeSession.isLive &&
							hasUserAuthority(
								AUTHORITIES.VIEW_ALL_PEER_SESSIONS,
								userData
							)
						}
						isAnonymous={false}
						btnLabel={'enquiry.acceptButton.known'}
					/>
				)}

				{(type !== SESSION_LIST_TYPES.ENQUIRY ||
					hasUserAuthority(
						AUTHORITIES.VIEW_ALL_PEER_SESSIONS,
						userData
					)) && (
					<MessageSubmitComponent
						className="flex__col--0"
						onShowMonitoringButton={() =>
							setMonitoringButtonVisible(true)
						}
						isScrolledToBottom={isScrolledToBottom}
					/>
				)}
			</DragAndDropArea>
		</div>
	);
};
