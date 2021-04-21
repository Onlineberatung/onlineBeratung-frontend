import { encode, decode } from 'hi-base32';

export const encodeUsername = (username) => {
	return 'enc.' + encode(username).replace(/=/g, '.');
};

export const decodeUsername = (username: string) => {
	const isEncoded = username.split('.') && username.split('.')[0] === 'enc';
	return isEncoded
		? decode(username.split('.')[1].toUpperCase() + '=')
		: username;
};
