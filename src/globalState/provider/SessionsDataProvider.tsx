import * as React from 'react';
import { createContext, Dispatch, useReducer } from 'react';
import { ListItemInterface } from '../interfaces/SessionsDataInterface';
import { getChatItemForSession } from '../../components/session/sessionHelpers';

type SessionsDataContextInterface = {
	sessions: ListItemInterface[];
	ready: boolean;
	dispatch: Dispatch<ActionTypes>;
};

export const SessionsDataContext =
	createContext<SessionsDataContextInterface | null>(null);

const initialState: Omit<SessionsDataContextInterface, 'dispatch'> = {
	ready: false,
	sessions: []
};
export const SET_READY = 'SET_READY';
export const SET_SESSIONS = 'SET_SESSIONS';
export const UPDATE_SESSIONS = 'UPDATE_SESSIONS';
export const REMOVE_SESSIONS = 'REMOVE_SESSIONS';

type SetReadyType = {
	type: typeof SET_READY;
	ready: boolean;
};

type SetSessionsActionType = {
	type: typeof SET_SESSIONS;
	sessions: ListItemInterface[];
	ready?: boolean;
};

type UpdateSessionsActionType = {
	type: typeof UPDATE_SESSIONS;
	sessions: ListItemInterface[];
	ready?: boolean;
};

type RemoveSessionsActionType = {
	type: typeof REMOVE_SESSIONS;
	ids: string[] | number[];
	ready?: boolean;
};

type ActionTypes =
	| SetReadyType
	| SetSessionsActionType
	| UpdateSessionsActionType
	| RemoveSessionsActionType;

function reducer(
	state: Omit<SessionsDataContextInterface, 'dispatch'>,
	action: ActionTypes
) {
	switch (action.type) {
		case SET_READY:
			return {
				ready: action.ready,
				sessions: state.sessions
			};
		case SET_SESSIONS:
			return {
				ready: action.ready ?? state.ready,
				sessions: action.sessions
			};
		case UPDATE_SESSIONS: {
			const { sessions } = action;
			const newSessions = [...state.sessions];
			(sessions ?? []).forEach((s) => {
				const newChatItem = getChatItemForSession(s);
				const index = newSessions.findIndex((s) => {
					const chatItem = getChatItemForSession(s);
					return chatItem.id === newChatItem.id;
				});

				if (index < 0) {
					newSessions.push(s);
				} else {
					newSessions.splice(index, 1, s);
				}
			});

			return {
				ready: action.ready ?? state.ready,
				sessions: newSessions
			};
		}
		case REMOVE_SESSIONS: {
			const { ids } = action;
			const newSessions = [...state.sessions];
			(ids ?? []).forEach((id) => {
				const index = newSessions.findIndex((s) => {
					const chatItem = getChatItemForSession(s);
					return chatItem.id === id || chatItem.groupId === id;
				});

				if (index >= 0) {
					newSessions.splice(index, 1);
				}
			});

			return {
				ready: action.ready ?? state.ready,
				sessions: newSessions
			};
		}
		default:
			throw new Error();
	}
}

export function SessionsDataProvider(props) {
	const [sessionsState, dispatch] = useReducer(reducer, initialState);

	return (
		<SessionsDataContext.Provider
			value={{
				sessions: sessionsState.sessions || [],
				ready: sessionsState.ready,
				dispatch
			}}
		>
			{props.children}
		</SessionsDataContext.Provider>
	);
}
