export const deepMerge = (
	obj: { [key: string]: any },
	props: { [key: string]: any }
) => {
	Object.keys(props).forEach((key) => {
		if (typeof props[key] === 'object') {
			if (!obj[key]) {
				obj[key] = props[key];
			} else {
				obj[key] = deepMerge(obj[key], props[key]);
			}
		} else {
			obj[key] = props[key];
		}
	});

	return obj;
};

export const parseCookieStr = (str: string): { [key: string]: string } =>
	str
		.split(';')
		.map((v) => v.split('='))
		.reduce((acc, v) => {
			acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(
				v[1].trim()
			);
			return acc;
		}, {});
