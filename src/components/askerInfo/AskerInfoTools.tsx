import * as React from 'react';
import { useContext } from 'react';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';
import { ReactComponent as NewWindow } from '../../resources/img/icons/new-window.svg';
import { config } from '../../resources/scripts/config';
import { translate } from '../../utils/translate';
import { Text } from '../text/Text';
import './askerInfoTools.styles';

export const AskerInfoTools = () => {
	const { activeSession } = useContext(ActiveSessionContext);
	const openToolsLink = () => {
		console.log(activeSession);
		window.open(
			`${config.urls.budibaseDevServer}/${activeSession.item.id}`,
			'_blank',
			'noopener'
		);
	};

	return (
		<>
			<Text text={translate('userProfile.tools.title')} type="divider" />
			<button
				type="button"
				className="asker-info-tools__button text--tertiary primary button-as-link"
				onClick={openToolsLink}
			>
				<NewWindow />
				{translate('userProfile.tools.sharedContent')}
			</button>
		</>
	);
};
