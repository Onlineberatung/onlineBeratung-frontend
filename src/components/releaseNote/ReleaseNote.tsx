import React, { useEffect, useState } from 'react';

import { version } from '../../../package.json';
import { Overlay, OverlayWrapper, OVERLAY_FUNCTIONS } from '../overlay/Overlay';
import { BUTTON_TYPES } from '../button/Button';
import { ReleaseNoteText } from './ReleaseNoteText';
import { Headline } from '../headline/Headline';
import { ReactComponent as newIllustration } from '../../resources/img/illustrations/new.svg';

import './releaseNote.styles.scss';
import { Checkbox, CheckboxItem } from '../checkbox/Checkbox';
import { Text } from '../text/Text';
import { translate } from '../../utils/translate';

interface ReleaseNoteProps {}

export const ReleaseNote: React.FC<ReleaseNoteProps> = () => {
	const [showReleaseNote, setShowRelaseNote] = useState(false);
	const [hasSeenReleaseNote, setHasSeenReleaseNote] = useState(false);
	const [checkboxChecked, setCheckboxChecked] = useState(false);

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
		localStorage.setItem(`v${version}`, `${event.target.checked}`);
	};

	const checkboxItem: CheckboxItem = {
		checked: checkboxChecked,
		inputId: 'seen',
		label: translate('releaseNote.content.checkbox'),
		labelId: 'seen_label',
		name: 'seen'
	};

	useEffect(() => {
		const versionSeen = localStorage.getItem(`v${version}`) === 'true';
		if (versionSeen) setHasSeenReleaseNote(true);
	}, []);

	useEffect(() => {
		if (hasSeenReleaseNote) {
			setShowRelaseNote(false);
		} else {
			setShowRelaseNote(true);
		}
	}, [hasSeenReleaseNote]);

	if (!showReleaseNote) return <></>;

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
									semanticLevel="2"
								/>
								<Text
									text={translate(
										'releaseNote.content.intro'
									)}
									type="standard"
								/>
							</div>
							<div className="releaseNote__content">
								<ReleaseNoteText version={version} />
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
