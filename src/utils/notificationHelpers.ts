import { v4 as uuidv4 } from 'uuid';
import incomingNotification from '../resources/audio/incomingNotification.mp3';

const audio =
	'Audio' in window
		? new Audio(
				process.env.AUDIO_FILE_INCOMING_NOTIFICATION ??
					incomingNotification
			)
		: null;

type ExtraNotificationOptions = {
	showAlways?: boolean;
	onclick?: Function;
	onclose?: Function;
	onshow?: Function;
};

export const PERMISSION_GRANTED = 'granted';
export const PERMISSION_DEFAULT = 'default';

export const isSupported = () => {
	return 'Notification' in window && Notification.requestPermission;
};

export const hasPermissions = (permission: NotificationPermission) => {
	return Notification.permission === permission;
};

export const requestPermissions = () => {
	// Only ask for notification if not denied or granted already
	if (isSupported() && hasPermissions(PERMISSION_DEFAULT)) {
		Notification.requestPermission().then((permission) => {
			if (permission === PERMISSION_GRANTED) {
				sendNotification('Benachrichtigungen aktiviert!');
			}
		});
	}
};

export const sendNotification = (
	title: string,
	opts?: NotificationOptions & ExtraNotificationOptions
): void => {
	// If permissions not granted just ignore the notification because we only asking consultants
	if (
		!isSupported() ||
		!hasPermissions(PERMISSION_GRANTED) ||
		!browserNotificationsSettings().enabled
	) {
		return;
	}

	const options = opts || {};

	// If always is false and window has the focus do not send any notification
	if (!options.showAlways && document.hasFocus()) {
		return;
	}

	const notification = new Notification(title, {
		...options,
		tag: uuidv4(),
		icon: '/logo192.png'
	});

	notification.onshow = () => {
		if (audio) {
			audio.play().then();
		}
		options.onshow && options.onshow(notification);
	};

	notification.onclick = () => {
		options.onclick && options.onclick(notification);
		notification.close();
	};

	notification.onclose = () => {
		options.onclose && options.onclose(notification);
	};
};

export const saveBrowserNotificationsSettings = (settings: {
	enabled?: boolean;
	initialEnquiry?: boolean;
	newMessage?: boolean;
	visited?: boolean;
}) => {
	const currentSettings = browserNotificationsSettings();
	// If is first time setting up the settings, set the default values to true
	if (Object.keys(currentSettings).length === 1) {
		currentSettings.newMessage = true;
		currentSettings.initialEnquiry = true;
	}
	localStorage.setItem(
		'BROWSER_NOTIFICATIONS',
		JSON.stringify({ ...currentSettings, ...settings })
	);
};

export const browserNotificationsSettings = (): {
	enabled: boolean;
	initialEnquiry: boolean;
	newMessage: boolean;
	visited: boolean;
} => {
	return JSON.parse(
		localStorage.getItem('BROWSER_NOTIFICATIONS') || '{ "enabled": false }'
	);
};

export const isBrowserNotificationTypeEnabled = (
	type: 'initialEnquiry' | 'newMessage'
) => {
	return (
		browserNotificationsSettings().enabled &&
		browserNotificationsSettings()[type]
	);
};
