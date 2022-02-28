import { useEffect, useState } from 'react';
import WonderPush from 'wonderpush-cordova-sdk';
import { history } from '../app/app';

export const RegisterPushNotifications = () => {
	const [notificationData, setNotificationData] = useState<string>(null);

	useEffect(() => {
		WonderPush.subscribeToNotifications();
		document.addEventListener(
			'wonderpush.registeredCallback',
			function (event: any) {
				if (event.method === 'openChat') {
					setNotificationData(event.arg);
				}
			},
			false
		);
	}, []);

	useEffect(() => {
		if (notificationData) {
			history.push(notificationData);
		}
	}, [notificationData]);

	return null;
};
