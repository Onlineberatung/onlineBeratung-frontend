import { useState, useEffect, useContext, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getUrlParameter } from './getUrlParameter';
import { LocaleContext } from '../globalState';
import {
	AgencyDataInterface,
	ConsultantDataInterface,
	ConsultingTypeInterface,
	TopicsDataInterface
} from '../globalState/interfaces';
import { apiGetAgencyById, apiGetConsultingType } from '../api';
import { apiGetConsultant } from '../api/apiGetConsultant';
import { isNumber } from './isNumber';
import { apiGetTopicById } from '../api/apiGetTopicId';
import { useAppConfig } from '../hooks/useAppConfig';
import { isString } from 'lodash';
import { apiGetTopicsData } from '../api/apiGetTopicsData';

export default function useUrlParamsLoader(handleBadRequest?: () => void) {
	const { setLocale } = useContext(LocaleContext);
	const { consultingTypeSlug, topicSlug } = useParams<{
		consultingTypeSlug: string;
		topicSlug: string;
	}>();
	const settings = useAppConfig();
	const agencyId = getUrlParameter('aid');
	const consultantId = getUrlParameter('cid');
	const topicIdOrName = getUrlParameter('tid');
	const language = getUrlParameter('lang');
	const zipcodeParam =
		getUrlParameter('zipcode') || getUrlParameter('postcode');

	const [consultingType, setConsultingType] =
		useState<ConsultingTypeInterface | null>(null);
	const [agency, setAgency] = useState<AgencyDataInterface | null>(null);
	const [consultant, setConsultant] =
		useState<ConsultantDataInterface | null>(null);
	const [loaded, setLoaded] = useState<boolean>(false);
	const [topic, setTopic] = useState<TopicsDataInterface | null>(null);
	const [slugFallback, setSlugFallback] = useState<string>();
	const [zipcode, setZipcode] = useState<string>();

	const loadTopic = useCallback(
		async (agency) => {
			let topic = null;
			if (isNumber(topicIdOrName)) {
				topic = await apiGetTopicById(topicIdOrName).catch(() => null);
			} else if (isString(topicIdOrName) || isString(topicSlug)) {
				topic = await apiGetTopicsData()
					.then(
						(allTopics) =>
							allTopics.find(
								(topic) =>
									(topicIdOrName &&
										topic.name?.toLowerCase() ===
											decodeURIComponent(
												topicIdOrName.toLowerCase()
											)) ||
									(topicSlug &&
										topic.slug?.toLowerCase() ===
											decodeURIComponent(
												topicSlug.toLowerCase()
											))
							) || null
					)
					.catch(() => null);
			}

			if (!topic || !agency) {
				return [agency, topic];
			}

			// If agency is preselected but did not fit the topic preselection set it to null
			if (!agency.topicIds.includes(topic.id)) {
				return [null, topic];
			}

			return [agency, topic];
		},
		[topicIdOrName, topicSlug]
	);

	const handleConsultant = useCallback(
		async (agency, consultingType, topic) => {
			const consultant = await apiGetConsultant(consultantId, true).catch(
				() => null
			);

			if (!consultant) {
				return [agency, consultingType, topic, null];
			}

			// If the agency does not match the consultant's agency, set the agency to null
			if (
				agency &&
				!consultant.agencies.some((a) => a.id === agency?.id)
			) {
				agency = null;
			}

			// If the topic does not match the consultant's agency topics, set the topic to null
			if (
				topic &&
				!consultant.agencies.some((a) => a.topicIds.includes(topic?.id))
			) {
				topic = null;
			}

			// If the consultant agency consulting types does not match the consulting type, we'll set the consulting type to null
			// If the agency is invalid and set to null already the consulting type was loaded by the agency. If the consultant
			// has switched to another agency with the same consulting type this will not be catched by this conditions
			// and the consulting type will be kept and only agencies from the consultant with the same consulting type will be shown
			// but this should be fine.

			// Fallback logic for special client because slug is not unique. So try reversed logic
			if (
				settings?.registration?.useConsultingTypeSlug &&
				consultingType
			) {
				setSlugFallback(consultingType.slug);
				const slugAgencies = consultant.agencies.filter(
					(a) => a.consultingTypeRel.slug === consultingType.slug
				);
				if (slugAgencies.length > 0) {
					consultingType = slugAgencies[0].consultingTypeRel;
				}
			} else if (
				settings?.registration?.useConsultingTypeSlug &&
				!consultingType
			) {
				consultingType = consultant.agencies?.[0]?.consultingTypeRel;
				setSlugFallback(consultingType?.slug);
			} else if (
				// If the consultingType does not match the consultant's consultingTypes, set the consultingType to null
				!consultant.agencies.some(
					(a: AgencyDataInterface) =>
						!consultingType ||
						a.consultingType === consultingType?.id
				)
			) {
				consultingType = null;
			}

			return [agency, consultingType, topic, consultant];
		},
		[consultantId, settings?.registration?.useConsultingTypeSlug]
	);

	useEffect(() => {
		(async () => {
			try {
				let agency: AgencyDataInterface = null,
					consultingType: ConsultingTypeInterface = null,
					consultant: ConsultantDataInterface = null,
					topic: TopicsDataInterface = null;

				if (agencyId !== null && isNumber(agencyId)) {
					agency = await apiGetAgencyById(
						parseInt(agencyId),
						true
					).catch(() => null);
				}

				if (consultingTypeSlug || agency) {
					consultingType = await apiGetConsultingType({
						consultingTypeSlug,
						consultingTypeId: agency?.consultingType
					});

					// Fallback logic for special client because slug is not unique. So try reversed logic
					if (
						settings?.registration?.useConsultingTypeSlug &&
						consultingType
					) {
						setSlugFallback(consultingType.slug);
					} else if (
						agency?.consultingType !== consultingType?.id ||
						(agency?.external &&
							!consultingType?.registration?.autoSelectPostcode)
					) {
						agency = null;
					}
				}

				if (topicIdOrName !== null || topicSlug) {
					[agency, topic] = await loadTopic(agency);
				}

				if (consultantId !== null) {
					[agency, consultingType, topic, consultant] =
						await handleConsultant(agency, consultingType, topic);
				}

				const isConsultantOk = consultantId === null || !!consultant;
				const isConsultingTypeOk =
					!consultingTypeSlug || !!consultingType;
				const isAgencyOk = agencyId === null || !!agency;
				const isTopicOk = topicIdOrName === null || !!topic;
				if (
					!isConsultantOk &&
					!isConsultingTypeOk &&
					!isAgencyOk &&
					!isTopicOk &&
					handleBadRequest
				) {
					handleBadRequest();
					return;
				}

				const zipcodeRegex = new RegExp(/^(0[1-9]|[1-9]\d)\d{3}$/);
				if (zipcodeParam && zipcodeRegex.test(zipcodeParam)) {
					setZipcode(zipcodeParam);
				}

				setTopic(topic);
				setConsultant(consultant);
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
		topicSlug,
		zipcodeParam,
		settings.multitenancyWithSingleDomainEnabled,
		settings.urls.toRegistration,
		settings?.registration?.useConsultingTypeSlug,
		handleConsultant,
		loadTopic,
		handleBadRequest
	]);

	useEffect(() => {
		if (language !== null) {
			setLocale(language);
		}
	}, [language, setLocale]);

	return {
		agency,
		consultant,
		consultingType,
		loaded,
		topic,
		slugFallback,
		zipcode
	};
}
