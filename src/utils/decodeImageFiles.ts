// decode JSON.stringified Base64 images
const decode = (input: string) => {
	return input.replace(/&#(\d+);/g, (match, dec) => {
		return String.fromCharCode(dec);
	});
};

export default decode;
