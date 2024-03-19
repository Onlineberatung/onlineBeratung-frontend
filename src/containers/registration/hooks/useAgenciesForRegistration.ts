import unionBy from 'lodash/unionBy';
import { useContext, useEffect, useMemo, useState } from 'react';
import { apiAgencySelection } from '../../../api';
import { useTenant } from '../../../globalState';
import {
	AgencyDataInterface,
	ConsultingTypeInterface,
	TopicsDataInterface
} from '../../../globalState/interfaces';
import { useConsultantRegistrationData } from './useConsultantRegistrationData';
import { ConsultingTypeRegistrationDefaults } from '../components/ProposedAgencies/ProposedAgencies';
import { UrlParamsContext } from '../../../globalState/provider/UrlParamsProvider';
import { VALID_POSTCODE_LENGTH } from '../../../components/agencySelection/agencySelectionHelpers';

interface AgenciesForRegistrationArgs {
	consultingType?: ConsultingTypeInterface;
	postcode: string;
	topic: TopicsDataInterface;
}
export const useAgenciesForRegistration = ({
	consultingType,
	postcode,
	topic
}: AgenciesForRegistrationArgs): {
	isLoading: boolean;
	agencies: AgencyDataInterface[];
	consultingTypes: ConsultingTypeInterface[];
} => {
	const tenantData = useTenant();

	const {
		consultant,
		agency: preselectedAgency,
		consultingType: preselectedConsultingType,
		slugFallback
	} = useContext(UrlParamsContext);

	const {
		agencies: consultantAgencies,
		consultingTypes: consultantConsultingTypes
	} = useConsultantRegistrationData({
		topicId: topic?.id,
		consultingTypeId: consultingType?.id
	});

	const [isLoading, setIsLoading] = useState(true);
	const [agencies, setAgencies] = useState<AgencyDataInterface[]>([]);

	const { autoSelectPostcode, autoSelectAgency } =
		consultingType?.registration || ConsultingTypeRegistrationDefaults;

	const topicsEnabledAndUnSelected = useMemo(
		() =>
			tenantData?.settings?.featureTopicsEnabled &&
			tenantData?.settings?.topicsInRegistrationEnabled &&
			topic?.id === undefined,
		[tenantData?.settings, topic?.id]
	);

	const allAgencies = useMemo(() => {
		// As long as no consulting type or topic is selected we can't show any agencies
		if (!consultingType && topicsEnabledAndUnSelected) {
			return [];
		}

		let uniqueAgencies = unionBy(
			[preselectedAgency, ...agencies, ...consultantAgencies].filter(
				Boolean
			),
			'id'
		);

		if (consultingType && !autoSelectPostcode) {
			// Hide external agencies in this case
			uniqueAgencies = uniqueAgencies.filter(
				(agency) => !agency.external
			);
		}

		uniqueAgencies = uniqueAgencies
			// Filter by consultingType
			.filter(
				(agency) =>
					slugFallback ||
					!consultingType ||
					agency.consultingType === consultingType.id
			);

		if (autoSelectAgency && uniqueAgencies.length > 0) {
			uniqueAgencies = [uniqueAgencies[0]];
		}
		return uniqueAgencies;
	}, [
		preselectedAgency,
		topicsEnabledAndUnSelected,
		agencies,
		consultantAgencies,
		consultingType,
		autoSelectPostcode,
		autoSelectAgency,
		slugFallback
	]);

	const allConsultingTypes = useMemo(
		() =>
			unionBy(
				[
					preselectedConsultingType,
					...consultantConsultingTypes
				].filter(Boolean),
				'id'
			),
		[preselectedConsultingType, consultantConsultingTypes]
	);

	// Do the requests depending on the conditions
	useEffect(() => {
		const abortController = new AbortController();
		// if we already have information from consulting types we can ignore the request
		if (
			consultant ||
			preselectedAgency ||
			topicsEnabledAndUnSelected ||
			(!autoSelectPostcode && postcode?.length !== VALID_POSTCODE_LENGTH)
		) {
			setIsLoading(false);
			return;
		}

		setIsLoading(true);
		apiAgencySelection(
			{
				...(autoSelectPostcode ? {} : { postcode }),
				topicId: topic?.id,
				// API will ignore consultingType if topicId isset but its required to be send
				consultingType: topic?.id || consultingType?.id,
				fetchConsultingTypeDetails: true
			},
			abortController.signal
		)
			.then((data) => {
				setAgencies(data || []);
			})
			.catch(() => {
				setAgencies([]);
			})
			.finally(() => {
				setIsLoading(false);
			});

		return () => {
			abortController?.abort();
		};
	}, [
		preselectedAgency,
		autoSelectPostcode,
		consultant,
		consultingType?.id,
		topic?.id,
		postcode,
		topicsEnabledAndUnSelected
	]);

	return {
		isLoading,
		agencies: allAgencies,
		consultingTypes: allConsultingTypes
	};
};
