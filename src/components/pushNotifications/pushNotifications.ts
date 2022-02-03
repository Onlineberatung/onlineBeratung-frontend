import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { history } from '../app/app';

export const registerPushNotifications = () => {
	if (Capacitor.getPlatform() !== 'web') {
		registerNotifications();
		addNotifactionsListeners();
	}
};

const registerNotifications = async () => {
	let permStatus = await PushNotifications.checkPermissions();

	if (permStatus.receive === 'prompt') {
		permStatus = await PushNotifications.requestPermissions();
	}

	if (permStatus.receive !== 'granted') {
		throw new Error('User denied permissions!');
	}

	await PushNotifications.register();
};

const addNotifactionsListeners = async () => {
	await PushNotifications.addListener('registration', (token) => {
		console.info('Registration token: ', token.value);
	});

	await PushNotifications.addListener('registrationError', (err) => {
		console.error('Registration error: ', err.error);
	});

	await PushNotifications.addListener(
		'pushNotificationReceived',
		(notification) => {
			console.log('Push notification received: ', notification);
			alert(notification.title);
		}
	);

	await PushNotifications.addListener(
		'pushNotificationActionPerformed',
		(notification) => {
			if (notification.notification.data.path) {
				history.push(notification.notification.data.path);
			} else {
				// remove, only for test notifications
				history.push(
					`/sessions/consultant/sessionView/upc6HWovEvXLXYtMQ/1645`
				);
			}

			console.log('Push notification action performed', notification);
		}
	);
};
