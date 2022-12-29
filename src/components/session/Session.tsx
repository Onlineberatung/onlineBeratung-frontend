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
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';
import { ISubscriptions } from '../../types/rc/Subscriptions';
import { IRoom } from '../../types/rc/Room';
import { DragAndDropArea } from '../dragAndDropArea/DragAndDropArea';
import clsx from 'clsx';
import { apiRocketChatGroupMessages } from '../../api/apiRocketChatGroupMessages';

export const Session = ({
	bannedUsers,
	checkMutedUserForThisSession,
	subscription,
	room,
	hiddenSystemMessages = []
}: {
	bannedUsers: string[];
	checkMutedUserForThisSession: () => void;
	subscription: ISubscriptions | null;
	room: IRoom;
	hiddenSystemMessages: string[];
}) => {
	const { type } = useContext(SessionTypeContext);
	const { userData } = useContext(UserDataContext);
	const { activeSession, readActiveSession } =
		useContext(ActiveSessionContext);

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

			if (!bottom || !subscription || subscription.unread <= 0) {
				return;
			}
			setSessionRead().then();
		},
		[setSessionRead, subscription]
	);

	// Because we are removing some messages on the backend side the subscription.unread count can not used to detect
	// the last unread message. Thats why we load the last unread message time from rc
	// ToDo: This could maybe optimized by subscription.ls time becuase ls means last seen which schould be last read
	const lastUnreadMessageTime = useRef<number | null>(null);
	useEffect(() => {
		if (!subscription || subscription.unread <= 0) {
			lastUnreadMessageTime.current = null;
		}

		// Prevent reload on every change
		if (lastUnreadMessageTime.current) {
			return;
		}

		apiRocketChatGroupMessages(subscription.rid, {
			offset: room.msgs - subscription.unread,
			count: 1,
			sort: { ts: 1 },
			fields: { ts: 1, _id: 1 }
		})
			.then(({ messages: [{ ts }] }) => {
				lastUnreadMessageTime.current = new Date(ts).getTime();
			})
			.catch(() => (lastUnreadMessageTime.current = null));
	}, [room.msgs, subscription]);

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
					hiddenSystemMessages={hiddenSystemMessages}
					room={room}
					subscription={subscription}
					onScrolledToBottom={handleScrolledToBottom}
					lastUnreadMessageTime={lastUnreadMessageTime.current}
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
