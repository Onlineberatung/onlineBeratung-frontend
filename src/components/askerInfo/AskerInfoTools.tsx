import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { apiGetUserDataBySessionId } from '../../api/apiGetUserDataBySessionId';
import { ActiveSessionContext } from '../../globalState';
import NewWindow from '../../resources/img/icons/new-window.svg?react';
import { endpoints } from '../../resources/scripts/endpoints';
import { refreshKeycloakAccessToken } from '../sessionCookie/refreshKeycloakAccessToken';
import { Text } from '../text/Text';
import './askerInfoTools.styles.scss';
import { AskerInfoToolsOptions } from './AskerInfoToolsOptions';
import { useTranslation } from 'react-i18next';

export const AskerInfoTools = () => {
	const { t: translate } = useTranslation();
	const { activeSession } = useContext(ActiveSessionContext);
	const [askerId, setAskerId] = useState<string>();

	const openToolsLink = () => {
		refreshKeycloakAccessToken().then((resp) => {
			const accessToken = resp.access_token;
			window.open(
				`${endpoints.budibaseTools(
					activeSession.consultant.id
				)}/consultantview?userId=${askerId}&access_token=${accessToken}`,
				'_blank',
				'noopener'
			);
		});
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
				className="askerInfoTools__share-title"
				text={translate('userProfile.tools.share.title')}
				type="divider"
			/>
			<button
				title={translate('userProfile.tools.share.info')}
				type="button"
				className="askerInfoTools__button text--tertiary primary button-as-link"
				onClick={openToolsLink}
				aria-label={translate('userProfile.tools.share.info')}
			>
				<NewWindow />
				{translate('userProfile.tools.share.sharedContent')}
			</button>
		</>
	);
};
