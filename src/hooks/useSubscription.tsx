import { useContext } from 'react';
import { RocketChatSubscriptionsContext } from '../globalState/provider/RocketChatSubscriptionsProvider';
import { usePropsMemo } from './usePropsMemo';
import { ISubscriptions } from '../types/rc/Subscriptions';

export const useSubscription = (rid: string | null): ISubscriptions => {
	const { subscriptions, subscriptionsReady } = useContext(
		RocketChatSubscriptionsContext
	);

	return usePropsMemo<ISubscriptions>(
		(prev) =>
			subscriptionsReady
				? subscriptions?.find(
						(subscription) => subscription.rid === rid
				  ) || prev
				: undefined,
		[rid, subscriptions, subscriptionsReady],
		['_updatedAt.$date']
	);
};
