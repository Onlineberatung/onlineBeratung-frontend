import * as React from 'react';
import { useEffect } from 'react';
import { translate } from '../../utils/translate';
import { mobileListView } from '../app/navigationHandler';
import Cal from '../cal/Cal';
import { Text } from '../text/Text';
import './session.styles';

export const SessionViewEmpty = () => {
	useEffect(() => {
		mobileListView();
	}, []);
	return (
		<div className="session session--empty">
			<Cal
				calLink="carlossoares"
				config={{
					name: 'John Doe',
					email: 'carlos.soares.ext@virtual-identity.com',
					notes: 'Test Meeting',
					guests: ['carlos.soares.ext@virtual-identity.com'],
					theme: 'light'
				}}
			/>
			<Text text={translate('session.empty')} type="divider" />
		</div>
	);
};
