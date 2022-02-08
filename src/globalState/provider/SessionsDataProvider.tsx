import * as React from 'react';
import { createContext, Dispatch, useReducer } from 'react';
import update from 'immutability-helper';
import {
	GroupChatItemInterface,
	SessionDataKeys,
	SessionsDataInterface
} from '../interfaces/SessionsDataInterface';
import { CHAT_TYPES } from '../../components/session/sessionHelpers';
import { ActiveSessionType } from '../helpers/stateHelpers';

type SessionsDataContextInterface = {
	sessionsData: SessionsDataInterface;
	setSessionsData: Function;
	dispatchSessionsData: Dispatch<ActionTypes>;
};

export const SessionsDataContext =
	createContext<SessionsDataContextInterface | null>(null);

const initialState: SessionsDataInterface = null;
export const SET_SESSIONS = 'SET_SESSIONS';
export const UPDATE_SESSION = 'UPDATE_SESSION';
export const UPDATE_SESSION_CHAT_ITEM = 'UPDATE_SESSION_CHAT_ITEM';

type SetSessionsActionType = {
	type: typeof SET_SESSIONS;
	data: SessionsDataInterface;
};

type UpdateSessionType = {
	type: typeof UPDATE_SESSION;
	key: SessionDataKeys;
	data: Partial<ActiveSessionType>;
};

type UpdateSessionChatItem = {
	type: typeof UPDATE_SESSION_CHAT_ITEM;
	data: Partial<SessionsDataInterface | GroupChatItemInterface>;
	key: SessionDataKeys;
	groupId?: string;
};

type ActionTypes =
	| SetSessionsActionType
	| UpdateSessionType
	| UpdateSessionChatItem;

function reducer(state: SessionsDataInterface, action: ActionTypes) {
	switch (action.type) {
		case SET_SESSIONS:
			return action.data;
		case UPDATE_SESSION: {
			const { key, data } = action;

			return update(state, {
				[key]: {
					$merge: {
						...data
					}
				}
			});
		}
		case UPDATE_SESSION_CHAT_ITEM: {
			const { key, groupId, data } = action;

			for (const index in state[key]) {
				for (const chatType of CHAT_TYPES) {
					if (state[key][index][chatType]?.groupId === groupId) {
						return update(state, {
							[key]: {
								[index]: {
									[chatType]: {
										$merge: {
											...data
										}
									}
								}
							}
						});
					}
				}
			}

			return state;
		}
		default:
			throw new Error();
	}
}

export function SessionsDataProvider(props) {
	const [sessionsData, dispatchSessionsData] = useReducer(
		reducer,
		initialState
	);

	const setSessionsData = (data) => {
		dispatchSessionsData({ type: SET_SESSIONS, data: data });
	};

	return (
		<SessionsDataContext.Provider
			value={{ sessionsData, setSessionsData, dispatchSessionsData }}
		>
			{props.children}
		</SessionsDataContext.Provider>
	);
}
