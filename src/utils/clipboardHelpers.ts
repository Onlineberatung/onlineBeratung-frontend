const createDiv = (content) => {
	let div = document.createElement('div');
	div.style.position = 'absolute';
	div.style.top = div.style.left = '-10000em';
	document.body.appendChild(div);
	div.innerHTML = content;
	return div;
};

/**
 * This should work in all browsers but to be sure something is copied
 * there are two fallbacks
 * @param content
 */
const copyRange = (content) => {
	const div = createDiv(content);
	div.contentEditable = 'true';

	const range = document.createRange();
	range.selectNodeContents(div);

	const selection = window.getSelection();
	selection.removeAllRanges();
	selection.addRange(range);

	document.execCommand('copy');
	selection.removeAllRanges();
	document.body.removeChild(div);
};

/**
 * Last fallback if no of the other versions supported which just
 * copies text version from textarea
 * @param content
 */
const copyFallback = (content) => {
	const div = createDiv(content);
	let textarea = document.createElement('textarea');
	document.body.appendChild(textarea);
	// just copy text content because we can't copy richtext in fallback
	textarea.value = (
		div.textContent === undefined ? div.innerText : div.textContent
	).trim();
	textarea.focus();
	textarea.select();
	document.execCommand('copy');
	document.body.removeChild(div);
	document.body.removeChild(textarea);
};

/**
 * Using clipboardApi.
 * Safari has some problems by firing the copy event. On multiple clicks its
 * not always firing the event
 * @param content
 */
const copyClipboard = (content) => {
	function listener(e) {
		e.preventDefault();
		e.clipboardData.setData('text/html', content);
		e.clipboardData.setData('text/plain', content);
	}

	document.addEventListener('copy', listener);
	document.execCommand('copy');
	document.removeEventListener('copy', listener);
};

export const copyTextToClipboard = async (
	content: any,
	callback?: Function
) => {
	if (document.createRange) {
		copyRange(content);
	} else if (window.ClipboardEvent) {
		copyClipboard(content);
	} else {
		copyFallback(content);
	}
	if (callback) {
		callback();
	}
};
