import { encode, decode } from 'hi-base32';
import ByteBuffer from 'bytebuffer';
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
	let result;
	try {
		result = await encryptAES(vector, key, data);
	} catch (error) {
		return console.error('Error encrypting message: ', error);
	}

	return (
		encPrefix +
		keyID +
		btoa(JSON.stringify(joinVectorAndEcryptedData(vector, result)))
	);
};

export const decryptText = async (
	message,
	roomKeyID,
	groupKey,
	roomEncrypted,
	messageEncrypted,
	encPrefix: string = ''
) => {
	//ToDo: Just temporary fix as long as e2e is not set on message
	messageEncrypted = true;

	if (
		!roomEncrypted ||
		!messageEncrypted ||
		(encPrefix && message.indexOf(encPrefix) !== 0)
	) {
		return message;
	}

	if (!roomKeyID || !groupKey) {
		return 'Nachricht verschlüsselt';
	}

	const keyID = message.slice(encPrefix.length, 12);
	if (keyID !== roomKeyID) {
		//console.error('Error decrypting message: RoomKeyID does not match!');
		//ToDo: Just temporary fix as long as e2e is not set on message
		return message;
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
		return 'Nachricht verschlüsselt';
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

export const getMasterKey = async (rcUserId, password) => {
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
	new Promise(async (resolve) => {
		let userKey;
		try {
			userKey = await importRSAKey(JSON.parse(public_key), ['encrypt']);
		} catch (error) {
			return console.error('Error importing user key: ', error);
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
			return console.error('Error encrypting user key: ', error);
		}
	});
