import EmojiPicker from 'rm-emoji-picker';

const picker = new EmojiPicker({
	show_colon_preview: false,
	use_sheets: true,
	sheets: {
		apple: '/resources/img/sheets/sheet_apple_64_indexed_128.png',
		google: '/resources/img/sheets/sheet_google_64_indexed_128.png',
		twitter: '/resources/img/sheets/sheet_twitter_64_indexed_128.png',
		emojione: '/resources/img/sheets/sheet_emojione_64_indexed_128.png'
	}
});

export const initEmoji = (target: string, targetInput: string) => {
	const ele = document.getElementById(target);
	const targetInputEle = document.getElementById(targetInput);

	const icon = ele;
	const container = ele.parentNode;
	const editable = targetInputEle;

	picker.listenOn(icon, container, editable);
};

export const renderEmoji = (input: string) => {
	if (input) {
		return EmojiPicker.render(input);
	}
};
