import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { apiGetUserDataBySessionId } from '../../api/apiGetUserDataBySessionId';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';
import { ReactComponent as NewWindow } from '../../resources/img/icons/new-window.svg';
import { config } from '../../resources/scripts/config';
import { translate } from '../../utils/translate';
import { getValueFromCookie } from '../sessionCookie/accessSessionCookie';
import { Text } from '../text/Text';
import './askerInfoTools.styles';
import { AskerInfoToolsOptions } from './AskerInfoToolsOptions';

export const AskerInfoTools = () => {
	const { activeSession } = useContext(ActiveSessionContext);
	const [askerId, setAskerId] = useState();
	const accessToken = getValueFromCookie('keycloak');

	const openToolsLink = () => {
		window.open(
			`${config.endpoints.budibaseTools(
				activeSession.consultant.id
			)}/consultantview?userId=${askerId}&access_token=${accessToken}`,
			'_blank',
			'noopener'
		);
	};

	useEffect(() => {
		apiGetUserDataBySessionId(activeSession.item.id).then((resp) => {
			setAskerId(resp.askerId);
		});
	}, [activeSession?.item?.id, setAskerId]); // eslint-disable-line react-hooks/exhaustive-deps

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
