import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { apiGetConsultingType, apiGetConsultingTypes } from '../../api';
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
	const { consultingTypeSlug: consultingTypeSlugParam } = useParams<{
		consultingTypeSlug: string;
	}>();
	const [consultingTypeId, setConsultingTypeId] = useState<number>();
	const [consultingTypeSlug, setConsultingTypeSlug] = useState<string>();

	const handleUnmatched = useCallback(() => {
		history.push(settings.urls.toLogin);
	}, [history, settings.urls.toLogin]);

	useEffect(() => {
		(async () => {
			try {
				let consultingType;
				
				if (consultingTypeSlugParam) {
					// If slug provided in URL, use it
					consultingType = await apiGetConsultingType({ 
						consultingTypeSlug: consultingTypeSlugParam 
					});
				} else {
					// No slug provided - load default consulting type (same logic as registration)
					const consultingTypes = await apiGetConsultingTypes().catch(() => []);
					
					// Priority 1: Try to find "beratung" specifically for backward compatibility
					const beratungType = consultingTypes.find(ct => 
						ct.slug === 'beratung' || ct.name?.toLowerCase() === 'beratung'
					);
					
					if (beratungType) {
						// Use "beratung" consulting type
						consultingType = await apiGetConsultingType({
							consultingTypeId: beratungType.id
						}).catch(() => null);
					} else if (consultingTypes.length > 0) {
						// Priority 2: Use first consulting type as fallback
						consultingType = await apiGetConsultingType({
							consultingTypeId: consultingTypes[0].id
						}).catch(() => null);
					} else {
						// Priority 3: Last resort - try to load by slug "beratung"
						consultingType = await apiGetConsultingType({
							consultingTypeSlug: 'beratung'
						}).catch(() => null);
					}
				}
				
				if (consultingType?.isAnonymousConversationAllowed) {
					setConsultingTypeId(consultingType.id);
					setConsultingTypeSlug(consultingType.slug);
					setIsAnonymousConversationAllowed(true);
				} else {
					handleUnmatched();
				}
			} catch (error) {
				console.error('Error loading consulting type for waiting room:', error);
				handleUnmatched();
			}
		})();
	}, [consultingTypeSlugParam, handleUnmatched]);

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
