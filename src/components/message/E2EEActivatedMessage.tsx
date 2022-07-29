import React from 'react';
import { translate } from '../../utils/translate';
import { ReactComponent as ShieldIcon } from '../../resources/img/icons/shield.svg';

import './e2eeActivatedMessage.styles';

interface E2EEActivatedMessageProps {}

export const E2EEActivatedMessage: React.FC<E2EEActivatedMessageProps> = () => {
	return (
		<div className="e2eeActivatedMessage">
			<ShieldIcon />
			{translate('e2ee.hint')}
		</div>
	);
};
