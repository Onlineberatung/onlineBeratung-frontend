import { decode, encode } from 'hi-base32';
import ByteBuffer from 'bytebuffer';
import { apiRocketChatFetchMyKeys } from '../api/apiRocketChatFetchMyKeys';
import { getValueFromCookie } from '../components/sessionCookie/accessSessionCookie';

const StaticArrayBufferProto = ArrayBuffer.prototype;

// encoding helper
const ENCRYPTION_VERSION_1 = 'v1-0';
const ENCRYPTION_VERSION_2 = 'v2-0';

export const ENCRYPTION_VERSION_ACTIVE = ENCRYPTION_VERSION_2;
export const VERSION_SEPERATOR = '..';
export const VECTOR_LENGTH = 16;
export const KEY_ID_LENGTH = 12;
export const MAX_PREFIX_LENGTH = 10;

// Size in bytes for apache tika file type detection.
// ATTENTION! The bigger this value is, the bigger the attached signature is. For files uploaded smaller than this size the whole file is
// attached unencrypted in the signature!
export const SIGNATURE_LENGTH = 64;

export const encodeUsername = (username) => {
	return 'enc.' + encode(username).replace(/=/g, '.');
};

export const decodeUsername = (username: string = '') => {
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

	try {
		return ByteBuffer.wrap(thing, 'binary').toArrayBuffer();
	} catch {
		return ByteBuffer.wrap(
			new TextEncoder().encode(thing),
			'binary'
		).toArrayBuffer();
	}
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

export function toHexString(bytes: Uint8Array): string {
	return bytes.reduce(
		(str, byte) => str + byte.toString(16).padStart(2, '0'),
		''
	);
}

export function fromHexString(hexString: string): Uint8Array {
	return Uint8Array.from(
		hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
	);
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
	const vector = cipherText.slice(0, VECTOR_LENGTH);
	const encryptedData = cipherText.slice(VECTOR_LENGTH);

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
export class EncPrefixLengthError extends Error {}

export const encryptBuffer = async (
	buffer,
	key,
	keyID,
	encPrefix: string = ''
) => {
	const vector = crypto.getRandomValues(new Uint8Array(VECTOR_LENGTH));
	const result = await encryptAES(vector, key, buffer);
	return (
		encPrefix +
		keyID +
		toHexString(joinVectorAndEcryptedData(vector, result)) +
		`${VERSION_SEPERATOR}${ENCRYPTION_VERSION_ACTIVE}`
	);
};

export const decryptAttachment = async (
	encryptedAttachment: string,
	name: string,
	roomKeyID,
	groupKey
): Promise<File> => {
	// error if key is missing
	if (!roomKeyID || !groupKey) {
		throw new MissingKeyError('e2ee.message.encryption.text');
	}

	// keyId
	const keyID = encryptedAttachment.slice(0, KEY_ID_LENGTH);
	if (keyID !== roomKeyID) {
		throw new WrongKeyError('e2ee.message.encryption.error');
	}

	const encAttachmentWithVersion = encryptedAttachment.slice(KEY_ID_LENGTH);
	const [encAttachment, version] =
		encAttachmentWithVersion.split(VERSION_SEPERATOR);

	let msgArray;
	try {
		switch (version) {
			case ENCRYPTION_VERSION_2:
				msgArray = fromHexString(encAttachment);
				break;
			case ENCRYPTION_VERSION_1:
			default:
				msgArray = Uint8Array.from(
					Object.values(JSON.parse(atob(encAttachment)))
				);
				break;
		}

		const [vector, cipherText] = splitVectorAndEcryptedData(msgArray);
		const result = await decryptAES(vector, groupKey, cipherText);
		return new File([result], name);
	} catch (error) {
		console.error('Error decrypting message: ', error, encAttachment);
		throw error;
	}
};
export const getSignature = async (attachment: File): Promise<ArrayBuffer> => {
	const buffer = await attachment.arrayBuffer();

	// Get the required signature for apache tika
	let signature = buffer.slice(0, SIGNATURE_LENGTH);

	// If the signature is smaller than the required size fill the signature with 0
	// Maybe this could be optimized in any way to prevent requirement for filling
	if (signature.byteLength < SIGNATURE_LENGTH) {
		const sig = new Uint8Array(signature);
		const output = new Uint8Array(SIGNATURE_LENGTH);
		output.set(sig, 0);
		output.fill(0, sig.length, SIGNATURE_LENGTH);
		signature = output.buffer;
	}

	return signature;
};

export const encryptAttachment = async (
	attachment: File,
	keyID,
	key
): Promise<File> => {
	if (!keyID) {
		return attachment;
	}

	const encoder = new TextEncoder();
	const buffer = await attachment.arrayBuffer();

	// Encrypt the attachment
	const encryptedAttachment = await encryptBuffer(buffer, key, keyID);

	// Create buffer from encrypted attachment
	const output = new Uint8Array(encoder.encode(encryptedAttachment).length);
	output.set(encoder.encode(encryptedAttachment), 0);

	// Create file
	const encryptedAttachmentFile = new File(
		[output.buffer],
		attachment.name,
		attachment
	);

	// Decrypt attachment after encrypt to check if the result matches
	const decryptedAttachment = await decryptAttachment(
		await encryptedAttachmentFile.text(),
		attachment.name,
		keyID,
		key
	);

	const orgAttachment = await attachment.text();
	const decAttachment = await decryptedAttachment.text();
	if (orgAttachment !== decAttachment) {
		throw new EncryptValidationError('Error validating encrypted text.');
	}

	return encryptedAttachmentFile;
};

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
	if (encPrefix.length > MAX_PREFIX_LENGTH) {
		throw new EncPrefixLengthError('Encryption prefix too long!');
	}

	const encryptedText = await encryptBuffer(
		new TextEncoder().encode(message),
		key,
		keyID,
		encPrefix
	);

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
		throw new MissingKeyError('e2ee.message.encryption.text');
	}

	const keyID = message.slice(
		encPrefix.length,
		KEY_ID_LENGTH + encPrefix.length
	);
	if (keyID !== roomKeyID) {
		throw new WrongKeyError('e2ee.message.encryption.error');
	}

	const encMessageWithVersion = message.slice(
		KEY_ID_LENGTH + encPrefix.length
	);
	const [encMessage, version] =
		encMessageWithVersion.split(VERSION_SEPERATOR);
	let msgArray;
	try {
		switch (version) {
			case ENCRYPTION_VERSION_2:
				msgArray = fromHexString(encMessage);
				break;
			case ENCRYPTION_VERSION_1:
			default:
				msgArray = Uint8Array.from(
					Object.values(JSON.parse(atob(encMessage)))
				);
				break;
		}

		const [vector, cipherText] = splitVectorAndEcryptedData(msgArray);
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
	new Promise(async (resolve) => {
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
			const keyID = btoa(sessionKeyExported.k).slice(0, KEY_ID_LENGTH);

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
		// Decrypt obtained encrypted session key
		let sessionKeyExportedString;
		try {
			groupKey = groupKey.slice(KEY_ID_LENGTH);
			groupKey = atob(groupKey);
			groupKey = Uint8Array.from(Object.values(JSON.parse(groupKey)));

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
			const keyID = btoa(sessionKeyExported.k).slice(0, KEY_ID_LENGTH);
			const key = await importAESKey(sessionKeyExported);

			// Key has been obtained. E2E is now in session.
			resolve({ key, keyID, sessionKeyExportedString });
		} catch (error) {
			console.error('Error decrypting group key: ', error);
			reject(error);
			return;
		}
	});

export const encryptPrivateKey = async (privateKey, masterKey) => {
	const vector = crypto.getRandomValues(new Uint8Array(VECTOR_LENGTH));
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

	const persistedMasterKey =
		await importRawEncryptionKey(persistedArrayBuffer);

	const privateKey = await decryptPrivateKey(
		encryptedPrivateKey,
		persistedMasterKey
	);
	storeKeys(privateKey, storedPublicKey);
};
