const getLocationVariables = () => {
	const location = window.location;
	const { host, protocol, origin } = location;
	const parts = host.split('.') || [];
	let subdomain = '';
	// If we get more than 3 parts, then we have a subdomain (but not on localhost)
	// INFO: This could be 4, if you have a co.uk TLD or something like that.
	if (parts?.length >= 3 || parts[1]?.includes('localhost')) {
		subdomain = parts[0];
	}
	return { subdomain, host, protocol, origin };
};

export default getLocationVariables;
