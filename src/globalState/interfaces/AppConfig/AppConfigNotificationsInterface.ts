export interface AppConfigNotificationsInterface {
	notifications: NotificationInterface[];
}

interface NotificationInterface {
	label: string;
	types: string[];
}
