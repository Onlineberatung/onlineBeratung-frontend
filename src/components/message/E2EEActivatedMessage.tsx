import React from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as ShieldIcon } from '../../resources/img/icons/shield.svg';

import './e2eeActivatedMessage.styles';

interface E2EEActivatedMessageProps {}

export const E2EEActivatedMessage: React.FC<E2EEActivatedMessageProps> = () => {
	const { t: translate } = useTranslation();

	return (
		<div className="e2eeActivatedMessage">
			<ShieldIcon aria-hidden="true" focusable="false" />
			{translate('e2ee.hint')}
		</div>
	);
};
