import uniqueBy from 'lodash/unionBy';
import { useEffect, useMemo, useState } from 'react';
import { apiAgencySelection } from '../../../api';
import { DEFAULT_POSTCODE } from '../../../components/registration/prefillPostcode';
import {
	AgencyDataInterface,
	ConsultantDataInterface,
	ConsultingTypeInterface,
	useTenant
} from '../../../globalState';
import { useConsultingTypeAgencySelection } from './useConsultingTypeAgencySelection';

interface AgenciesForRegistrationArgs {
	consultant: ConsultantDataInterface;
	consultingType: ConsultingTypeInterface;
	preSelectedAgency: AgencyDataInterface;
	postcode: string;
	mainTopicId: number;
}
export const useAgenciesForRegistration = ({
	consultant,
	consultingType,
	preSelectedAgency: propPreSelectedAgency,
	postcode,
	mainTopicId
}: AgenciesForRegistrationArgs) => {
	const tenantData = useTenant();
	const [isLoading, setIsLoading] = useState(false);
	const [preSelectedAgency, setPreselectedAgency] =
		useState<AgencyDataInterface>(propPreSelectedAgency);
	const { agencies: consultingTypeAgencies, consultingTypes } =
		useConsultingTypeAgencySelection(
			consultant,
			consultingType,
			preSelectedAgency
		);
	const [agencies, setAgencies] = useState<AgencyDataInterface[]>([]);
	const { autoSelectPostcode, autoSelectAgency } =
		consultingType?.registration || {};
	const allAgencies = useMemo(() => {
		const uniqueAgencies = uniqueBy(
			[
				propPreSelectedAgency,
				...agencies,
				...consultingTypeAgencies
			].filter(Boolean),
			'id'
		);

		if (consultingType && !autoSelectPostcode) {
			// Hide external agencies in this case
			return uniqueAgencies.filter((agency) => !agency.external);
		}
		return uniqueAgencies;
	}, [
		agencies,
		autoSelectPostcode,
		consultingType,
		consultingTypeAgencies,
		propPreSelectedAgency
	]);

	// Do the requests depending on the conditions
	useEffect(() => {
		// if we already have information from consulting types we can ignore the request
		if (
			consultant ||
			propPreSelectedAgency ||
			(tenantData?.settings?.featureTopicsEnabled &&
				tenantData?.settings?.topicsInRegistrationEnabled &&
				!mainTopicId)
		) {
			return;
		}

		setIsLoading(true);
		apiAgencySelection({
			postcode: autoSelectPostcode ? DEFAULT_POSTCODE : postcode,
			consultingType: consultingType?.id,
			topicId: mainTopicId
		})
			.then((data) => {
				setPreselectedAgency(null);
				setAgencies(data || []);
			})
			.catch(() => {
				setAgencies([]);
				setPreselectedAgency(null);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [
		autoSelectPostcode,
		consultant,
		consultingType?.id,
		mainTopicId,
		postcode,
		propPreSelectedAgency,
		tenantData?.settings
	]);

	useEffect(() => {
		if (
			(autoSelectAgency &&
				!propPreSelectedAgency &&
				allAgencies.length > 0) ||
			allAgencies.length === 1
		) {
			setPreselectedAgency(allAgencies[0]);
		}
	}, [allAgencies, autoSelectAgency, propPreSelectedAgency]);

	return {
		isLoading,
		agencies: allAgencies,
		preSelectedAgency,
		consultingTypes
	};
};
