import React, { useEffect, useMemo, useState } from 'react';

import { Overlay, OverlayWrapper, OVERLAY_FUNCTIONS } from '../overlay/Overlay';
import { BUTTON_TYPES } from '../button/Button';
import { markdownToDraft } from 'markdown-draft-js';
import { Headline } from '../headline/Headline';
import { ReactComponent as newIllustration } from '../../resources/img/illustrations/new.svg';
import { Checkbox, CheckboxItem } from '../checkbox/Checkbox';
import { Text } from '../text/Text';
import { translate } from '../../utils/translate';
import { config } from '../../resources/scripts/config';
import { convertFromRaw } from 'draft-js';
import sanitizeHtml from 'sanitize-html';
import { sanitizeHtmlExtendedOptions } from '../messageSubmitInterface/richtextHelpers';
import { stateToHTML } from 'draft-js-export-html';

import './releaseNote.styles.scss';

interface ReleaseNoteProps {}

const MAX_CONCURRENT_RELEASE_NOTES = 3;
const STORAGE_KEY = 'releaseNote';

type TReleases = {
	title?: string;
	file: string;
}[];

export const ReleaseNote: React.FC<ReleaseNoteProps> = () => {
	const [showReleaseNote, setShowRelaseNote] = useState(false);
	const [checkboxChecked, setCheckboxChecked] = useState(false);
	const [releaseNoteText, setReleaseNoteText] = useState('');
	const [latestReleaseNote, setLatestReleaseNote] = useState('');

	const readReleaseNote = useMemo(
		() => localStorage.getItem(STORAGE_KEY) ?? '0',
		[]
	);

	useEffect(() => {
		fetch(`${config.urls.releases}/releases.json`)
			.then((res) => res.json())
			.then((releases: TReleases) =>
				Object.entries(releases)
					.reverse()
					.slice(MAX_CONCURRENT_RELEASE_NOTES * -3)
					.filter(
						([key]) => parseInt(key) > parseInt(readReleaseNote)
					)
					.map(([key, data]) => ({
						...data,
						key
					}))
			)
			.then((releases) =>
				Promise.all(
					releases.map((release) =>
						fetch(`${config.urls.releases}/${release.file}`)
							.then((res) => res.text())
							.then((markdown) => ({
								...release,
								markdown: markdown
							}))
							.catch(() => null)
					)
				)
			)
			.then((markdowns) => markdowns.filter(Boolean))
			.then((markdowns) => {
				if (markdowns.length <= 0) {
					throw new Error('No release notes!');
				}

				const rawMarkdownToDraftObject = markdownToDraft(
					markdowns
						.map(
							(m) =>
								`${
									markdowns.length > 1 && m.title
										? `***${m.title}***\n\n`
										: ''
								}${m.markdown}`
						)
						.join('\n\n')
				);
				const convertedMarkdownObject = convertFromRaw(
					rawMarkdownToDraftObject
				);

				const sanitizedText = sanitizeHtml(
					stateToHTML(convertedMarkdownObject),
					sanitizeHtmlExtendedOptions
				);

				setLatestReleaseNote(markdowns[markdowns.length - 1].key);
				setReleaseNoteText(sanitizedText);
				setShowRelaseNote(true);
			})
			.catch(() => {
				setShowRelaseNote(false);
			});
	}, [readReleaseNote]);

	const changeHasSeenReleaseNote = () => {
		setCheckboxChecked(!checkboxChecked);
		localStorage.setItem(
			STORAGE_KEY,
			`${!checkboxChecked ? latestReleaseNote : readReleaseNote}`
		);
	};

	const checkboxItem: CheckboxItem = {
		checked: checkboxChecked,
		inputId: 'seen',
		label: translate('releaseNote.content.checkbox'),
		labelId: 'seen_label',
		name: 'seen'
	};

	if (!showReleaseNote) return null;

	return (
		<OverlayWrapper>
			<Overlay
				className="releaseNote"
				handleOverlayClose={() => setShowRelaseNote(false)}
				handleOverlay={() => setShowRelaseNote(false)}
				item={{
					illustrationBackground: 'neutral',
					svg: newIllustration,
					nestedComponent: (
						<>
							<div className="releaseNote__header">
								<Headline
									text={translate(
										'releaseNote.content.headline'
									)}
									semanticLevel="3"
								/>
								<Text
									text={translate(
										'releaseNote.content.intro'
									)}
									type="standard"
								/>
							</div>
							<div className="releaseNote__content">
								{releaseNoteText.length > 0 && (
									<div
										className="releaseNote__text"
										dangerouslySetInnerHTML={{
											__html: releaseNoteText
										}}
									></div>
								)}
							</div>
							<div className="releaseNote__footer">
								<Checkbox
									checkboxHandle={changeHasSeenReleaseNote}
									item={checkboxItem}
									onKeyPress={(event) => {
										if (event.key === 'Enter') {
											changeHasSeenReleaseNote();
										}
									}}
								/>
							</div>
						</>
					),
					buttonSet: [
						{
							label: translate('releaseNote.overlay.close'),
							function: OVERLAY_FUNCTIONS.CLOSE,
							type: BUTTON_TYPES.PRIMARY
						}
					]
				}}
			/>
		</OverlayWrapper>
	);
};
