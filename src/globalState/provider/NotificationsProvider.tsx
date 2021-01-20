import * as React from 'react';
import { createContext, useState } from 'react';
import { IncomingCallProps } from '../../components/incomingCall/IncomingCall';

export let notifications: IncomingCallProps[];

export const NotificationsContext = createContext<IncomingCallProps[] | any>(
	null
);

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
