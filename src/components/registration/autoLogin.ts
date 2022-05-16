import CryptoJS from 'crypto-js';
import { getKeycloakAccessToken } from '../sessionCookie/getKeycloakAccessToken';
import { getRocketchatAccessToken } from '../sessionCookie/getRocketchatAccessToken';
import { setValueInCookie } from '../sessionCookie/accessSessionCookie';
import { config } from '../../resources/scripts/config';
import { generateCsrfToken } from '../../utils/generateCsrfToken';
import {
	decryptAES,
	encodeUsername,
	encryptAES,
	exportJWKKey,
	generateRSAKey,
	toString,
	importRSAKey,
	joinVectorAndEcryptedData,
	splitVectorAndEcryptedData,
	toArrayBuffer,
	getMasterKey,
	getTmpMasterKey,
	encryptForParticipant
} from '../../utils/encryptionHelpers';
import { setTokens } from '../auth/auth';
import { FETCH_ERRORS } from '../../api';
import { apiRocketChatFetchMyKeys } from '../../api/apiRocketChatFetchMyKeys';
import { apiRocketChatSetUserKeys } from '../../api/apiRocketChatSetUserKeys';
import { apiRocketChatSubscriptionsGet } from '../../api/apiRocketChatSubscriptionsGet';
import { apiRocketChatRoomsGet } from '../../api/apiRocketChatRoomsGet';
import { apiRocketChatUpdateGroupKey } from '../../api/apiRocketChatUpdateGroupKey';

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

const handleE2EESetup = (password, rcUserId): Promise<any> =>
	new Promise(async (resolve, reject) => {
		const masterKey = await getMasterKey(rcUserId, password);

		const { private_key: apiPrivateKey, public_key: publicKey } =
			await apiRocketChatFetchMyKeys();

		if (!apiPrivateKey) {
			const key = await createAndLoadKeys();
			await apiRocketChatSetUserKeys(
				sessionStorage.getItem('public_key'),
				await encodePrivateKey(
					sessionStorage.getItem('private_key'),
					masterKey
				)
			);

			// Reencrypt existing tmp keys with new generated public_key
			// ToDo: Send request to backend to reencrypt all my room keys with new public key from RC
			const { update: subscriptions } =
				await apiRocketChatSubscriptionsGet();
			const { update: rooms } = await apiRocketChatRoomsGet();
			await Promise.all(
				subscriptions.map(async (subscription) => {
					const room = rooms.find(
						(room) => room._id === subscription.rid
					);

					if (
						!room?.e2eKeyId ||
						!subscription?.E2EKey ||
						subscription.E2EKey.indexOf('tmp.') !== 0
					) {
						return null;
					}

					const roomKeyEncrypted = subscription.E2EKey.substring(16);
					const bytes = CryptoJS.AES.decrypt(
						roomKeyEncrypted,
						await getTmpMasterKey(rcUserId)
					);
					const roomKey = bytes.toString(CryptoJS.enc.Utf8);

					return encryptForParticipant(
						sessionStorage.getItem('public_key'),
						room.e2eKeyId,
						roomKey
					).then((userKey) => {
						console.log(
							'Update Group Key',
							rcUserId,
							room._id,
							userKey
						);
						return apiRocketChatUpdateGroupKey(
							rcUserId,
							room._id,
							userKey
						).then((res) => {
							console.log(
								'User Room Key updated for user ',
								rcUserId
							);
						});
					});
				})
			);
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
