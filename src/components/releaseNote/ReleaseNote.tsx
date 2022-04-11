import React, { useEffect, useState } from 'react';

import packageInfo from '../../../package.json';
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

export const ReleaseNote: React.FC<ReleaseNoteProps> = () => {
	const [showReleaseNote, setShowRelaseNote] = useState(false);
	const [hasSeenReleaseNote, setHasSeenReleaseNote] = useState(false);
	const [checkboxChecked, setCheckboxChecked] = useState(false);
	const [releaseNoteText, setReleaseNoteText] = useState('');

	const getMarkdown = async () => {
		const response = await fetch(
			`${config.urls.releases}/v${packageInfo.version}.md`
		);

		if (response.ok) {
			const markdownText = await response.text();

			const rawMarkdownToDraftObject = markdownToDraft(markdownText);
			const convertedMarkdownObject = convertFromRaw(
				rawMarkdownToDraftObject
			);

			const sanitizedText = sanitizeHtml(
				stateToHTML(convertedMarkdownObject),
				sanitizeHtmlExtendedOptions
			);

			setShowRelaseNote(true);
			setReleaseNoteText(sanitizedText);
		}
	};

	const closeReleaseNote = () => {
		setShowRelaseNote(false);
	};

	const handleOverlayAction = (buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.CLOSE) {
			setShowRelaseNote(false);
		}
	};

	const changeHasSeenReleaseNote = (event) => {
		setCheckboxChecked(event.target.checked);
		localStorage.setItem(
			`v${packageInfo.version}`,
			`${event.target.checked}`
		);
	};

	const checkboxItem: CheckboxItem = {
		checked: checkboxChecked,
		inputId: 'seen',
		label: translate('releaseNote.content.checkbox'),
		labelId: 'seen_label',
		name: 'seen'
	};

	useEffect(() => {
		const versionSeen =
			localStorage.getItem(`v${packageInfo.version}`) === 'true';
		if (versionSeen) setHasSeenReleaseNote(true);
	}, []);

	useEffect(() => {
		if (hasSeenReleaseNote) {
			setShowRelaseNote(false);
		} else {
			getMarkdown();
		}
	}, [hasSeenReleaseNote]);

	if (!showReleaseNote || hasSeenReleaseNote) return null;

	return (
		<OverlayWrapper>
			<Overlay
				className="releaseNote"
				handleOverlayClose={closeReleaseNote}
				handleOverlay={handleOverlayAction}
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
