const copyFallback = (content) => {
	let div = document.createElement('div');
	let textarea = document.createElement('textarea');
	div.style.position = 'absolute';
	div.style.top = div.style.left = '-10000em';
	document.body.appendChild(div);
	document.body.appendChild(textarea);
	div.innerHTML = content;
	document.execCommand('copy');
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
	if (window.ClipboardEvent) {
		copyClipboard(content);
	} else {
		copyFallback(content);
	}

	if (callback) {
		callback();
	}
};
