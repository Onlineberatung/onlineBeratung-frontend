import * as React from 'react';
import { useTenant } from '../../../../';
import { LegalPageWrapper } from '../legalPageWrapper/LegalPageWrapper';
import useDocumentTitle from '../../utils/useDocumentTitle';
import { useTranslation } from 'react-i18next';

export const Privacy = () => {
	const [t] = useTranslation();
	const tenant = useTenant();
	useDocumentTitle(t('profile.footer.dataprotection'));
	return (
		<LegalPageWrapper
			content={
				tenant?.content?.privacy || t('profile.footer.dataprotection')
			}
			className={'terms'}
		/>
	);
};
