import CryptoJS from 'crypto-js';

import { getKeycloakAccessToken } from '../sessionCookie/getKeycloakAccessToken';
import { getRocketchatAccessToken } from '../sessionCookie/getRocketchatAccessToken';
import { setValueInCookie } from '../sessionCookie/accessSessionCookie';
import { config } from '../../resources/scripts/config';
import { generateCsrfToken } from '../../utils/generateCsrfToken';
import {
	createAndLoadKeys,
	decryptPrivateKey,
	deriveMasterKeyFromPassword,
	encodeUsername,
	encryptForParticipant,
	encryptPrivateKey,
	getTmpMasterKey,
	loadKeys
} from '../../utils/encryptionHelpers';
import { setTokens } from '../auth/auth';
import { apiUpdateUserE2EKeys, FETCH_ERRORS } from '../../api';
import { apiRocketChatFetchMyKeys } from '../../api/apiRocketChatFetchMyKeys';
import { apiRocketChatSetUserKeys } from '../../api/apiRocketChatSetUserKeys';
import { apiRocketChatSubscriptionsGet } from '../../api/apiRocketChatSubscriptionsGet';
import { apiRocketChatRoomsGet } from '../../api/apiRocketChatRoomsGet';
import { apiRocketChatUpdateGroupKey } from '../../api/apiRocketChatUpdateGroupKey';
import * as localforage from 'localforage';

localforage.config({
	driver: localforage.INDEXEDDB, // Force WebSQL; same as using setDriver()
	name: 'OBI',
	version: 1.0,
	size: 4980736, // Size of database, in bytes. WebSQL-only for now.
	storeName: 'keyvaluepairs', // Should be alphanumeric, with underscores.
	description: 'some description'
});

const store = localforage.createInstance({
	name: 'db'
});

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

const handleE2EESetup = (password: string, rcUserId: string): Promise<any> => {
	return new Promise(async (resolve, reject) => {
		let masterKey = await deriveMasterKeyFromPassword(rcUserId, password);
		const currentArrayBuffer = await crypto.subtle.exportKey(
			'raw',
			masterKey
		);
		// masterKey = await importRawKey(currentArrayBuffer); // don't get it.. why does this not work?
		const currentUint8Array = new Uint8Array(currentArrayBuffer);
		const persistedUint8Array = await store.getItem<Uint8Array>(
			'mk_' + rcUserId
		);

		if (!persistedUint8Array) {
			// first login
		} else if (!uint8ArrayEqual(currentUint8Array, persistedUint8Array)) {
			console.log('password has changed');
			// TODO rocketchat encrypt/decrypt
		} else {
			console.log('password *not* has changed, continue');
		}

		// write current exported master key
		await store.setItem('mk_' + rcUserId, currentUint8Array);

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
				await loadKeys(privateKey, publicKey);
			} catch (error) {
				throw new Error(
					"Wasn't possible to decrypt your encryption key to be imported."
				);
			}
		}

		// no key pair
		if (!encryptedPrivateKey) {
			// create a new key pair
			const { publicKey: pub, privateKey: priv } =
				await createAndLoadKeys();
			publicKey = pub;
			privateKey = priv;
			// store with rocket chat and in session
			try {
				await apiRocketChatSetUserKeys(
					publicKey,
					await encryptPrivateKey(privateKey, masterKey)
				);
			} catch {
				console.log('Error saving keys in rocket chat.');
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
			updateUserE2EKeysFallback(rcUserId);
		}

		resolve(undefined);
	});
};

const uint8ArrayEqual = (a: Uint8Array, b: Uint8Array) => {
	if (a === b) return true;
	if (a.length !== b.length) return false;
	var i = a.length;
	while (i--) {
		if (a[i] !== b[i]) return false;
	}

	return true;
};

const typedArrayToBuffer = (array: Uint8Array): ArrayBuffer =>
	array.buffer.slice(array.byteOffset, array.byteLength + array.byteOffset);

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
				console.log('Update Group Key', rcUserId, room._id, userKey);
				return apiRocketChatUpdateGroupKey(
					rcUserId,
					room._id,
					userKey
				).then((res) => {
					console.log('User Room Key updated for user ', rcUserId);
				});
			});
		})
	);
};

// const keyString = new TextDecoder().decode(
// 	new Uint8Array(currentArrayBuffer)
// );
// const currentExportedKeyBase64 = btoa(encodeURI(keyString));
//
// console.log('currentExportedKeyBase64', currentExportedKeyBase64);

// const currentExportedKeyBase64 = btoa(
// 	String.fromCharCode(...new Uint8Array(currentExportedKey))
// );
// const persistedExportedKeyBase64 = localStorage.getItem(
// 	'mk_' + rcUserId
// );
// const persistedExportedKey = persistedExportedKeyBase64
// 	? (JSON.parse(atob(persistedExportedKeyBase64)) as ArrayBuffer)
// 	: null;

// console.log(
// 	'persistedExportedKeyBase64',
// 	atob(persistedExportedKeyBase64)
// );

// const persistedExportedKey = new TextEncoder().encode(
// 	decodeURI(atob(persistedExportedKeyBase64))
// );
//
// var buffer = new ArrayBuffer(
// 	persistedExportedKey.byteLength - persistedExportedKey.byteOffset
// );
// persistedExportedKey.forEach((value, index) => {
// 	buffer[index] = value;
// });
//
// console.log(new Uint8Array(currentArrayBuffer), persistedExportedKey);
