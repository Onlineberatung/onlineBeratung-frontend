import React, { useEffect, useMemo, useState } from 'react';

import { Overlay, OVERLAY_FUNCTIONS } from '../overlay/Overlay';
import { BUTTON_TYPES } from '../button/Button';
import { markdownToDraft } from 'markdown-draft-js';
import { Headline } from '../headline/Headline';
import { ReactComponent as newIllustration } from '../../resources/img/illustrations/new.svg';
import { Checkbox } from '../checkbox/Checkbox';
import { Text } from '../text/Text';
import { convertFromRaw } from 'draft-js';
import sanitizeHtml from 'sanitize-html';
import { sanitizeHtmlExtendedOptions } from '../messageSubmitInterface/richtextHelpers';
import { stateToHTML } from 'draft-js-export-html';
import './releaseNote.styles.scss';
import { useTranslation } from 'react-i18next';
import { useAppConfig } from '../../hooks/useAppConfig';
import {
	STORAGE_KEY_RELEASE_NOTES,
	useDevToolbar
} from '../devToolbar/DevToolbar';
import { OVERLAY_RELEASE_NOTE } from '../../globalState/interfaces/AppConfig/OverlaysConfigInterface';

interface ReleaseNoteProps {}

const MAX_CONCURRENT_RELEASE_NOTES = 2;
const STORAGE_KEY_RELEASE_NOTE = 'releaseNote';

type TReleases = {
	title?: string;
	file: string;
}[];

export const ReleaseNote: React.FC<ReleaseNoteProps> = () => {
	const settings = useAppConfig();
	const { t: translate } = useTranslation();
	const { getDevToolbarOption } = useDevToolbar();
	const [showReleaseNote, setShowRelaseNote] = useState(false);
	const [checkboxChecked, setCheckboxChecked] = useState(false);
	const [releaseNoteText, setReleaseNoteText] = useState('');
	const [latestReleaseNote, setLatestReleaseNote] = useState('');

	const readReleaseNote = useMemo(
		() => localStorage.getItem(STORAGE_KEY_RELEASE_NOTE) ?? '0',
		[]
	);

	useEffect(() => {
		fetch(
			`${settings.urls.releases}/releases.json?cacheBuster=${Date.now()}`
		)
			.then((res) => res.json())
			.then((releases: TReleases) =>
				Object.entries(releases)
					.sort(([keyA], [keyB]) =>
						parseInt(keyA) > parseInt(keyB) ? -1 : 1
					)
					.slice(0, MAX_CONCURRENT_RELEASE_NOTES)
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
						fetch(
							`${settings.urls.releases}/${
								release.file
							}?cacheBuster=${Date.now()}`
						)
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
				setShowRelaseNote(
					getDevToolbarOption(STORAGE_KEY_RELEASE_NOTES) === '1'
				);
			})
			.catch(() => {
				setShowRelaseNote(false);
			});
	}, [getDevToolbarOption, readReleaseNote, settings.urls.releases]);

	const changeHasSeenReleaseNote = () => {
		setCheckboxChecked(!checkboxChecked);
		localStorage.setItem(
			STORAGE_KEY_RELEASE_NOTE,
			`${checkboxChecked ? readReleaseNote : latestReleaseNote}`
		);
	};

	if (!showReleaseNote) {
		return null;
	}

	return (
		<Overlay
			name={OVERLAY_RELEASE_NOTE}
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
								text={translate('releaseNote.content.headline')}
								semanticLevel="3"
							/>
							<Text
								text={translate('releaseNote.content.intro')}
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
								checked={checkboxChecked}
								inputId={'seen'}
								label={translate(
									'releaseNote.content.checkbox'
								)}
								labelId={'seen_label'}
								name={'seen'}
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
	);
};
