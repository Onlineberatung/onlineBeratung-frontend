import * as React from 'react';
import { createContext, useState, useContext } from 'react';

export const E2EEContext = createContext<{
	privateKey: string;
	setPrivateKey(privateKey: string): void;
	publickKey: string;
	setPublickKey(publickKey: string): void;
	masterKey: string;
	setMasterKey(masterKey: string): void;
}>(null);

export function E2EEProvider(props) {
	const [privateKey, setPrivateKey] = useState<string>();
	const [publickKey, setPublickKey] = useState<string>();
	const [masterKey, setMasterKey] = useState<string>();

	return (
		<E2EEContext.Provider
			value={{
				privateKey,
				setPrivateKey,
				publickKey,
				setPublickKey,
				masterKey,
				setMasterKey
			}}
		>
			{props.children}
		</E2EEContext.Provider>
	);
}

export function useE2EECredentials() {
	const { publickKey, privateKey, masterKey } = useContext(E2EEContext);
	return { publickKey, privateKey, masterKey };
}
