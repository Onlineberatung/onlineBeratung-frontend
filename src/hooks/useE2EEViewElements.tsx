import { useCallback, useEffect, useMemo, useState } from 'react';
import { OverlayItem } from '../components/overlay/Overlay';
import { ReactComponent as WaitingIcon } from '../resources/img/illustrations/waiting.svg';
import { ProgressBar } from '../components/progressbar/ProgressBar';
import * as React from 'react';
import {
	ENCRYPT_ROOM_STATE_DONE,
	ENCRYPT_ROOM_STATE_ENCRYPTING_USERS,
	ENCRYPT_ROOM_STATE_ERROR,
	ENCRYPT_ROOM_STATE_GET_MEMBERS,
	ENCRYPT_ROOM_STATE_GET_USERS_WITHOUT_KEY,
	ENCRYPT_ROOM_STATE_SEND_ALIAS_MESSAGE,
	ENCRYPT_ROOM_STATE_SET_ROOM_KEY,
	TEncryptRoomState
} from './useE2EE';
import { useTranslation } from 'react-i18next';

export const useE2EEViewElements = () => {
	const { t: translate } = useTranslation();

	const [state, setState] = useState<TEncryptRoomState>(null);
	const [visible, setVisible] = useState(false);

	const getProgress = useCallback((encryptRoomState: TEncryptRoomState) => {
		switch (encryptRoomState.state) {
			case ENCRYPT_ROOM_STATE_GET_MEMBERS:
				return { total: 100, count: 0, finish: false };
			case ENCRYPT_ROOM_STATE_GET_USERS_WITHOUT_KEY:
				return { total: 100, count: 1, finish: false };
			case ENCRYPT_ROOM_STATE_ENCRYPTING_USERS:
				return {
					total: encryptRoomState.total + 5,
					count: encryptRoomState.count + 2,
					finish: false
				};
			case ENCRYPT_ROOM_STATE_SET_ROOM_KEY:
				return {
					total: encryptRoomState.total + 5,
					count: encryptRoomState.count + 3,
					finish: false
				};
			case ENCRYPT_ROOM_STATE_SEND_ALIAS_MESSAGE:
				return {
					total: encryptRoomState.total + 5,
					count: encryptRoomState.count + 4,
					finish: false
				};
			case ENCRYPT_ROOM_STATE_DONE:
			case ENCRYPT_ROOM_STATE_ERROR:
			default:
				return {
					total: encryptRoomState.total + 5,
					count: encryptRoomState.count + 5,
					finish: true
				};
		}
	}, []);

	const overlay: OverlayItem = useMemo(
		() => ({
			svg: WaitingIcon,
			headline: translate('e2ee.inProgress.headline'),
			copy: translate('e2ee.inProgress.copy'),
			nestedComponent: state ? (
				<div>
					<ProgressBar
						finish={getProgress(state).finish}
						max={getProgress(state).total}
						current={getProgress(state).count}
					/>
				</div>
			) : null
		}),
		[translate, state, getProgress]
	);

	useEffect(() => {
		if (!visible) {
			return () => {};
		}
		const unloadHandler = (e) => {
			e.returnValue = translate('e2ee.inProgress.confirm');
		};

		window.addEventListener('beforeunload', unloadHandler);
		return () => {
			window.removeEventListener('beforeunload', unloadHandler);
		};
	}, [translate, visible]);

	useEffect(() => {
		if (
			!state ||
			state.state === ENCRYPT_ROOM_STATE_DONE ||
			state.state === ENCRYPT_ROOM_STATE_ERROR
		) {
			setVisible(false);
			return;
		}

		setVisible(true);
	}, [state]);

	return {
		overlay,
		visible,
		setState
	};
};
