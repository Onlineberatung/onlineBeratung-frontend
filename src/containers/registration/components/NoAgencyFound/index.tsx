import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '../../../../components/text/Text';
import { ConsultingTypeBasicInterface } from '../../../../globalState/interfaces';
import { FallbackInformation } from '../FallbackInformation';

interface NoAgencyFoundArgs {
	handleKeyDown: (event) => void;
	consultingType: ConsultingTypeBasicInterface;
	postCode: string;
}

export const NoAgencyFound = ({
	consultingType,
	handleKeyDown,
	postCode
}: NoAgencyFoundArgs) => {
	const { t: translate } = useTranslation(['common', 'consultingTypes']);

	if (consultingType?.urls.registrationPostcodeFallbackUrl) {
		return (
			<FallbackInformation
				consultingType={consultingType}
				postCode={postCode}
			/>
		);
	}

	return (
		<div
			className="registrationForm__no-agency-found"
			onKeyDown={handleKeyDown}
		>
			<Text
				text={translate('registration.agencySelection.noAgencies')}
				type="infoMedium"
			/>
		</div>
	);
};
