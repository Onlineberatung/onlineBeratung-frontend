import React from 'react';
import { useTranslation } from 'react-i18next';
import { Headline } from '../../../../../components/headline/Headline';
import { Text } from '../../../../../components/text/Text';

interface ProposedAgenciesTitleArgs {
	hasPreselectedAgency: boolean;
	hasConsultingTypes: boolean;
	hasAutoSelectPostCodeEnabled: boolean;
	postCodeValue: string;
	agenciesCount: number;
}

export const ProposedAgenciesTitle = ({
	hasPreselectedAgency,
	hasConsultingTypes,
	hasAutoSelectPostCodeEnabled,
	postCodeValue,
	agenciesCount
}: ProposedAgenciesTitleArgs) => {
	const { t } = useTranslation(['common']);

	if (hasPreselectedAgency || (!hasConsultingTypes && agenciesCount === 1)) {
		return (
			<Headline
				semanticLevel="4"
				styleLevel="5"
				text={t('registration.agency.preselected.prefix')}
			/>
		);
	}

	if (hasConsultingTypes) {
		return (
			<Text
				text={t(
					'registration.consultingTypeAgencySelection.agency.infoText'
				)}
				type="standard"
			/>
		);
	}

	if (!hasAutoSelectPostCodeEnabled) {
		const text = [
			t('registration.agencySelection.title.start'),
			' ',
			postCodeValue,
			t('registration.agencySelection.title.end')
		].join('');
		return <Text text={text} type="standard" />;
	}

	return null;
};
