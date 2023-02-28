import { useContext } from 'react';
import { RocketChatSubscriptionsContext } from '../globalState/provider/RocketChatSubscriptionsProvider';
import { IRoom } from '../types/rc/Room';
import { usePropsMemo } from './usePropsMemo';

export const useRoom = (rid: string | null): IRoom => {
	const { rooms, roomsReady } = useContext(RocketChatSubscriptionsContext);

	return usePropsMemo<IRoom>(
		(prev) =>
			roomsReady
				? rooms?.find((room) => room._id === rid) || prev
				: undefined,
		[rid, rooms, roomsReady],
		['_updatedAt.$date']
	);
};
