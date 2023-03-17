import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getUrlParameter } from './getUrlParameter';
import {
	AgencyDataInterface,
	ConsultantDataInterface,
	ConsultingTypeInterface,
	LocaleContext
} from '../globalState';
import { apiGetAgencyById, apiGetConsultingType } from '../api';
import { apiGetConsultant } from '../api/apiGetConsultant';
import { isNumber } from './isNumber';
import { TopicsDataInterface } from '../globalState/interfaces/TopicsDataInterface';
import { apiGetTopicById } from '../api/apiGetTopicId';
import { useAppConfig } from '../hooks/useAppConfig';
import { isString } from 'lodash';
import { apiGetTopicsData } from '../api/apiGetTopicsData';

export default function useUrlParamsLoader() {
	const { setLocale } = useContext(LocaleContext);
	const { consultingTypeSlug } = useParams<{
		consultingTypeSlug: string;
	}>();
	const settings = useAppConfig();
	const agencyId = getUrlParameter('aid');
	const consultantId = getUrlParameter('cid');
	const topicIdOrName = getUrlParameter('tid');
	const language = getUrlParameter('lang');

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
						document.location.href = settings.urls.toRegistration;
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

				if (isNumber(topicIdOrName)) {
					await apiGetTopicById(topicIdOrName)
						.then(setTopic)
						.catch(() => null);
				} else if (isString(topicIdOrName)) {
					await apiGetTopicsData()
						.then((allTopics) => {
							const topic = allTopics.find(
								(topic) =>
									topic.name?.toLowerCase() ===
									decodeURIComponent(
										topicIdOrName.toLowerCase()
									)
							);
							setTopic(topic);
						})
						.catch(() => null);
				}

				setAgency(agency);
				setLoaded(true);
			} catch (error) {
				console.log(error);
			}
		})();
	}, [
		consultingTypeSlug,
		agencyId,
		consultantId,
		topicIdOrName,
		settings.multitenancyWithSingleDomainEnabled,
		settings.urls.toRegistration
	]);

	useEffect(() => {
		if (language) {
			setLocale(language);
		}
	}, [language, setLocale]);

	return { agency, consultant, consultingType, loaded, topic };
}
