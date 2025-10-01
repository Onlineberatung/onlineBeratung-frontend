import React from 'react';
import { Notice } from '../../../../../components/notice/Notice';
import { Text } from '../../../../../components/text/Text';
import { useTranslation } from 'react-i18next';

export const NoAgencyFound = ({ className }: { className?: string }) => {
	const { t: translate } = useTranslation();
	return (
		<div
			className={`registrationFormDigi__AgencyMandatoryFields ${className}`.trim()}
		>
			<Notice
				className="agencySelection__proposedAgencies--warning"
				title={translate('registrationDigi.agency.error.title')}
			>
				<Text
					className="agencySelection__proposedAgencies--warning__text"
					text={translate(
						'registrationDigi.agency.fullFillAllFields'
					)}
					type="infoLargeAlternative"
				/>
			</Notice>
		</div>
	);
};
