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
import { config } from '../resources/scripts/config';
import { TopicsDataInterface } from '../globalState/interfaces/TopicsDataInterface';
import { apiGetTopicById } from '../api/apiGetTopicId';
import { useAppConfigContext } from '../globalState/context/useAppConfig';

export default function useUrlParamsLoader() {
	const settings = useAppConfigContext();
	const { consultingTypeSlug } = useParams();
	const agencyId = getUrlParameter('aid');
	const consultantId = getUrlParameter('cid');
	const topicId = getUrlParameter('tid');

	const [consultingType, setConsultingType] =
		useState<ConsultingTypeInterface | null>(null);
	const [agency, setAgency] = useState<AgencyDataInterface | null>(null);
	const [consultant, setConsultant] =
		useState<ConsultantDataInterface | null>(null);
	const [loaded, setLoaded] = useState<boolean>(false);
	const [topic, setTopic] = useState<TopicsDataInterface | null>(null);

	useEffect(() => {
		(async () => {
			try {
				let agency,
					consultingType = null;

				if (isNumber(agencyId)) {
					agency = await apiGetAgencyById(agencyId).catch(() => null);
				}

				if (consultantId) {
					const consultant = await apiGetConsultant(
						consultantId,
						true,
						'basic'
					).catch(() => {
						// consultant not found -> go to registration
						document.location.href = config.urls.toRegistration;
					});

					if (consultant) setConsultant(consultant);
				}

				if (consultingTypeSlug || agency) {
					consultingType = await apiGetConsultingType({
						consultingTypeSlug,
						consultingTypeId: agency?.consultingType
					});
					setConsultingType(consultingType);
				}
				// When we've the multi tenancy with single domain enabled we'll always have multiple consulting types
				if (
					!settings.multitenancyWithSingleDomainEnabled &&
					agency?.consultingType !== consultingType?.id
				) {
					agency = null;
				}

				if (isNumber(topicId)) {
					const topicById = await apiGetTopicById(topicId).catch(
						() => null
					);
					setTopic(topicById);
				}

				setAgency(agency);
				setLoaded(true);
			} catch (error) {
				console.log(error);
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [consultingTypeSlug, agencyId, consultantId, topicId]);

	return { agency, consultant, consultingType, loaded, topic };
}
