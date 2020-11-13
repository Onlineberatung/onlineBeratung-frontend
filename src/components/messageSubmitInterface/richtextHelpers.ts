import { DraftHandleValue } from 'draft-js';

export const emojiPickerCustomClasses = {
	emojiSelect: 'emoji__select',
	emojiSelectButton: 'emoji__selectButton',
	emojiSelectButtonPressed: 'emoji__selectButton--pressed',
	emojiSelectPopover: 'emoji__selectPopover',
	emojiSelectPopoverClosed: 'emoji__selectPopover--closed',
	emojiSelectPopoverTitle: 'emoji__selectPopover__title',
	emojiSelectPopoverGroups: 'emoji__selectPopover__groups',
	emojiSelectPopoverGroup: 'emoji__selectPopover__group',
	emojiSelectPopoverGroupTitle: 'emoji__selectPopover__groupTitle',
	emojiSelectPopoverGroupList: 'emoji__selectPopover__groupList',
	emojiSelectPopoverGroupItem: 'emoji__selectPopover__groupItem',
	emojiSelectPopoverToneSelect: 'emoji__selectPopover__toneSelect',
	emojiSelectPopoverToneSelectList: 'emoji__selectPopover__toneSelectList',
	emojiSelectPopoverToneSelectItem: 'emoji__selectPopover__toneSelectItem',
	emojiSelectPopoverEntry: 'emoji__selectPopover__entry',
	emojiSelectPopoverEntryFocused: 'emoji__selectPopover__entry--focused',
	emojiSelectPopoverEntryIcon: 'emoji__selectPopover__entryIcon',
	emojiSelectPopoverNav: 'emoji__selectPopover__nav',
	emojiSelectPopoverNavItem: 'emoji__selectPopover__navItem',
	emojiSelectPopoverNavEntry: 'emoji__selectPopover__navEntry',
	emojiSelectPopoverNavEntryActive: 'emoji__selectPopover__navEntry--active',
	emojiSelectPopoverScrollbar: 'emoji__selectPopover__scrollbar',
	emojiSelectPopoverScrollbarThumb: 'emoji__selectPopover__scrollbarThumb',
	emoji: 'emoji',
	emojiSuggestionsEntry: 'emoji__suggestionsEntry',
	emojiSuggestionsEntryFocused: 'emoji__suggestionsEntry--focused',
	emojiSuggestionsEntryText: 'emoji__suggestionsEntry__text',
	emojiSuggestionsEntryIcon: 'emoji__suggestionsEntry__icon',
	emojiSuggestions: 'emoji__suggestions'
};

export const toolbarCustomClasses = {
	toolbarStyles: {
		toolbar: 'textarea__toolbar'
	},
	buttonStyles: {
		button: 'textarea__toolbar__button',
		active: 'textarea__toolbar__button--active'
	}
};

export const INPUT_MAX_LENGTH = 7500;

export const handleEditorBeforeInput = (editorState): DraftHandleValue => {
	const currentContent = editorState.getCurrentContent();
	const currentContentLength = currentContent.getPlainText('').length;

	if (currentContentLength > INPUT_MAX_LENGTH - 1) {
		return 'handled';
	} else {
		return 'not-handled';
	}
};

export const handleEditorPastedText = (
	editorState,
	pastedText
): DraftHandleValue => {
	const currentContent = editorState.getCurrentContent();
	const currentContentLength = currentContent.getPlainText('').length;

	if (currentContentLength + pastedText.length > INPUT_MAX_LENGTH) {
		return 'handled';
	} else {
		return 'not-handled';
	}
};

export const urlifyLinksInText = (text) => {
	var urlRegex = /((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi; // eslint-disable-line
	return text.replace(urlRegex, function (url) {
		const href =
			url.search(/^http[s]?\:\/\//) === -1 ? `http://${url}` : url; // eslint-disable-line
		return `<a href="${href}" target="_blank">${url}</a>`;
	});
};
