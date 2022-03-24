import React, { useEffect, useState } from 'react';

import { version } from '../../../package.json';
import { Overlay, OverlayWrapper, OVERLAY_FUNCTIONS } from '../overlay/Overlay';
import { BUTTON_TYPES } from '../button/Button';
import { ReleaseNoteText } from './ReleaseNoteText';

import './releaseNote.styles.scss';

interface ReleaseNoteProps {}

export const ReleaseNote: React.FC<ReleaseNoteProps> = () => {
	const [showReleaseNote, setShowRelaseNote] = useState(false);
	const [hasSeenReleaseNote, setHasSeenReleaseNote] = useState(false);

	const closeReleaseNote = () => {
		setShowRelaseNote(false);
	};

	const handleOverlayAction = (buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.CLOSE) {
			setShowRelaseNote(false);
		}
	};

	const changeHasSeenReleaseNote = (event) => {
		localStorage.setItem(`v${version}`, `${event.target.checked}`);
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
					nestedComponent: (
						<div className="releaseNote__content">
							<label>
								GESEHEN
								<input
									type="checkbox"
									onChange={changeHasSeenReleaseNote}
								/>
							</label>
							<ReleaseNoteText version={version} />
						</div>
					),
					buttonSet: [
						{
							label: 'LABEL CLOSE',
							function: OVERLAY_FUNCTIONS.CLOSE,
							type: BUTTON_TYPES.SECONDARY
						}
					]
				}}
			/>
		</OverlayWrapper>
	);
};
