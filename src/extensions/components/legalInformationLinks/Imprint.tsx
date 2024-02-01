import * as React from 'react';
import { useTenant } from '../../../../';
import { LegalPageWrapper } from '../legalPageWrapper/LegalPageWrapper';
import useDocumentTitle from '../../utils/useDocumentTitle';
import { useTranslation } from 'react-i18next';

export const Imprint = () => {
	const [t] = useTranslation();
	const tenant = useTenant();
	useDocumentTitle(t('profile.footer.imprint'));
	return (
		<LegalPageWrapper
			content={tenant?.content?.impressum || t('profile.footer.imprint')}
			className={'terms'}
		/>
	);
};
