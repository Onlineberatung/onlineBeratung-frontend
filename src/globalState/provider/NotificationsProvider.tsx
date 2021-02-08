import * as React from 'react';
import { createContext, useState } from 'react';
import { IncomingVideoCallProps } from '../../components/incomingVideoCall/IncomingVideoCall';

export let notifications: IncomingVideoCallProps[];

export const NotificationsContext = createContext<
	IncomingVideoCallProps[] | any
>(null);

export function NotificationsProvider(props) {
	const [notifications, setNotifications] = useState([]);

	return (
		<NotificationsContext.Provider
			value={{ notifications, setNotifications }}
		>
			{props.children}
		</NotificationsContext.Provider>
	);
}
