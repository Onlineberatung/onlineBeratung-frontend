import React from 'react';
import { useTranslation } from 'react-i18next';
import ShieldIcon from '../../resources/img/icons/shield.svg?react';

import './e2eeActivatedMessage.styles.scss';

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
