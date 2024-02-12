import React from 'react';
import { useTranslation } from 'react-i18next';
import { Notice } from '../../../../components/notice/Notice';
import { Text } from '../../../../components/text/Text';
import { ConsultingTypeBasicInterface } from '../../../../globalState/interfaces';
import { useAppConfig } from '../../../../hooks/useAppConfig';
import { parsePlaceholderString } from '../../../../utils/parsePlaceholderString';

interface FallbackInformationArgs {
	consultingType: ConsultingTypeBasicInterface;
	postCode: string;
}

export const FallbackInformation = ({
	consultingType,
	postCode
}: FallbackInformationArgs) => {
	const settings = useAppConfig();
	const { t } = useTranslation(['common', 'agencies']);

	const postCodeFallbackUrl = parsePlaceholderString(
		settings.postcodeFallbackUrl,
		{
			url: consultingType.urls.registrationPostcodeFallbackUrl,
			postcode: postCode
		}
	);

	return (
		<Notice
			className="agencySelection__proposedAgencies--warning"
			title={t('registration.agencySelection.postcode.unavailable.title')}
		>
			<Text
				text={t(
					'registration.agencySelection.postcode.unavailable.text'
				)}
				type="infoLargeAlternative"
			/>
			<a href={postCodeFallbackUrl} target="_blank" rel="noreferrer">
				{t('registration.agencySelection.postcode.search')}
			</a>
		</Notice>
	);
};
