import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { apiGetUserDataBySessionId } from '../../../api/apiGetUserDataBySessionId';
import { ActiveSessionContext } from '../../../globalState';
import { ReactComponent as NewWindow } from '../../../resources/img/icons/new-window.svg';
import { endpoints } from '../../../resources/scripts/endpoints';
import { refreshKeycloakAccessToken } from '../../../components/sessionCookie/refreshKeycloakAccessToken';
import { Text } from '../../../components/text/Text';
import '../../../components/askerInfo/askerInfoTools.styles';
import { useTranslation } from 'react-i18next';

export const AskerInfoDocumentation = () => {
	const { t: translate } = useTranslation();
	const { activeSession } = useContext(ActiveSessionContext);
	const [askerItemId, setAskerItemId] = useState<string>();

	const openToolsLink = () => {
		refreshKeycloakAccessToken().then((resp) => {
			const accessToken = resp.access_token;
			window.open(
				`${endpoints.budibaseTools(
					activeSession.consultant.id
				)}/consultantview?userId=${askerItemId}&access_token=${accessToken}`,
				'_blank',
				'noopener'
			);
		});
	};

	useEffect(() => {
		apiGetUserDataBySessionId(activeSession.item.id).then((resp) => {
			setAskerItemId(resp.askerId);
		});
	}, [activeSession?.item?.id, askerItemId]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<Text
				text={translate('userProfile.tools.documentation.text')}
				type="infoSmall"
			/>
			<button
				title={translate('userProfile.tools.documentation.info')}
				type="button"
				className="askerInfoTools__button text--tertiary primary button-as-link mt--2"
				onClick={openToolsLink}
				aria-label={translate('userProfile.tools.documentation.info')}
			>
				<NewWindow />
				{translate('userProfile.tools.documentation.btn')}
			</button>
		</>
	);
};
