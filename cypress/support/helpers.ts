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
