import * as React from 'react';
import {
	createContext,
	useState,
	useEffect,
	useCallback,
	useContext
} from 'react';
import { importRSAKey } from '../../utils/encryptionHelpers';
import { RocketChatPublicSettingsContext } from './RocketChatPublicSettingsProvider';
import { SETTING_E2E_ENABLE } from '../../api/apiRocketChatSettingsPublic';

interface E2EEContextProps {
	key: string;
	reloadPrivateKey: () => void;
	isE2eeEnabled: boolean;
	e2EEReady: boolean;
}

export const E2EEContext = createContext<E2EEContextProps>(null);
export const STORAGE_KEY_E2EE_DISABLED = 'e2ee_disabled';

export function E2EEProvider(props) {
	const [key, setKey] = useState(null);
	const [isE2eeEnabled, setIsE2eeEnabled] = useState(false);

	const [e2EEReady, setE2EEReady] = useState(false);
	const { settingsReady, getSetting } = useContext(
		RocketChatPublicSettingsContext
	);

	const reloadPrivateKey = useCallback(() => {
		const privateKey = sessionStorage.getItem('private_key');
		if (!privateKey) {
			return;
		}
		importRSAKey(JSON.parse(privateKey), ['decrypt']).then(setKey);
	}, []);

	useEffect(() => {
		reloadPrivateKey();
	}, [reloadPrivateKey]);

	useEffect(() => {
		if (!settingsReady) {
			return;
		}

		// For testing perpose -> should be moved to dev toolbar
		const e2eeDisabled = parseInt(
			localStorage.getItem(STORAGE_KEY_E2EE_DISABLED) || '0'
		);

		setIsE2eeEnabled(
			e2eeDisabled === 1 ? false : !!getSetting(SETTING_E2E_ENABLE)?.value
		);
		setE2EEReady(true);
	}, [getSetting, settingsReady]);

	return (
		<E2EEContext.Provider
			value={{ key, reloadPrivateKey, isE2eeEnabled, e2EEReady }}
		>
			{props.children}
		</E2EEContext.Provider>
	);
}
