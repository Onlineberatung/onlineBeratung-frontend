import * as React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiGetConsultingType } from '../../api';
import { LegalLinkInterface } from '../../globalState';
import { WaitingRoom } from '../waitingRoom/WaitingRoom';

export interface WaitingRoomLoaderProps {
	legalLinks: Array<LegalLinkInterface>;
	handleUnmatch: () => void;
	onAnonymousRegistration: Function;
}

export const WaitingRoomLoader = ({
	legalLinks,
	handleUnmatch,
	onAnonymousRegistration
}: WaitingRoomLoaderProps) => {
	const [isAnonymousConversationAllowed, setIsAnonymousConversationAllowed] =
		useState<boolean>();
	const { consultingTypeSlug } = useParams();
	const [consultingTypeId, setConsultingTypeId] = useState<number>();

	useEffect(() => {
		apiGetConsultingType({ consultingTypeSlug }).then((result) => {
			if (result?.isAnonymousConversationAllowed) {
				setConsultingTypeId(result.id);
				setIsAnonymousConversationAllowed(true);
			} else {
				handleUnmatch();
			}
		});
	}, [consultingTypeSlug, handleUnmatch]);

	if (isAnonymousConversationAllowed) {
		return (
			<WaitingRoom
				legalLinks={legalLinks}
				consultingTypeSlug={consultingTypeSlug}
				consultingTypeId={consultingTypeId}
				onAnonymousRegistration={onAnonymousRegistration}
			/>
		);
	} else {
		return null;
	}
};
