import CryptoJS from 'crypto-js';

import { getKeycloakAccessToken } from '../sessionCookie/getKeycloakAccessToken';
import { getRocketchatAccessToken } from '../sessionCookie/getRocketchatAccessToken';
import { setValueInCookie } from '../sessionCookie/accessSessionCookie';
import { config } from '../../resources/scripts/config';
import { generateCsrfToken } from '../../utils/generateCsrfToken';
import {
	createAndStoreKeys,
	decryptPrivateKey,
	deriveMasterKeyFromPassword,
	encodeUsername,
	encryptForParticipant,
	encryptPrivateKey,
	getTmpMasterKey,
	importRawEncryptionKey,
	storeKeys,
	readMasterKeyFromLocalStorage,
	writeMasterKeyToLocalStorage
} from '../../utils/encryptionHelpers';
import { setTokens } from '../auth/auth';
import { apiUpdateUserE2EKeys, FETCH_ERRORS } from '../../api';
import { apiRocketChatFetchMyKeys } from '../../api/apiRocketChatFetchMyKeys';
import { apiRocketChatSetUserKeys } from '../../api/apiRocketChatSetUserKeys';
import { apiRocketChatSubscriptionsGet } from '../../api/apiRocketChatSubscriptionsGet';
import { apiRocketChatRoomsGet } from '../../api/apiRocketChatRoomsGet';
import { apiRocketChatUpdateGroupKey } from '../../api/apiRocketChatUpdateGroupKey';
import { apiRocketChatResetE2EKey } from '../../api/apiRocketChatResetE2EKey';
import { getBudibaseAccessToken } from '../sessionCookie/getBudibaseAccessToken';

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

interface AutoLoginProps {
	username: string;
	password: string;
	redirect: boolean;
	otp?: string;
	useOldUser?: boolean;
}

export const autoLogin = (autoLoginProps: AutoLoginProps): Promise<any> =>
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
							data.userId,
							autoLoginProps
						);

						if (autoLoginProps.redirect) {
							redirectToApp();
						}

						resolve(undefined);
					})
					.catch((error) => {
						reject(error);
					});

				if (config.budibaseSSO) {
					getBudibaseAccessToken(
						autoLoginProps.username,
						autoLoginProps.password
					);
				}
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

export const handleE2EESetup = (
	password: string,
	rcUserId: string,
	autoLoginProps?: AutoLoginProps
): Promise<any> => {
	return new Promise(async (resolve, reject) => {
		let masterKey = await deriveMasterKeyFromPassword(rcUserId, password);

		let privateKey;
		let publicKey;

		// get key pair from rc
		const {
			private_key: encryptedPrivateKey,
			public_key: storedPublicKey
		} = await apiRocketChatFetchMyKeys();

		// use stored public key if available
		if (storedPublicKey) publicKey = storedPublicKey;

		// try to decrypt the private key
		if (encryptedPrivateKey) {
			try {
				privateKey = await decryptPrivateKey(
					encryptedPrivateKey,
					masterKey
				);
				storeKeys(privateKey, publicKey);
				await writeMasterKeyToLocalStorage(masterKey, rcUserId);
			} catch (error) {
				const persistedArrayBuffer =
					readMasterKeyFromLocalStorage(rcUserId);

				if (!persistedArrayBuffer) {
					console.error('master key not persisted - reset e2e key');
					await apiRocketChatResetE2EKey();
					if (!autoLoginProps) {
						console.error('could not re-login after e2e key reset');
					} else {
						await writeMasterKeyToLocalStorage(masterKey, rcUserId);
						await autoLogin(autoLoginProps);
						return;
					}
				} else {
					const persistedMasterKey = await importRawEncryptionKey(
						persistedArrayBuffer
					);

					privateKey = await decryptPrivateKey(
						encryptedPrivateKey,
						persistedMasterKey
					);
					storeKeys(privateKey, publicKey);

					try {
						await apiRocketChatSetUserKeys(
							publicKey,
							await encryptPrivateKey(privateKey, masterKey)
						);

						await writeMasterKeyToLocalStorage(masterKey, rcUserId);
					} catch {
						console.error('Error saving keys in rocket chat.');
					}
				}
			}
		}

		// no key pair
		if (!encryptedPrivateKey) {
			// create a new key pair
			const { publicKey: pub, privateKey: priv } =
				await createAndStoreKeys();
			publicKey = pub;
			privateKey = priv;
			// store with rocket chat and in session
			try {
				await apiRocketChatSetUserKeys(
					publicKey,
					await encryptPrivateKey(privateKey, masterKey)
				);
			} catch {
				console.error('Error saving keys in rocket chat.');
			}
		}

		// update all existing subscriptions via backend logic
		try {
			// BE call
			const keyString = JSON.parse(publicKey).n;
			await apiUpdateUserE2EKeys(keyString);
		} catch (e) {
			console.log('Update E2E Keys in BE failed, trying FE');
			// FE Fallback
			await updateUserE2EKeysFallback(rcUserId);
		}

		resolve(undefined);
	});
};

const updateUserE2EKeysFallback = async (rcUserId) => {
	const { update: subscriptions } = await apiRocketChatSubscriptionsGet();
	const { update: rooms } = await apiRocketChatRoomsGet();
	await Promise.all(
		subscriptions.map(async (subscription) => {
			const room = rooms.find((r) => r._id === subscription.rid);

			if (
				!room?.e2eKeyId ||
				!subscription?.E2EKey ||
				subscription.E2EKey.indexOf('tmp.') !== 0
			) {
				return null;
			}

			// Substring(16) because of 'tmp.' prefix
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
				return apiRocketChatUpdateGroupKey(rcUserId, room._id, userKey);
			});
		})
	);
};
