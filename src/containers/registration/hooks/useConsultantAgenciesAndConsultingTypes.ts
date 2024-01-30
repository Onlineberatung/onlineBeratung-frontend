import { useState, useEffect, useContext } from 'react';
import unionBy from 'lodash/unionBy';

import {
	ConsultingTypeInterface,
	AgencyDataInterface
} from '../../../globalState';
import { useAppConfig } from '../../../hooks/useAppConfig';
import { UrlParamsContext } from '../../../globalState/provider/UrlParamsProvider';
import { useParams } from 'react-router-dom';

export const useConsultantAgenciesAndConsultingTypes = () => {
	const settings = useAppConfig();
	const { consultingTypeSlug } = useParams<{
		consultingTypeSlug: string;
	}>();
	const { consultingType, consultant, agency, slugFallback } =
		useContext(UrlParamsContext);

	const [consultingTypes, setConsultingTypes] = useState<
		ConsultingTypeInterface[]
	>([]);

	const [agencies, setAgencies] = useState<AgencyDataInterface[]>([]);

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
				// If consultingType was preselected by url slug
				.filter(
					(c) =>
						!consultingType ||
						(slugFallback
							? c.slug === consultingTypeSlug
							: c.id === consultingType.id)
				);

		if (agency) {
			const consultingTypeIds = consultingTypes.map((c) => c.id);
			const preselectedAgency = consultant.agencies.find(
				(a) =>
					a.id === agency.id &&
					consultingTypeIds.includes(a.consultingType)
			);
			if (preselectedAgency) {
				setAgencies([preselectedAgency]);
				setConsultingTypes([preselectedAgency.consultingTypeRel]);
				return;
			}
		}

		const possibleAgencies = consultant.agencies
			// If a consultingType is selected filter the agencies
			.filter((agency) =>
				consultingTypes.find((ct) => ct.id === agency.consultingType)
			);

		setAgencies(possibleAgencies);
		setConsultingTypes(consultingTypes);
	}, [
		consultant,
		consultingType,
		agency,
		settings.multitenancyWithSingleDomainEnabled,
		consultingTypeSlug,
		slugFallback
	]);

	return { agencies, consultingTypes };
};
