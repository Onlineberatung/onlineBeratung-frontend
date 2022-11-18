export const getUrlParameter = (name: string) => {
	name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
	let regex = new RegExp('[\\?&]' + name + '=([^&#]*)', 'i');
	// eslint-disable-next-line no-restricted-globals
	let results = regex.exec(location.search);
	return results === null
		? ''
		: decodeURIComponent(results[1].replace(/\+/g, ' '));
};
