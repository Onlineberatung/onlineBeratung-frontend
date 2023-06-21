import {
	ContentState,
	convertToRaw,
	convertFromHTML,
	DraftHandleValue,
	Modifier,
	SelectionState,
	EditorState
} from 'draft-js';
import sanitizeHtml from 'sanitize-html';

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
	editorState: EditorState,
	text: string,
	html?: string
): EditorState => {
	const pastedContent = html ?? text;
	const currentContent = editorState.getCurrentContent();
	const currentContentLength = currentContent.getPlainText('').length;

	if (currentContentLength + text.length > INPUT_MAX_LENGTH) {
		return null;
	} else {
		const { contentBlocks, entityMap } = convertFromHTML(
			sanitizeHtml(pastedContent, sanitizeHtmlPasteOptions)
		);
		const contentState = Modifier.replaceWithFragment(
			editorState.getCurrentContent(),
			editorState.getSelection(),
			ContentState.createFromBlockArray(
				contentBlocks,
				entityMap
			).getBlockMap()
		);
		return EditorState.push(editorState, contentState, 'insert-fragment');
	}
};

export const urlifyLinksInText = (text) => {
	var urlRegex =
		/(?:([Hh]ttps?:\/\/|[Rr]tsp:\/\/)|([Mm]ailto:)(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?(?:(?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|digital|live|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]|localhost|local))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?(?:\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi; // eslint-disable-line
	return text.replace(urlRegex, function (url, protocol, mailto) {
		const target = mailto ? '_self' : '_blank';
		const href = protocol || mailto ? url : `http://${url}`; // eslint-disable-line
		return `<a href="${href}" target=${target}>${url.replace(mailto, '')}</a>`;
	});
};

export const markdownToDraftDefaultOptions = {
	remarkablePreset: 'commonmark',
	remarkableOptions: {
		disable: {
			block: [
				'blockquote',
				'code',
				'fences',
				'heading',
				'hr',
				'htmlblock',
				'lheading'
			],
			inline: [
				'autolink',
				'backticks',
				'htmltag',
				'links',
				'newline',
				'text'
			]
		}
	}
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

/**
 * Escape markdown characters typed by the user
 * @param contentState
 */
export const escapeMarkdownChars = (contentState: ContentState) => {
	let newContentState = contentState;
	const rawDraftObject = convertToRaw(contentState);

	rawDraftObject.blocks.forEach((block) => {
		const selectionState = SelectionState.createEmpty(block.key);
		let counter = 0;
		newContentState = [...block.text].reduce(
			(contentState, char, charIndex) => {
				if (['*', '_', '~', '`'].indexOf(char) < 0) return contentState;

				const selection = selectionState.merge({
					focusOffset: charIndex + counter,
					anchorOffset: charIndex + counter
				});
				counter++;
				return Modifier.insertText(contentState, selection, '\\');
			},
			newContentState
		);
	});

	return newContentState;
};
