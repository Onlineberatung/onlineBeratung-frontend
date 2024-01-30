import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getUrlParameter } from './getUrlParameter';
import {
	AgencyDataInterface,
	ConsultantDataInterface,
	ConsultingTypeInterface,
	LocaleContext
} from '../globalState';
import {
	apiGetAgencyById,
	apiGetConsultingType,
	apiGetConsultingTypes
} from '../api';
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

	const [slugFallback, setSlugFallback] = useState<string>();

	console.log('BBB');
	useEffect(() => {
		(async () => {
			try {
				let agency,
					consultingType = null;

				if (isNumber(agencyId)) {
					agency = await apiGetAgencyById(
						agencyId,
						true,
						'full'
					).catch(() => null);
				}

				if (consultingTypeSlug || agency) {
					consultingType = await apiGetConsultingType({
						consultingTypeSlug,
						consultingTypeId: agency?.consultingType
					});

					// Fallback logic for special client because slug is not unique. So try reversed logic
					if (
						settings?.registration?.consultingType?.slugLoader
							?.enabled &&
						consultingTypeSlug &&
						consultingType
					) {
						const consultingTypes = (
							await apiGetConsultingTypes()
						).filter((ct) => ct.id !== consultingType.id);
						for (const consultingType of consultingTypes) {
							const otherConsultingType =
								await apiGetConsultingType({
									consultingTypeId: consultingType.id
								});
							if (
								otherConsultingType.slug === consultingTypeSlug
							) {
								setSlugFallback(consultingTypeSlug);
								break;
							}
						}
					}
				}

				if (consultantId) {
					const consultant = await apiGetConsultant(
						consultantId,
						true,
						'full'
					).catch(() => {
						// consultant not found -> go to registration
						document.location.href = settings.urls.toRegistration;
					});

					if (consultant) {
						setConsultant(consultant);

						// If the agency does not match the consultant's agency, we'll set the agency to null
						if (
							!consultant.agencies.some(
								(a) => a.id === agency?.id
							)
						) {
							agency = null;
						}

						// If the consultant agency consulting types does not match the consulting type, we'll set the consulting type to null
						// If the agency is invalid and set to null already the consulting type was loaded by the agency. If the consultant
						// has switched to another agency with the same consulting type this will not be catched by this conditions
						// and the consulting type will be kept and only agencies from the consultant with the same consulting type will be shown
						// but this should be fine.
						if (
							!consultant.agencies.some(
								(a) =>
									!consultingType ||
									a.consultingType === consultingType?.id
							)
						) {
							consultingType = null;

							// Fallback logic for special client because slug is not unique. So try reversed logic
							if (
								settings?.registration?.consultingType
									?.slugLoader?.enabled &&
								consultingTypeSlug
							) {
								setSlugFallback(consultingTypeSlug);
								const slugAgencies = consultant.agencies.filter(
									(a) =>
										a.consultingTypeRel.slug ===
										consultingTypeSlug
								);
								if (slugAgencies.length > 0) {
									consultingType =
										slugAgencies[0].consultingTypeRel;
								}
							}
						}
					}
				}

				// When we've the multi tenancy with single domain enabled we'll always have multiple consulting types
				if (
					!settings.multitenancyWithSingleDomainEnabled &&
					agency?.consultingType !== consultingType?.id
				) {
					agency = null;
				}

				if (isNumber(topicIdOrName) && topicIdOrName !== '') {
					await apiGetTopicById(topicIdOrName)
						.then(setTopic)
						.catch(() => null);
				} else if (isString(topicIdOrName) && topicIdOrName !== '') {
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

				setConsultingType(consultingType);
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
		settings.urls.toRegistration,
		settings?.registration?.consultingType?.slugLoader?.enabled
	]);

	useEffect(() => {
		if (language) {
			setLocale(language);
		}
	}, [language, setLocale]);

	return { agency, consultant, consultingType, loaded, topic, slugFallback };
}
