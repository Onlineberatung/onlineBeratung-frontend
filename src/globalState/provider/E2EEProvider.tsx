import * as React from 'react';
import {
	createContext,
	useState,
	useEffect,
	useCallback,
	useContext
} from 'react';
import { getValueFromCookie } from '../../components/sessionCookie/accessSessionCookie';
import { importRSAKey } from '../../utils/encryptionHelpers';
import {
	RocketChatPublicSettingsContext,
	SETTING_E2E_ENABLE
} from './RocketChatPublicSettingsProvider';

interface E2EEContextProps {
	key: string;
	reloadPrivateKey: () => void;
	isE2eeEnabled: boolean;
}

export const E2EEContext = createContext<E2EEContextProps>(null);

export function E2EEProvider(props) {
	const [key, setKey] = useState(null);
	const [isE2eeEnabled, setIsE2eeEnabled] = useState(false);

	const { getSetting } = useContext(RocketChatPublicSettingsContext);

	const reloadPrivateKey = useCallback(() => {
		const privateKey = getValueFromCookie('private_key');
		if (!privateKey) {
			return;
		}
		importRSAKey(JSON.parse(privateKey), ['decrypt']).then(setKey);
	}, []);

	useEffect(() => {
		reloadPrivateKey();
	}, [reloadPrivateKey]);

	useEffect(() => {
		setIsE2eeEnabled(!!getSetting(SETTING_E2E_ENABLE)?.value);
	}, [getSetting]);

	return (
		<E2EEContext.Provider value={{ key, reloadPrivateKey, isE2eeEnabled }}>
			{props.children}
		</E2EEContext.Provider>
	);
}
