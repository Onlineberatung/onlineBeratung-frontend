export const getUrlParameter = (
	name: string,
	fallback: string = null
): string => {
	name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
	const url = new URL(window.location.href);
	return url.searchParams.has(name)
		? decodeURIComponent(url.searchParams.get(name).replace(/\+/g, ' '))
		: fallback;
};
