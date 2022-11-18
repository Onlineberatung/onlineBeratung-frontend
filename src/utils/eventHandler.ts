export type TEventHandler = <T>(args?: T) => Promise<T>;
export type TEventListener = {
	name: string;
	handler: TEventHandler;
};

const events: TEventListener[] = [];

export const addEventListener = (name: string, handler: TEventHandler) => {
	const eventListenerIndex = events.findIndex(
		(event) => event.name === name && event.handler === handler
	);
	if (eventListenerIndex >= 0) {
		return;
	}

	events.push({
		name,
		handler
	});
};

export const removeEventListener = (name: string, handler: TEventHandler) => {
	const eventListenerIndex = events.findIndex(
		(event) => event.name === name && event.handler === handler
	);
	if (eventListenerIndex < 0) {
		return;
	}
	events.splice(eventListenerIndex, 1);
};

export const getEventListeners = (name: string): TEventListener[] => {
	return events.filter((event) => event.name === name);
};

export const callEventListeners = <T>(name: string, args?: T) => {
	const eventListeners = getEventListeners(name);
	if (eventListeners.length === 0) {
		return args;
	}
	return callEventListener(getEventListeners(name), args);
};

const callEventListener = <T>(listeners: TEventListener[], args?: T) => {
	const listener = listeners.pop();
	return listener
		.handler(args)
		.then((args?: T) =>
			listeners.length === 0 ? args : callEventListener(listeners, args)
		);
};
