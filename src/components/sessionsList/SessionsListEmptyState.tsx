import * as React from 'react';
import { translate } from '../../resources/scripts/i18n/translate';

export class SessionListEmptyState extends React.Component {
	render(): JSX.Element {
		return (
			<div className="sessionsList">
				<p className="sessionsList--empty">
					{translate('sessionList.empty')}
				</p>
			</div>
		);
	}
}
