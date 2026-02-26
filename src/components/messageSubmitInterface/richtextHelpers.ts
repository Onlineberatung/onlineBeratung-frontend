import sanitizeHtml from 'sanitize-html';

export const INPUT_MAX_LENGTH = 7500;

export const urlifyLinksInText = (text) => {
	const urlRegex =
		/(?:([Hh]ttps?:\/\/|[Rr]tsp:\/\/)|([Mm]ailto:)(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?(?:(?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|digital|live|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]|localhost|local))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?(?:\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi; // eslint-disable-line
	return text.replace(urlRegex, function (url, protocol, mailto) {
		const target = mailto ? '_self' : '_blank';
		const href = protocol || mailto ? url : `http://${url}`; // eslint-disable-line
		return `<a href="${href}" target=${target}>${url.replace(mailto, '')}</a>`;
	});
};

export const sanitizeHtmlPasteOptions = {
	allowedTags: ['em', 'p', 'div', 'b', 'i', 'ol', 'ul', 'li', 'strong', 'br']
};

export const sanitizeHtmlExtendedPasteOptions = {
	allowedTags: [
		...sanitizeHtmlPasteOptions.allowedTags,
		'h1',
		'h2',
		'h3',
		'h4',
		'h5',
		'h6',
		'a'
	]
};

export const sanitizeHtmlDefaultOptions = {
	allowedTags: [...sanitizeHtmlPasteOptions.allowedTags, 'a'],
	allowedAttributes: sanitizeHtml.defaults.allowedAttributes
};

export const sanitizeHtmlExtendedOptions = {
	allowedTags: [...sanitizeHtmlExtendedPasteOptions.allowedTags],
	allowedAttributes: sanitizeHtml.defaults.allowedAttributes,
	transformTags: {
		a: sanitizeHtml.simpleTransform('a', { target: '_blank' })
	}
};
