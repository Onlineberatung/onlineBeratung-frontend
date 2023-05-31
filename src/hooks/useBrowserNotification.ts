import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ListItemInterface } from '../globalState';
import {
	isBrowserNotificationTypeEnabled,
	sendNotification
} from '../utils/notificationHelpers';

export const useBrowserNotification = () => {
	const { t } = useTranslation();
	const history = useHistory();

	const maybeSendNewEnquiryNotification = useCallback(
		(sessions: ListItemInterface[]) => {
			const enquirySessions = sessions.filter((session) => {
				return (
					!session.consultant &&
					session.session?.createDate &&
					new Date().getTime() -
						new Date(session.session.createDate).getTime() <
						1000 * 60
				);
			});

			if (
				enquirySessions.length > 0 &&
				isBrowserNotificationTypeEnabled('initialEnquiry')
			) {
				sendNotification(t('notifications.initialRequest.new'), {
					showAlways: true,
					onclick: () => {
						history.push(`/sessions/consultant/sessionPreview`);
					}
				});
			}
		},
		[history, t]
	);

	return {
		maybeSendNewEnquiryNotification
	};
};
