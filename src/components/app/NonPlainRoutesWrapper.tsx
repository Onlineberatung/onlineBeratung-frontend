import React, { useContext, useEffect } from 'react';
import { E2EEContext } from '../../globalState';
import { loadKeysFromRocketChat } from '../../utils/encryptionHelpers';

interface NonPlainRoutesWrapperProps {
	logoutHandler?: Function;
}

export const NonPlainRoutesWrapper: React.FC<NonPlainRoutesWrapperProps> = ({
	children,
	logoutHandler
}) => {
	const { reloadPrivateKey } = useContext(E2EEContext);

	useEffect(() => {
		const tryToLoadKeys = async () => {
			if (
				sessionStorage.getItem('public_key') &&
				sessionStorage.getItem('private_key')
			)
				return;

			try {
				await loadKeysFromRocketChat();
				reloadPrivateKey();
			} catch {
				logoutHandler();
			}
		};
		tryToLoadKeys();
	}, [reloadPrivateKey, logoutHandler]);

	return <>{children}</>;
};
