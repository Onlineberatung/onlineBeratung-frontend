import { useCallback, useContext, useEffect, useState } from 'react';
import { RocketChatContext } from '../globalState';
import { ActiveSessionContext } from '../globalState/provider/ActiveSessionProvider';
import {
	METHOD_GET_USERS_OF_ROOM,
	MethodGetUsersOfRoomRes
} from '../components/app/RocketChat';

export const useUsersOfRoom = (): MethodGetUsersOfRoomRes & {
	reload: (roomId: string) => Promise<MethodGetUsersOfRoomRes>;
} => {
	const { sendMethod, ready: socketReady } = useContext(RocketChatContext);
	const { activeSession } = useContext(ActiveSessionContext);

	const [usersOfRoom, setUsersOfRoom] =
		useState<MethodGetUsersOfRoomRes>(undefined);

	const load = useCallback(
		async (rid: string) => {
			const res = await sendMethod(METHOD_GET_USERS_OF_ROOM, [
				rid,
				true,
				{ limit: 0, skip: 0 }
			]);

			if (res) {
				return res;
			}

			console.error('No users found for room: ', rid);
			return {
				records: [],
				total: 0
			};
		},
		[sendMethod]
	);

	useEffect(() => {
		if (!socketReady) {
			setUsersOfRoom(undefined);
			return;
		}

		if (socketReady && activeSession?.rid) {
			load(activeSession.rid).then(setUsersOfRoom);
		} else if (!activeSession?.rid && activeSession.isEmptyEnquiry) {
			setUsersOfRoom({
				records: [],
				total: 0
			});
		}

		return () => {
			setUsersOfRoom(undefined);
		};
	}, [activeSession?.rid, socketReady, load, activeSession.isEmptyEnquiry]);

	return usersOfRoom
		? {
				...usersOfRoom,
				reload: load
		  }
		: undefined;
};
