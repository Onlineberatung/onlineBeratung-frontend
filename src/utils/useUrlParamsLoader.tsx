import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUrlParameter } from './getUrlParameter';
import {
	AgencyDataInterface,
	ConsultantDataInterface,
	ConsultingTypeInterface
} from '../globalState';
import { apiGetAgencyById, apiGetConsultingType } from '../api';
import { apiGetConsultant } from '../api/apiGetConsultant';
import { isNumber } from './isNumber';

export default function useUrlParamsLoader() {
	const { consultingTypeSlug } = useParams();
	const agencyId = getUrlParameter('aid');
	const consultantId = getUrlParameter('cid');

	const [consultingType, setConsultingType] =
		useState<ConsultingTypeInterface | null>(null);
	const [agency, setAgency] = useState<AgencyDataInterface | null>(null);
	const [consultant, setConsultant] =
		useState<ConsultantDataInterface | null>(null);
	const [loaded, setLoaded] = useState<boolean>(false);

	useEffect(() => {
		(async () => {
			try {
				let agency,
					consultingType = null;
				if (isNumber(agencyId)) {
					agency = await apiGetAgencyById(agencyId).catch(() => null);
				}

				if (consultantId) {
					setConsultant(await apiGetConsultant(consultantId, true));
				}

				if (consultingTypeSlug || agency) {
					consultingType = await apiGetConsultingType({
						consultingTypeSlug,
						consultingTypeId: agency?.consultingType
					});
					setConsultingType(consultingType);
				}

				if (agency?.consultingType !== consultingType?.id) {
					agency = null;
				}

				setAgency(agency);
				setLoaded(true);
			} catch (error) {
				console.log(error);
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [consultingTypeSlug, agencyId, consultantId]);

	return { agency, consultant, consultingType, loaded };
}
