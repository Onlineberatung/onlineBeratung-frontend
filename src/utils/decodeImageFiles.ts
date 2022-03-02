/* decode JSON.stringified Base64 images with special chars
 * due settings in Backend all base64 encoded image are delivered with  encoded spezial chars like "&#43;" for "+"
 * here we just decode this "back to normal"
 */
const decode = (input: string) => {
	return input.replace(/&#(\d+);/g, (match, dec) => {
		return String.fromCharCode(dec);
	});
};

export default decode;
