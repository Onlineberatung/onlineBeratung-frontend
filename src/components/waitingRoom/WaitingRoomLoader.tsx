import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { apiGetConsultingType } from '../../api';
import { WaitingRoom } from '../waitingRoom/WaitingRoom';
import { useAppConfig } from '../../hooks/useAppConfig';

export interface WaitingRoomLoaderProps {
	onAnonymousRegistration: Function;
}

export const WaitingRoomLoader = ({
	onAnonymousRegistration
}: WaitingRoomLoaderProps) => {
	const history = useHistory();
	const settings = useAppConfig();
	const [isAnonymousConversationAllowed, setIsAnonymousConversationAllowed] =
		useState<boolean>();
	const { consultingTypeSlug } = useParams<{
		consultingTypeSlug: string;
	}>();
	const [consultingTypeId, setConsultingTypeId] = useState<number>();

	const handleUnmatched = useCallback(() => {
		history.push(settings.urls.toLogin);
	}, [history, settings.urls.toLogin]);

	useEffect(() => {
		apiGetConsultingType({ consultingTypeSlug }).then((result) => {
			if (result?.isAnonymousConversationAllowed) {
				setConsultingTypeId(result.id);
				setIsAnonymousConversationAllowed(true);
			} else {
				handleUnmatched();
			}
		});
	}, [consultingTypeSlug, handleUnmatched]);

	if (isAnonymousConversationAllowed) {
		return (
			<WaitingRoom
				consultingTypeSlug={consultingTypeSlug}
				consultingTypeId={consultingTypeId}
				onAnonymousRegistration={onAnonymousRegistration}
			/>
		);
	} else {
		return null;
	}
};
