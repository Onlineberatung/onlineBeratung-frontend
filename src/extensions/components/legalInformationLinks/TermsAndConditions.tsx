import * as React from 'react';
import { useTenant } from '../../../../';

import { LegalPageWrapper } from '../legalPageWrapper/LegalPageWrapper';
import useDocumentTitle from '../../utils/useDocumentTitle';
import { useTranslation } from 'react-i18next';

export const TermsAndConditions = () => {
	const [t] = useTranslation();
	const tenant = useTenant();
	useDocumentTitle(t('legal.termsAndConditions.label'));

	return (
		<LegalPageWrapper
			content={
				tenant?.content?.termsAndConditions ||
				t('legal.termsAndConditions.label')
			}
			className="terms"
		/>
	);
};
