import * as React from 'react';
import { createContext, useState, useEffect, useCallback } from 'react';
import { importRSAKey } from '../../utils/encryptionHelpers';

interface E2EEContextProps {
	key: string;
	reloadPrivateKey: () => void;
	e2EEReady: boolean;
}

export const E2EEContext = createContext<E2EEContextProps>(null);

export function E2EEProvider(props) {
	const [key, setKey] = useState(null);

	const [e2EEReady, setE2EEReady] = useState(false);

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
		setE2EEReady(true);
	}, []);

	return (
		<E2EEContext.Provider value={{ key, reloadPrivateKey, e2EEReady }}>
			{props.children}
		</E2EEContext.Provider>
	);
}
