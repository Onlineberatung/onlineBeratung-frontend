import CryptoJS from 'crypto-js';

import { getKeycloakAccessToken } from '../sessionCookie/getKeycloakAccessToken';
import { getRocketchatAccessToken } from '../sessionCookie/getRocketchatAccessToken';
import { setValueInCookie } from '../sessionCookie/accessSessionCookie';
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
import {
	TenantDataInterface,
	TenantDataSettingsInterface
} from '../../globalState/interfaces';
import { appConfig } from '../../utils/appConfig';
import { parseJwt } from '../../utils/parseJWT';
import { removeRocketChatMasterKeyFromLocalStorage } from '../sessionCookie/accessSessionLocalStorage';

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
	otp?: string;
	useOldUser?: boolean;
	tenantData?: TenantDataInterface;
}

const loginKeycloak = async (
	username: string,
	password: string,
	otp?: string
) => {
	const keycloakRes = await getKeycloakAccessToken(
		username,
		encodeURIComponent(password),
		otp || null
	);

	setTokens(
		keycloakRes.access_token,
		keycloakRes.expires_in,
		keycloakRes.refresh_token,
		keycloakRes.refresh_expires_in
	);

	return keycloakRes;
};

const loginRocketChat = async (userHash: string, password: string) => {
	const { data } = await getRocketchatAccessToken(userHash, password);

	if (data.authToken) {
		setValueInCookie('rc_token', data.authToken);
	}
	if (data.userId) {
		setValueInCookie('rc_uid', data.userId);
	}

	//generate new csrf token for current session
	generateCsrfToken(true);

	// e2ee
	await handleE2EESetup(password, data.userId, () =>
		loginRocketChat(userHash, password)
	);
};

export const autoLogin = async ({
	password,
	...autoLoginProps
}: AutoLoginProps): Promise<any> => {
	const tenantSettings = (autoLoginProps?.tenantData?.settings ||
		{}) as TenantDataSettingsInterface;

	let userHash = encodeUsername(autoLoginProps.username);
	let username = userHash;
	let keycloakRes;

	// Login with enc username and fallback to unencrypted username
	try {
		keycloakRes = await loginKeycloak(
			username,
			password,
			autoLoginProps.otp
		);
	} catch (e: any) {
		if (e.message === FETCH_ERRORS.UNAUTHORIZED) {
			userHash = autoLoginProps.username;
			username = encodeURIComponent(userHash);
			keycloakRes = await loginKeycloak(
				username,
				password,
				autoLoginProps.otp
			);
		} else {
			throw e;
		}
	}

	if (
		appConfig.useTenantService &&
		!appConfig.multitenancyWithSingleDomainEnabled
	) {
		const { tenantId } = parseJwt(keycloakRes.access_token);
		if (tenantId !== autoLoginProps.tenantData.id) {
			throw new Error(FETCH_ERRORS.UNAUTHORIZED);
		}
	}

	await loginRocketChat(userHash, password);

	if (tenantSettings?.featureToolsEnabled) {
		await getBudibaseAccessToken(username, password, tenantSettings);
	}
};

export const redirectToApp = (gcid?: string) => {
	const params = gcid ? `?gcid=${gcid}` : '';
	window.location.href = appConfig.urls.redirectToApp + params;
};

export const handleE2EESetup = (
	password: string,
	rcUserId: string,
	reloginCallback?: () => Promise<any>,
	skipUpdateSubscriptions?: boolean
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
					if (!reloginCallback) {
						console.error('could not re-login after e2e key reset');
					} else {
						await writeMasterKeyToLocalStorage(masterKey, rcUserId);
						await reloginCallback().then(resolve).catch(reject);
						return;
					}
				} else {
					const persistedMasterKey =
						await importRawEncryptionKey(persistedArrayBuffer);

					privateKey = await decryptPrivateKey(
						encryptedPrivateKey,
						persistedMasterKey
					).catch(() => {
						// if decryption fails, remove master key from local storage and try again
						removeRocketChatMasterKeyFromLocalStorage();
						return handleE2EESetup(
							password,
							rcUserId,
							reloginCallback,
							skipUpdateSubscriptions
						);
					});
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
		if (!skipUpdateSubscriptions) {
			try {
				// BE call
				const keyString = JSON.parse(publicKey).n;
				await apiUpdateUserE2EKeys(keyString);
			} catch (e) {
				console.log('Update E2E Keys in BE failed, trying FE');
				// FE Fallback
				await updateUserE2EKeysFallback(rcUserId);
			}
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

			// Little fix for broken dev chats
			let sub = 16;
			if (subscription.E2EKey.substring(4, 8) === 'null') {
				sub = 8;
			}

			// Substring(16) because of 'tmp.' prefix
			const roomKeyEncrypted = subscription.E2EKey.substring(sub);
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
