import React from 'react';
import { translate } from '../../../../utils/translate';
import { Notice } from '../../../notice/Notice';
import { Text } from '../../../text/Text';

export const NoAgencyFound = ({ className }: { className?: string }) => (
	<div
		className={`registrationFormDigi__AgencyMandatoryFields ${className}`.trim()}
	>
		<Notice
			className="agencySelection__proposedAgencies--warning"
			title={translate('registrationDigi.agency.error.title')}
		>
			<Text
				className="agencySelection__proposedAgencies--warning__text"
				text={translate('registrationDigi.agency.fullFillAllFields')}
				type="infoLargeAlternative"
			/>
		</Notice>
	</div>
);
