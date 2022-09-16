import { encode, decode } from 'hi-base32';
import ByteBuffer from 'bytebuffer';
import { apiRocketChatUpdateGroupKey } from '../api/apiRocketChatUpdateGroupKey';
import { apiRocketChatFetchMyKeys } from '../api/apiRocketChatFetchMyKeys';
import { getValueFromCookie } from '../components/sessionCookie/accessSessionCookie';
const StaticArrayBufferProto = ArrayBuffer.prototype;

// encoding helper

export const encodeUsername = (username) => {
	return 'enc.' + encode(username).replace(/=/g, '.');
};

export const decodeUsername = (username: string) => {
	const isEncoded = username.split('.') && username.split('.')[0] === 'enc';
	return isEncoded
		? decode(username.split('.')[1].toUpperCase() + '=')
		: username;
};

// e2ee helper
export function toArrayBuffer(thing: any): ArrayBuffer {
	if (thing === undefined) {
		return undefined;
	}
	if (thing === Object(thing)) {
		if (thing.__proto__ === StaticArrayBufferProto) {
			return thing;
		}
	}

	if (typeof thing !== 'string') {
		throw new Error(
			`Tried to convert a non-string of type ${typeof thing} to an array buffer`
		);
	}

	return ByteBuffer.wrap(thing, 'binary').toArrayBuffer();
}

export function typedArrayToBuffer(array: Uint8Array): ArrayBuffer {
	return array.buffer.slice(
		array.byteOffset,
		array.byteLength + array.byteOffset
	);
}

export const generateRSAKey = async (): Promise<CryptoKeyPair> => {
	return crypto.subtle.generateKey(
		{
			name: 'RSA-OAEP',
			modulusLength: 2048,
			publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
			hash: { name: 'SHA-256' }
		},
		true,
		['encrypt', 'decrypt']
	);
};

export const exportJWKKey = async (key: CryptoKey): Promise<JsonWebKey> => {
	return crypto.subtle.exportKey('jwk', key);
};

export async function importRawKey(
	keyData: BufferSource,
	keyUsages: KeyUsage[] = ['deriveKey']
) {
	return crypto.subtle.importKey(
		'raw',
		keyData,
		{ name: 'PBKDF2' },
		false,
		keyUsages
	);
}

export async function importRawEncryptionKey(keyData: BufferSource) {
	return await crypto.subtle.importKey(
		'raw',
		keyData,
		{ name: 'AES-CBC', length: 256 },
		true,
		['encrypt', 'decrypt']
	);
}

export async function deriveKey(
	salt: BufferSource,
	baseKey: CryptoKey,
	keyUsages: KeyUsage[] = ['encrypt', 'decrypt']
) {
	const iterations = 1000;
	const hash = 'SHA-256';

	return crypto.subtle.deriveKey(
		{ name: 'PBKDF2', salt, iterations, hash },
		baseKey,
		{ name: 'AES-CBC', length: 256 },
		true,
		keyUsages
	);
}

export async function encryptAES(vector, key: CryptoKey, data: BufferSource) {
	return crypto.subtle.encrypt({ name: 'AES-CBC', iv: vector }, key, data);
}

export async function decryptAES(vector, key: CryptoKey, data: BufferSource) {
	return crypto.subtle.decrypt({ name: 'AES-CBC', iv: vector }, key, data);
}

export function toString(
	thing: ByteBuffer | Buffer | ArrayBuffer | Uint8Array | string
): string {
	if (typeof thing === 'string') {
		return thing;
	}
	return ByteBuffer.wrap(thing).toString('binary');
}

export async function importRSAKey(
	keyData: JsonWebKey,
	keyUsages: KeyUsage[] = ['encrypt', 'decrypt']
): Promise<CryptoKey> {
	return crypto.subtle.importKey(
		// @ts-ignore: No overload matches this call.
		'jwk',
		keyData,
		{
			name: 'RSA-OAEP',
			modulusLength: 2048,
			publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
			hash: { name: 'SHA-256' }
		},
		true,
		keyUsages
	);
}

export function joinVectorAndEcryptedData(
	vector: Uint8Array,
	encryptedData: ArrayLike<number> | ArrayBufferLike
): Uint8Array {
	const cipherText = new Uint8Array(encryptedData);
	const output = new Uint8Array(vector.length + cipherText.length);
	output.set(vector, 0);
	output.set(cipherText, vector.length);
	return output;
}

export function splitVectorAndEcryptedData(
	cipherText: Uint8Array
): [Uint8Array, Uint8Array] {
	const vector = cipherText.slice(0, 16);
	const encryptedData = cipherText.slice(16);

	return [vector, encryptedData];
}

// e2ee group helper
export const generateAESKey = async (): Promise<CryptoKey> => {
	return crypto.subtle.generateKey({ name: 'AES-CBC', length: 128 }, true, [
		'encrypt',
		'decrypt'
	]);
};

export async function encryptRSA(key, data) {
	return crypto.subtle.encrypt({ name: 'RSA-OAEP' }, key, data);
}

export async function decryptRSA(key: CryptoKey, data: BufferSource) {
	return crypto.subtle.decrypt({ name: 'RSA-OAEP' }, key, data);
}

export async function importAESKey(
	keyData: JsonWebKey,
	keyUsages: KeyUsage[] = ['encrypt', 'decrypt']
) {
	return crypto.subtle.importKey(
		// @ts-ignore: No overload matches this call.
		'jwk',
		keyData,
		{ name: 'AES-CBC' },
		true,
		keyUsages
	);
}

export class MissingKeyError extends Error {}
export class WrongKeyError extends Error {}
export class EncryptValidationError extends Error {}

/*
Helper Messaging
 */
export const encryptText = async (
	message,
	keyID,
	key,
	encPrefix: string = ''
) => {
	if (!keyID) {
		return message;
	}
	const data = new TextEncoder().encode(message);

	const vector = crypto.getRandomValues(new Uint8Array(16));
	const result = await encryptAES(vector, key, data);

	const encryptedText =
		encPrefix +
		keyID +
		btoa(JSON.stringify(joinVectorAndEcryptedData(vector, result)));

	// Decrypt text after encrypt to check it the result matches
	const decryptedText = await decryptText(
		encryptedText,
		keyID,
		key,
		true,
		true,
		encPrefix
	);
	if (decryptedText !== message) {
		throw new EncryptValidationError('Error validating encrypted text.');
	}

	return encryptedText;
};

export const decryptText = async (
	message,
	roomKeyID,
	groupKey,
	roomEncrypted,
	messageEncrypted,
	encPrefix: string = ''
): Promise<string> => {
	if (
		!roomEncrypted ||
		!messageEncrypted ||
		(encPrefix && message.indexOf(encPrefix) !== 0)
	) {
		return message;
	}

	if (!roomKeyID || !groupKey) {
		throw new MissingKeyError('e2ee.message.encryption');
	}

	const keyID = message.slice(encPrefix.length, 12 + encPrefix.length);
	if (keyID !== roomKeyID) {
		throw new WrongKeyError('e2ee.message.encryption.error');
	}

	const encMessage = message.slice(12 + encPrefix.length);

	try {
		const [vector, cipherText] = splitVectorAndEcryptedData(
			Uint8Array.from(Object.values(JSON.parse(atob(encMessage))))
		);
		const result = await decryptAES(vector, groupKey, cipherText);
		return new TextDecoder('UTF-8').decode(result);
	} catch (error) {
		console.error('Error decrypting message: ', error, encMessage);
		throw error;
	}
};

/*
Temporary KeyPair Helpers
 */
export const getTmpMasterKey = async (uid) => {
	const uidUint8 = new TextEncoder().encode(uid);
	const hashBuffer = await crypto.subtle.digest('SHA-256', uidUint8);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

export const deriveMasterKeyFromPassword = async (rcUserId, password) => {
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

export const encryptForParticipant = (
	public_key,
	keyID,
	sessionKeyExportedString
): Promise<string> =>
	new Promise(async (resolve, reject) => {
		let userKey;
		try {
			userKey = await importRSAKey(JSON.parse(public_key), ['encrypt']);
		} catch (error) {
			console.error('Error importing user key: ', error);
			return reject(error);
		}

		// Encrypt session key for this user with his/her public key
		try {
			const encryptedUserKey = await encryptRSA(
				userKey,
				toArrayBuffer(sessionKeyExportedString)
			);
			// Key has been encrypted. Publish to that user's subscription model for this room.
			resolve(
				keyID + btoa(JSON.stringify(new Uint8Array(encryptedUserKey)))
			);
		} catch (error) {
			console.error('Error encrypting user key: ', error);
			return reject(error);
		}
	});

export type GroupKeyType = {
	key: CryptoKey;
	keyID: string;
	sessionKeyExportedString: string;
};

export const createGroupKey = (): Promise<GroupKeyType> =>
	new Promise(async (resolve, reject) => {
		console.log('Creating room key');
		// Create group key
		let key;
		try {
			key = await generateAESKey();
		} catch (error) {
			console.error('Error generating group key: ', error);
			throw error;
		}

		try {
			const sessionKeyExported = await exportJWKKey(key);
			const sessionKeyExportedString = JSON.stringify(sessionKeyExported);
			const keyID = btoa(sessionKeyExported.k).slice(0, 12);

			resolve({ key, keyID, sessionKeyExportedString });
		} catch (error) {
			console.error('Error exporting group key: ', error);
			throw error;
		}
	});

export const importGroupKey = (
	groupKey,
	e2eePrivateKey
): Promise<GroupKeyType> =>
	new Promise(async (resolve, reject) => {
		// Get existing group key
		// const keyID = groupKey.slice(0, 12);
		groupKey = groupKey.slice(12);
		groupKey = atob(groupKey);
		groupKey = Uint8Array.from(Object.values(JSON.parse(groupKey)));

		// Decrypt obtained encrypted session key
		let sessionKeyExportedString;
		try {
			const decryptedKey = await decryptRSA(e2eePrivateKey, groupKey);
			sessionKeyExportedString = toString(decryptedKey);
		} catch (error) {
			console.error('Error decrypting group key: ', error);
			reject(error);
			return;
		}

		// Import session key for use.
		try {
			const sessionKeyExported = JSON.parse(sessionKeyExportedString);
			const keyID = btoa(sessionKeyExported.k).slice(0, 12);
			const key = await importAESKey(sessionKeyExported);

			// Key has been obtained. E2E is now in session.
			resolve({ key, keyID, sessionKeyExportedString });
		} catch (error) {
			console.error('Error decrypting group key: ', error);
			reject(error);
			return;
		}
	});

export const reEncryptMyRoomKeys = async (
	rooms,
	subscriptions,
	rcUserId,
	oldPrivateKey
) => {
	return Promise.all(
		subscriptions.map(async (subscription) => {
			const room = rooms.find((room) => room._id === subscription.rid);

			if (!room?.e2eKeyId || !subscription?.E2EKey) {
				return null;
			}

			const { sessionKeyExportedString } = await importGroupKey(
				subscription.E2EKey,
				oldPrivateKey
			);

			const userKey = await encryptForParticipant(
				sessionStorage.getItem('public_key'),
				room.e2eKeyId,
				sessionKeyExportedString
			);

			console.log('Update Group Key', rcUserId, room._id, userKey);
			return apiRocketChatUpdateGroupKey(rcUserId, room._id, userKey);
		})
	);
};

export const encryptPrivateKey = async (privateKey, masterKey) => {
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

export const decryptPrivateKey = async (privateKey, masterKey) => {
	try {
		const [vector, cipherText] = splitVectorAndEcryptedData(
			Uint8Array.from(Object.values(JSON.parse(privateKey)))
		);

		return toString(await decryptAES(vector, masterKey, cipherText));
	} catch (error) {
		throw new Error('E2E -> Error decrypting private key: ' + error);
	}
};

export const storeKeys = (private_key, public_key) => {
	sessionStorage.setItem('public_key', public_key);
	sessionStorage.setItem('private_key', private_key);
};

export const createAndStoreKeys = async () => {
	let key;
	let privateKey;
	let publicKey;
	try {
		key = await generateRSAKey();
	} catch (error) {
		throw new Error('Error generating key: ' + error);
	}

	try {
		publicKey = await exportJWKKey(key.publicKey);
		sessionStorage.setItem('public_key', JSON.stringify(publicKey));
	} catch (error) {
		throw new Error('Error exporting public key: ' + error);
	}

	try {
		privateKey = await exportJWKKey(key.privateKey);
		sessionStorage.setItem('private_key', JSON.stringify(privateKey));
	} catch (error) {
		throw new Error('Error exporting private key: ' + error);
	}

	return {
		publicKey: JSON.stringify(publicKey),
		privateKey: JSON.stringify(privateKey)
	};
};

export const writeMasterKeyToLocalStorage = async (
	masterKey: CryptoKey,
	userId: string
) => {
	const currentArrayBuffer = await crypto.subtle.exportKey('raw', masterKey);
	const currentUint8Array = Array.from(new Uint8Array(currentArrayBuffer));
	localStorage.setItem('mk_' + userId, JSON.stringify(currentUint8Array));
};

export const readMasterKeyFromLocalStorage = (userId: string) => {
	const persistedUint8ArrayString = localStorage.getItem('mk_' + userId);
	if (!persistedUint8ArrayString) return null;
	const persistedArray = JSON.parse(persistedUint8ArrayString);
	return typedArrayToBuffer(new Uint8Array(persistedArray));
};

export const loadKeysFromRocketChat = async () => {
	const { private_key: encryptedPrivateKey, public_key: storedPublicKey } =
		await apiRocketChatFetchMyKeys();

	const rcUserId = getValueFromCookie('rc_uid');
	const persistedArrayBuffer = readMasterKeyFromLocalStorage(rcUserId);

	const persistedMasterKey = await importRawEncryptionKey(
		persistedArrayBuffer
	);

	const privateKey = await decryptPrivateKey(
		encryptedPrivateKey,
		persistedMasterKey
	);
	storeKeys(privateKey, storedPublicKey);
};
