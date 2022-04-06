import React, { useEffect, useState } from 'react';
import { markdownToDraft } from 'markdown-draft-js';
import { convertFromRaw } from 'draft-js';
import sanitizeHtml from 'sanitize-html';
import { sanitizeHtmlExtendedOptions } from '../messageSubmitInterface/richtextHelpers';
import { stateToHTML } from 'draft-js-export-html';
import { uiUrl } from '../../resources/scripts/config';

interface ReleaseNoteTextProps {
	version: string;
}

export const ReleaseNoteText: React.FC<ReleaseNoteTextProps> = ({
	version
}) => {
	const [releaseNoteText, setReleaseNoteText] = useState('');

	const getMarkdown = async () => {
		const markdownFile = await fetch(`${uiUrl}/releases/v${version}.md`);
		const markdownText = await markdownFile.text();

		const rawMarkdownToDraftObject = markdownToDraft(markdownText);
		const convertedMarkdownObject = convertFromRaw(
			rawMarkdownToDraftObject
		);

		const sanitizedText = sanitizeHtml(
			stateToHTML(convertedMarkdownObject),
			sanitizeHtmlExtendedOptions
		);

		setReleaseNoteText(sanitizedText);
	};

	useEffect(() => {
		getMarkdown();
	});

	return (
		<div
			className="releaseNote__text"
			dangerouslySetInnerHTML={{
				__html: releaseNoteText
			}}
		></div>
	);
};
