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
