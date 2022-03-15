type Placeholders = {
	[key: string]: string;
};

export const parsePlaceholderString = (
	origin: string,
	placeholders: Placeholders
) => {
	let target = origin;
	for (const key in placeholders) {
		if (!placeholders.hasOwnProperty(key)) {
			return;
		}
		target = target.replace(
			new RegExp('\\{' + key + '\\}', 'gm'),
			placeholders[key]
		);
	}
	return target;
};
