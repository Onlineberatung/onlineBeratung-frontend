import { useState, useEffect, useContext } from 'react';
import unionBy from 'lodash/unionBy';

import {
	ConsultingTypeInterface,
	AgencyDataInterface
} from '../../../globalState/interfaces';
import { useAppConfig } from '../../../hooks/useAppConfig';
import { UrlParamsContext } from '../../../globalState/provider/UrlParamsProvider';

export const useConsultantAgenciesAndConsultingTypes = () => {
	const settings = useAppConfig();
	const { consultingType, consultant, agency } = useContext(UrlParamsContext);

	const [consultingTypes, setConsultingTypes] = useState<
		ConsultingTypeInterface[]
	>([]);

	const [agencies, setAgencies] = useState<AgencyDataInterface[]>([]);

	useEffect(() => {
		if (!consultant) {
			return;
		}

		// When we've the multi tenancy with single domain we can simply ignore the
		// consulting types because we'll get agencies across tenants
		// ToDo: This logic breaks consultant direct links with multiple consulting types
		if (
			settings.multitenancyWithSingleDomainEnabled &&
			consultant?.agencies?.length > 0
		) {
			setAgencies(consultant?.agencies);
			setConsultingTypes([consultingType]);
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
				.filter((c) => !consultingType || c.id === consultingType.id);

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
		settings.multitenancyWithSingleDomainEnabled
	]);

	return { agencies, consultingTypes };
};
