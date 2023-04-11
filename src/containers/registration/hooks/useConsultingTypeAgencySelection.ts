import { useState, useEffect } from 'react';
import {
	ConsultantDataInterface,
	ConsultingTypeInterface,
	AgencyDataInterface
} from '../../../globalState';
import { useAppConfig } from '../../../hooks/useAppConfig';

export const useConsultingTypeAgencySelection = (
	consultant: ConsultantDataInterface,
	consultingType: ConsultingTypeInterface,
	agency: AgencyDataInterface
) => {
	const settings = useAppConfig();
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
		if (
			settings.multitenancyWithSingleDomainEnabled &&
			consultant?.agencies?.length > 0
		) {
			setAgencies(consultant?.agencies);
			setConsultingTypes([consultingType]);
			return;
		}

		const consultingTypes = consultant.agencies
			// Remove consultingType duplicates
			.reduce((acc: ConsultingTypeInterface[], { consultingTypeRel }) => {
				const alreadyExistsConsultingType = !acc.some(
					(consultingType) =>
						consultingType.id === consultingTypeRel.id
				);

				if (alreadyExistsConsultingType) {
					acc.push(consultingTypeRel);
				}
				return acc;
			}, [])
			// If consultingType was preselected by url slug
			.filter((c) => !consultingType || c.id === consultingType.id);

		if (agency) {
			const consultingTypeIds = consultingTypes.map((c) => c.id);
			const preselectedAgency = consultant.agencies.find(
				(a) =>
					a.id === agency.id &&
					consultingTypeIds.indexOf(a.consultingType) >= 0
			);
			if (preselectedAgency) {
				setAgencies([preselectedAgency]);
				setConsultingTypes([preselectedAgency.consultingTypeRel]);
				return;
			}
		}

		if (consultingTypes.length === 1) {
			const possibleAgencies = consultant.agencies.filter(
				(agency) => agency.consultingType === consultingTypes[0].id
			);
			setAgencies(possibleAgencies);
		} else {
			setAgencies(consultant.agencies);
		}

		setConsultingTypes(consultingTypes);
	}, [
		consultant,
		consultingType,
		agency,
		settings.multitenancyWithSingleDomainEnabled
	]);

	return { agencies, consultingTypes };
};
