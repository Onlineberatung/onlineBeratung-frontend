/**
 * All data within the tenant service is currently stored with HTML encoding in the backend upon saving.
 * E.g. "+" is encoded with "&#43;" and needs to be decoded appropriately.
 * See https://en.wikipedia.org/wiki/Character_encodings_in_HTML#HTML_character_references
 */
const decodeHTML = (input: string) => {
	// Inspired by https://stackoverflow.com/a/9609450/343045
	const node = document.createElement('div');
	node.innerHTML = input;
	return node.textContent;
};

export default decodeHTML;
