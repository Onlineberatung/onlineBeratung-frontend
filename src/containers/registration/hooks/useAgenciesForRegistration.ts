import unionBy from 'lodash/unionBy';
import { useContext, useEffect, useMemo, useState } from 'react';
import { apiAgencySelection } from '../../../api';
import { DEFAULT_POSTCODE } from '../../../components/registration/prefillPostcode';
import { useTenant } from '../../../globalState';
import {
	AgencyDataInterface,
	ConsultingTypeInterface,
	TopicsDataInterface
} from '../../../globalState/interfaces';
import { useConsultantAgenciesAndConsultingTypes } from './useConsultantAgenciesAndConsultingTypes';
import { ConsultingTypeRegistrationDefaults } from '../components/ProposedAgencies/ProposedAgencies';
import { UrlParamsContext } from '../../../globalState/provider/UrlParamsProvider';

interface AgenciesForRegistrationArgs {
	consultingType: ConsultingTypeInterface;
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
		agencies: consultantAgencies,
		consultingTypes: consultantConsultingTypes
	} = useConsultantAgenciesAndConsultingTypes();

	const [isLoading, setIsLoading] = useState(true);
	const [agencies, setAgencies] = useState<AgencyDataInterface[]>([]);
	const {
		consultant,
		agency,
		consultingType: preselectedConsultingType
	} = useContext(UrlParamsContext);

	const { autoSelectPostcode, autoSelectAgency } =
		consultingType?.registration || ConsultingTypeRegistrationDefaults;

	const allAgencies = useMemo(() => {
		// As long as no consulting type is selected we can't show any agencies
		if (!consultingType) {
			return [];
		}

		let uniqueAgencies = unionBy(
			[agency, ...agencies, ...consultantAgencies].filter(Boolean),
			'id'
		);

		if (consultingType && !autoSelectPostcode) {
			// Hide external agencies in this case
			uniqueAgencies = uniqueAgencies.filter(
				(agency) => !agency.external
			);
		}
		if (consultingType) {
			uniqueAgencies = uniqueAgencies.filter(
				(agency) => agency.consultingType === consultingType.id
			);
		}
		if (autoSelectAgency && uniqueAgencies.length > 0) {
			uniqueAgencies = [uniqueAgencies[0]];
		}
		return uniqueAgencies;
	}, [
		agency,
		agencies,
		consultantAgencies,
		consultingType,
		autoSelectPostcode,
		autoSelectAgency
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
			agency ||
			(tenantData?.settings?.featureTopicsEnabled &&
				tenantData?.settings?.topicsInRegistrationEnabled &&
				topic?.id === undefined)
		) {
			setIsLoading(false);
			return;
		}

		setIsLoading(true);
		apiAgencySelection(
			{
				postcode: autoSelectPostcode ? DEFAULT_POSTCODE : postcode,
				consultingType: consultingType?.id,
				topicId: topic?.id
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
		agency,
		autoSelectPostcode,
		consultant,
		consultingType?.id,
		topic?.id,
		postcode,
		tenantData?.settings
	]);

	return {
		isLoading,
		agencies: allAgencies,
		consultingTypes: allConsultingTypes
	};
};
