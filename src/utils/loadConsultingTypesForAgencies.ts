import { apiGetConsultingType } from '../api';
import { AgencyDataInterface } from '../globalState/interfaces';

export const loadConsultingTypesForAgencies = async (
	agencies: AgencyDataInterface[]
): Promise<AgencyDataInterface[]> => {
	// Get unique consultingTypes to prevent multiple requests to api
	const uniqueConsultingTypeIds = [
		...new Set(agencies.map((a) => a?.consultingType).filter(Boolean))
	];

	return Promise.all(
		uniqueConsultingTypeIds.map((consultingTypeId) =>
			apiGetConsultingType({
				consultingTypeId
			})
		)
	).then((consultingTypes) =>
		agencies.map((a) => ({
			...a,
			consultingTypeRel: consultingTypes.find(
				(c) => c.id === a.consultingType
			)
		}))
	);
};
