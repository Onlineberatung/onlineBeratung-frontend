import * as React from 'react';
import { useTenant } from '../../../../';
import useUrlParamsLoader from '../../../utils/useUrlParamsLoader';
import { LegalPageWrapper } from '../legalPageWrapper/LegalPageWrapper';
import useDocumentTitle from '../../utils/useDocumentTitle';
import { useTranslation } from 'react-i18next';

export const Privacy = () => {
	const [t] = useTranslation();
	const tenant = useTenant();
	const { agency } = useUrlParamsLoader();
	useDocumentTitle(t('profile.footer.dataprotection'));

	return (
		<LegalPageWrapper
			content={
				agency?.agencySpecificPrivacy ||
				tenant?.content?.renderedPrivacy ||
				t('profile.footer.dataprotection')
			}
			className={'terms'}
		/>
	);
};
