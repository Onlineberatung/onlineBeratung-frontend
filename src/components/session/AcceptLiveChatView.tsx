import * as React from 'react';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
	E2EEContext,
	getContact,
	LegalLinkInterface,
	SessionTypeContext
} from '../../globalState';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';
import './session.styles';
import {
	Overlay,
	OVERLAY_FUNCTIONS,
	OverlayItem,
	OverlayWrapper
} from '../overlay/Overlay';
import { useSearchParam } from '../../hooks/useSearchParams';
import {
	enquirySuccessfullyAcceptedOverlayItem,
	enquiryTakenByOtherConsultantOverlayItem,
	SESSION_LIST_TAB,
	SESSION_LIST_TYPES
} from './sessionHelpers';
import { useE2EE } from '../../hooks/useE2EE';
import { createGroupKey } from '../../utils/encryptionHelpers';
import { encryptRoom } from '../../utils/e2eeHelper';
import { translate } from '../../utils/translate';
import { apiEnquiryAcceptance, FETCH_ERRORS } from '../../api';
import { history } from '../app/app';
import { Button, BUTTON_TYPES, ButtonItem } from '../button/Button';
import { SessionHeaderComponent } from '../sessionHeader/SessionHeaderComponent';
import { Headline } from '../headline/Headline';
import { useWatcher } from '../../hooks/useWatcher';
import { apiGetSessionRoomBySessionId } from '../../api/apiGetSessionRooms';

interface AcceptLiveChatViewProps {
	legalLinks: Array<LegalLinkInterface>;
	bannedUsers: string[];
}

export const AcceptLiveChatView = ({
	legalLinks,
	bannedUsers
}: AcceptLiveChatViewProps) => {
	const { activeSession } = useContext(ActiveSessionContext);

	const { rcGroupId: groupIdFromParam } = useParams();
	const { type } = useContext(SessionTypeContext);
	const abortController = useRef<AbortController>(null);

	const [overlayItem, setOverlayItem] = useState<OverlayItem>(null);
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);
	const sessionListTab = useSearchParam<SESSION_LIST_TAB>('sessionListTab');
	const getSessionListTab = () =>
		`${sessionListTab ? `?sessionListTab=${sessionListTab}` : ''}`;

	/* E2EE */
	const { encrypted, keyID, sessionKeyExportedString, ready } =
		useE2EE(groupIdFromParam);
	const { isE2eeEnabled } = useContext(E2EEContext);
	const [groupKeyID, setGroupKeyID] = useState(null);
	const [sessionGroupKeyExportedString, setSessionGroupKeyExportedString] =
		useState(null);

	// group Key generation if needed
	useEffect(() => {
		if (!isE2eeEnabled || !ready) {
			return;
		}
		if (!activeSession) {
			return;
		}

		if (encrypted) {
			setGroupKeyID(keyID);
			setSessionGroupKeyExportedString(sessionKeyExportedString);
		} else {
			createGroupKey().then(
				({ keyID, key, sessionKeyExportedString }) => {
					setGroupKeyID(keyID);
					setSessionGroupKeyExportedString(sessionKeyExportedString);
				}
			);
		}
	}, [
		encrypted,
		activeSession,
		keyID,
		sessionKeyExportedString,
		isE2eeEnabled,
		ready
	]);

	const handleEncryptRoom = useCallback(async () => {
		return encryptRoom({
			keyId: groupKeyID,
			isE2eeEnabled,
			isRoomAlreadyEncrypted: encrypted,
			rcGroupId: groupIdFromParam,
			sessionKeyExportedString: sessionGroupKeyExportedString
		});
	}, [
		encrypted,
		groupIdFromParam,
		groupKeyID,
		sessionGroupKeyExportedString,
		isE2eeEnabled
	]);

	/** END E2EE */

	const updateActiveSession = useCallback(() => {
		if (abortController.current) {
			abortController.current.abort();
		}

		abortController.current = new AbortController();

		return apiGetSessionRoomBySessionId(
			activeSession.item.id,
			abortController.current.signal
		).catch((e) => {
			if (e.message === FETCH_ERRORS.ABORT) {
				return;
			} else if (e.message === FETCH_ERRORS.FORBIDDEN) {
				setOverlayItem(enquiryTakenByOtherConsultantOverlayItem);
			}
		});
	}, [activeSession.item.id]);

	const [startWatcher, stopWatcher, isWatcherRunning] = useWatcher(
		updateActiveSession,
		3000
	);

	useEffect(() => {
		if (!isWatcherRunning && !overlayItem) {
			startWatcher();
		}

		return () => {
			if (isWatcherRunning) {
				stopWatcher();
			}
			if (abortController.current) {
				abortController.current.abort();
				abortController.current = null;
			}
		};
	}, [isWatcherRunning, overlayItem, startWatcher, stopWatcher]);

	const handleButtonClick = (sessionId: any) => {
		if (isRequestInProgress) {
			return null;
		}
		setIsRequestInProgress(true);

		apiEnquiryAcceptance(sessionId, true)
			.then(async () => {
				await handleEncryptRoom();
				setOverlayItem(enquirySuccessfullyAcceptedOverlayItem);
			})
			.catch((error) => {
				if (error.message === FETCH_ERRORS.CONFLICT) {
					setOverlayItem(enquiryTakenByOtherConsultantOverlayItem);
				} else {
					console.log(error);
				}
			});
	};

	const handleOverlayAction = (buttonFunction: string) => {
		switch (buttonFunction) {
			case OVERLAY_FUNCTIONS.REDIRECT:
				if (activeSession.item.id && activeSession.item.groupId) {
					history.push(
						`/sessions/consultant/sessionView/${activeSession.item.groupId}/${activeSession.item.id}`
					);
					return;
				}
				history.push(`/sessions/consultant/sessionView/`);
				break;
			case OVERLAY_FUNCTIONS.CLOSE:
				setOverlayItem(null);
				history.push(
					`/sessions/consultant/sessionPreview${getSessionListTab()}`
				);
				break;
			default:
			// Should never be executed as `handleOverlayAction` is only called
			// with a non-null `overlayItem`
		}
	};

	const buttonItem: ButtonItem = {
		label: translate('enquiry.acceptButton.anonymous'),
		type: BUTTON_TYPES.PRIMARY
	};

	return (
		<div className="session__wrapper">
			<div className="session">
				<div>
					<SessionHeaderComponent
						legalLinks={legalLinks}
						bannedUsers={bannedUsers}
					/>
				</div>

				<div className="session__content session__content--anonymousEnquiry">
					<Headline
						semanticLevel="3"
						text={`${translate(
							'enquiry.anonymous.infoLabel.start'
						)}${getContact(activeSession).username}${translate(
							'enquiry.anonymous.infoLabel.end'
						)}`}
					/>
				</div>

				{type === SESSION_LIST_TYPES.ENQUIRY && (
					<div className="session__acceptance messageItem">
						<Button
							item={buttonItem}
							buttonHandle={() =>
								handleButtonClick(activeSession.item.id)
							}
						/>
					</div>
				)}

				{overlayItem && (
					<OverlayWrapper>
						<Overlay
							item={overlayItem}
							handleOverlay={handleOverlayAction}
						/>
					</OverlayWrapper>
				)}
			</div>
		</div>
	);
};
