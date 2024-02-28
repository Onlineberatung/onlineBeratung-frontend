import { useState, useEffect, useContext, useMemo } from 'react';
import unionBy from 'lodash/unionBy';

import {
	ConsultingTypeInterface,
	AgencyDataInterface
} from '../../../globalState/interfaces';
import { useAppConfig } from '../../../hooks/useAppConfig';
import { UrlParamsContext } from '../../../globalState/provider/UrlParamsProvider';

interface ConsultantRegistrationDataArgs {
	consultingTypeId?: number;
	topicId?: number;
}

export const useConsultantRegistrationData = ({
	consultingTypeId,
	topicId
}: ConsultantRegistrationDataArgs) => {
	const settings = useAppConfig();
	const {
		consultingType: preselectedConsultingType,
		consultant,
		agency: preselectedAgency,
		topic: preselectedTopic,
		slugFallback
	} = useContext(UrlParamsContext);

	const [consultingTypes, setConsultingTypes] = useState<
		ConsultingTypeInterface[]
	>([]);
	const [agencies, setAgencies] = useState<AgencyDataInterface[]>([]);

	const topicIds = useMemo<number[]>(
		() => [
			...new Set(
				agencies
					.reduce(
						(topicIds, agency) =>
							topicIds.concat(agency?.topicIds || []),
						[]
					)
					// Filter topic by preselected topic
					.filter(
						(tid) =>
							!preselectedTopic || tid === preselectedTopic?.id
					)
					// Filter topics by consultant topics
					.filter(
						(tid) =>
							!consultant ||
							consultant.agencies.some((a) =>
								a.topicIds?.includes(tid)
							)
					)
					// Filter topics by preselected agency
					.filter(
						(tid) =>
							!preselectedAgency ||
							preselectedAgency.topicIds?.includes(tid)
					)
			)
		],
		[agencies, consultant, preselectedAgency, preselectedTopic]
	);

	useEffect(() => {
		if (!consultant) {
			return;
		}

		const consultingTypes =
			// Remove consultingType duplicates
			unionBy(
				consultant.agencies.map(
					({ consultingTypeRel }) => consultingTypeRel
				),
				'id'
			)
				// Filter consultingTypes by preselected consultingType
				.filter(
					(c) =>
						!preselectedConsultingType ||
						(slugFallback
							? c.slug === slugFallback
							: c.id === preselectedConsultingType.id)
				);
		if (preselectedAgency) {
			setAgencies([preselectedAgency]);
			setConsultingTypes([preselectedAgency.consultingTypeRel]);
			return;
		}

		const consultingTypeIds = consultingTypes.map((c) => c.id);
		const possibleAgencies = consultant.agencies
			// If a consultingType or topic is selected filter the agencies
			.filter((agency) =>
				consultingTypeIds.includes(agency.consultingType)
			)
			// Filter agencies by selected topic
			.filter(
				(a) =>
					slugFallback ||
					!consultingTypeId ||
					a.consultingType === consultingTypeId
			)
			// Filter agencies by preselected topic
			.filter(
				(a) =>
					!preselectedTopic ||
					a.topicIds?.includes(preselectedTopic?.id)
			)
			// Filter agencies by selected topic
			.filter((a) => !topicId || a.topicIds?.includes(topicId))
			// Filter agencies by preselected agency
			.filter((a) => !preselectedAgency || preselectedAgency.id === a.id);
		setAgencies(possibleAgencies);
		setConsultingTypes(
			slugFallback
				? [preselectedConsultingType || consultingTypes.pop()].filter(
						Boolean
					)
				: consultingTypes
		);
	}, [
		topicId,
		consultingTypeId,
		consultant,
		preselectedConsultingType,
		preselectedAgency,
		preselectedTopic,
		settings.multitenancyWithSingleDomainEnabled,
		slugFallback
	]);

	return { agencies, consultingTypes, topicIds };
};
