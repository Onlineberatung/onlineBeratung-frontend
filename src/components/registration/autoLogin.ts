import { getKeycloakAccessToken } from '../sessionCookie/getKeycloakAccessToken';
import { getRocketchatAccessToken } from '../sessionCookie/getRocketchatAccessToken';
import { setValueInCookie } from '../sessionCookie/accessSessionCookie';
import { config } from '../../resources/scripts/config';
import { generateCsrfToken } from '../../utils/generateCsrfToken';
import {
	decryptAES,
	deriveKey,
	encodeUsername,
	encryptAES,
	exportJWKKey,
	generateRSAKey,
	toString,
	importRawKey,
	importRSAKey,
	joinVectorAndEcryptedData,
	splitVectorAndEcryptedData,
	toArrayBuffer
} from '../../utils/encryptionHelpers';
import { setTokens } from '../auth/auth';
import { FETCH_ERRORS } from '../../api';
import { apiRocketChatFetchMyKeys } from '../../api/apiRocketChatFetchMyKeys';
import { apiRocketChatSetUserKeys } from '../../api/apiRocketChatSetUserKeys';
import { apiRocketChatSubscriptionsGet } from '../../api/apiRocketChatSubscriptionsGet';

export interface LoginData {
	data: {
		authToken?: string;
		userId?: string;
	};
	access_token?: string;
	expires_in?: number;
	refresh_token?: string;
	refresh_expires_in?: number;
}

export const autoLogin = (autoLoginProps: {
	username: string;
	password: string;
	redirect: boolean;
	otp?: string;
	useOldUser?: boolean;
}): Promise<any> =>
	new Promise((resolve, reject) => {
		const userHash = autoLoginProps.useOldUser
			? autoLoginProps.username
			: encodeUsername(autoLoginProps.username);
		getKeycloakAccessToken(
			autoLoginProps.useOldUser ? encodeURIComponent(userHash) : userHash,
			encodeURIComponent(autoLoginProps.password),
			autoLoginProps.otp ? autoLoginProps.otp : null
		)
			.then((response) => {
				setTokens(
					response.access_token,
					response.expires_in,
					response.refresh_token,
					response.refresh_expires_in
				);

				getRocketchatAccessToken(userHash, autoLoginProps.password)
					.then(async (accesTokenResponse) => {
						const data = accesTokenResponse.data;
						if (data.authToken) {
							setValueInCookie('rc_token', data.authToken);
						}
						if (data.userId) {
							setValueInCookie('rc_uid', data.userId);
						}

						//generate new csrf token for current session
						generateCsrfToken(true);

						// e2ee
						await handleE2EESetup(
							autoLoginProps.password,
							data.userId
						);

						if (autoLoginProps.redirect) {
							redirectToApp();
						}

						resolve(undefined);
					})
					.catch((error) => {
						reject(error);
					});
			})
			.catch((error) => {
				if (
					!autoLoginProps.useOldUser &&
					error.message === FETCH_ERRORS.UNAUTHORIZED
				) {
					autoLogin({
						username: autoLoginProps.username,
						password: autoLoginProps.password,
						redirect: autoLoginProps.redirect,
						otp: autoLoginProps.otp,
						useOldUser: true
					})
						.then(() => resolve(undefined))
						.catch((autoLoginError) => reject(autoLoginError));
				} else {
					reject(error);
				}
			});
	});

export const redirectToApp = () => {
	window.location.href = config.urls.redirectToApp;
};

const getMasterKey = async (rcUserId, password) => {
	if (!('TextEncoder' in window))
		alert('Sorry, this browser does not support TextEncoder...');

	if (password == null) {
		throw new Error('Password required');
	}

	// First, create a PBKDF2 "key" containing the password
	let baseKey;
	try {
		baseKey = await importRawKey(toArrayBuffer(password));
	} catch (error) {
		throw new Error(
			'Error creating a key based on user password: ' + error
		);
	}

	// Derive a key from the password
	try {
		return await deriveKey(toArrayBuffer(rcUserId), baseKey);
	} catch (error) {
		throw new Error('Error deriving baseKey: ' + error);
	}
};

const handleE2EESetup = (password, rcUserId): Promise<any> =>
	new Promise(async (resolve, reject) => {
		const masterKey = await getMasterKey(rcUserId, password);

		const { private_key: apiPrivateKey, public_key: publicKey } =
			await apiRocketChatFetchMyKeys();

		let isDefaultPrivateKey = false;
		if (apiPrivateKey && apiPrivateKey.indexOf('temp.') === 0) {
			isDefaultPrivateKey = true;
		}

		if (!apiPrivateKey || isDefaultPrivateKey) {
			const key = await createAndLoadKeys();
			await apiRocketChatSetUserKeys(
				sessionStorage.getItem('public_key'),
				await encodePrivateKey(
					sessionStorage.getItem('private_key'),
					masterKey
				)
			);

			if (isDefaultPrivateKey) {
				// ToDo: Send request to backend to reencrypt all my room keys with new public key from RC
			}
		} else {
			try {
				const privateKey = await decodePrivateKey(
					apiPrivateKey,
					masterKey
				);
				const key = await loadKeys(privateKey, publicKey);
			} catch (error) {
				throw new Error(
					"Wasn't possible to decode your encryption key to be imported."
				);
			}
		}

		resolve(undefined);
	});

const encodePrivateKey = async (privateKey, masterKey) => {
	const vector = crypto.getRandomValues(new Uint8Array(16));
	try {
		const encodedPrivateKey = await encryptAES(
			vector,
			masterKey,
			toArrayBuffer(privateKey)
		);

		return JSON.stringify(
			joinVectorAndEcryptedData(vector, encodedPrivateKey)
		);
	} catch (error) {
		throw new Error('Error encrypting encodedPrivateKey: ' + error);
	}
};

const decodePrivateKey = async (privateKey, masterKey) => {
	const [vector, cipherText] = splitVectorAndEcryptedData(
		Uint8Array.from(Object.values(JSON.parse(privateKey)))
	);

	try {
		return toString(await decryptAES(vector, masterKey, cipherText));
	} catch (error) {
		throw new Error('E2E -> Error decrypting private key');
	}
};

const loadKeys = async (private_key, public_key) => {
	sessionStorage.setItem('public_key', public_key);
	try {
		const key = await importRSAKey(JSON.parse(private_key), ['decrypt']);
		sessionStorage.setItem('private_key', private_key);
		return key;
	} catch (error) {
		throw new Error('Error importing private key: ' + error);
	}
};

const createAndLoadKeys = async () => {
	let key;
	try {
		key = await generateRSAKey();
	} catch (error) {
		throw new Error('Error generating key: ' + error);
	}

	try {
		const publicKey = await exportJWKKey(key.publicKey);
		sessionStorage.setItem('public_key', JSON.stringify(publicKey));
	} catch (error) {
		throw new Error('Error exporting public key: ' + error);
	}

	try {
		const privateKey = await exportJWKKey(key.privateKey);
		sessionStorage.setItem('private_key', JSON.stringify(privateKey));
	} catch (error) {
		throw new Error('Error exporting private key: ' + error);
	}

	return key;
};
