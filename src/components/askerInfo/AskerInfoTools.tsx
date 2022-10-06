import * as React from 'react';
import { useContext } from 'react';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';
import { ReactComponent as NewWindow } from '../../resources/img/icons/new-window.svg';
import { config } from '../../resources/scripts/config';
import { translate } from '../../utils/translate';
import { getValueFromCookie } from '../sessionCookie/accessSessionCookie';
import { Text } from '../text/Text';
import './askerInfoTools.styles';
import { AskerInfoToolsOptions } from './AskerInfoToolsOptions';

interface AskerInfoToolsProps {
	askerId: number;
}
export const AskerInfoTools = ({ askerId }: AskerInfoToolsProps) => {
	const { activeSession } = useContext(ActiveSessionContext);

	const openToolsLink = () => {
		const accessToken = getValueFromCookie('keycloak');
		window.open(
			`${config.endpoints.budibaseTools(
				activeSession.consultant.id
			)}/consultantview?userId=${askerId}&access_token=${accessToken}`,
			'_blank',
			'noopener'
		);
	};

	return (
		<>
			<AskerInfoToolsOptions askerId={askerId} />
			<Text
				className="asker-info-tools__share-title"
				text={translate('userProfile.tools.share.title')}
				type="divider"
			/>
			<button
				type="button"
				className="asker-info-tools__button text--tertiary primary button-as-link"
				onClick={openToolsLink}
			>
				<NewWindow />
				{translate('userProfile.tools.share.sharedContent')}
			</button>
		</>
	);
};
