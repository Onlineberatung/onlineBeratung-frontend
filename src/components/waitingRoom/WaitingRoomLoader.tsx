import * as React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiGetConsultingType } from '../../api';
import { WaitingRoom } from '../waitingRoom/WaitingRoom';

export interface WaitingRoomLoaderProps {
	handleUnmatch: () => void;
}

export const WaitingRoomLoader = ({
	handleUnmatch
}: WaitingRoomLoaderProps) => {
	const [
		isAnonymousConversationAllowed,
		setIsAnonymousConversationAllowed
	] = useState<boolean>();
	const { consultingTypeSlug } = useParams();

	useEffect(() => {
		apiGetConsultingType({ consultingTypeSlug }).then((result) => {
			if (result?.isAnonymousConversationAllowed)
				setIsAnonymousConversationAllowed(true);
			else handleUnmatch();
		});
	}, [consultingTypeSlug, handleUnmatch]);

	if (isAnonymousConversationAllowed) {
		return <WaitingRoom />;
	} else {
		return null;
	}
};
