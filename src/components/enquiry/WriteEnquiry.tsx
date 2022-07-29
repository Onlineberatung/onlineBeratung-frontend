import * as React from 'react';
import { useState, useEffect, useContext, useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { history } from '../app/app';
import { MessageSubmitInterfaceComponent } from '../messageSubmitInterface/messageSubmitInterfaceComponent';
import { translate } from '../../utils/translate';
import {
	OverlayItem,
	OVERLAY_FUNCTIONS,
	OverlayWrapper,
	Overlay
} from '../overlay/Overlay';
import { BUTTON_TYPES } from '../button/Button';
import { config } from '../../resources/scripts/config';
import {
	buildExtendedSession,
	STATUS_EMPTY,
	E2EEContext
} from '../../globalState';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';

import {
	desktopView,
	mobileDetailView,
	mobileListView
} from '../app/navigationHandler';
import { ReactComponent as EnvelopeCheckIcon } from '../../resources/img/illustrations/envelope-check.svg';
import { ReactComponent as WelcomeIcon } from '../../resources/img/illustrations/welcome.svg';
import './enquiry.styles';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import { EnquiryLanguageSelection } from './EnquiryLanguageSelection';
import { FixedLanguagesContext } from '../../globalState/provider/FixedLanguagesProvider';
import { useResponsive } from '../../hooks/useResponsive';
import { createGroupKey } from '../../utils/encryptionHelpers';

import { Loading } from '../app/Loading';
import { useSession } from '../../hooks/useSession';
import { apiGetAskerSessionList } from '../../api';
import { encryptRoom } from '../../utils/e2eeHelper';

export const WriteEnquiry: React.FC = () => {
	const { sessionId: sessionIdFromParam } = useParams();

	const fixedLanguages = useContext(FixedLanguagesContext);

	const [activeSession, setActiveSession] = useState(null);
	const [overlayActive, setOverlayActive] = useState(false);
	const [sessionId, setSessionId] = useState<number | null>(null);
	const [groupId, setGroupId] = useState<string | null>(null);
	const [selectedLanguage, setSelectedLanguage] = useState(fixedLanguages[0]);
	const [isFirstEnquiry, setIsFirstEnquiry] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const { isE2eeEnabled } = useContext(E2EEContext);
	const [keyID, setKeyID] = useState(null);
	const [key, setKey] = useState(null);
	const [sessionKeyExportedString, setSessionKeyExportedString] =
		useState(null);

	const { session, ready: sessionReady } = useSession(
		null,
		sessionIdFromParam
	);

	useEffect(() => {
		if (!isE2eeEnabled) {
			return;
		}

		createGroupKey().then(({ keyID, key, sessionKeyExportedString }) => {
			setKeyID(keyID);
			setKey(key);
			setSessionKeyExportedString(sessionKeyExportedString);
		});
	}, [isE2eeEnabled]);

	useEffect(() => {
		if (!sessionReady && sessionIdFromParam) {
			return;
		}

		if (!session) {
			apiGetAskerSessionList().then(({ sessions }) => {
				if (
					sessions.length === 1 &&
					sessions[0]?.session?.status === STATUS_EMPTY
				) {
					setIsFirstEnquiry(true);
					setActiveSession(buildExtendedSession(sessions[0]));
					setIsLoading(false);
					return;
				}
			});
		} else {
			setActiveSession(session);
			setIsLoading(false);
			return;
		}
	}, [sessionReady, sessionIdFromParam, session]);

	const { fromL } = useResponsive();
	useEffect(() => {
		if (!isFirstEnquiry) {
			if (!fromL) {
				mobileDetailView();
				return () => {
					mobileListView();
				};
			}
			desktopView();
		} else {
			deactivateListView();
		}
	}, [fromL, isFirstEnquiry]);

	const handleOverlayAction = (buttonFunction: string): void => {
		if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECT) {
			activateListView();
			history.push({
				pathname: `${config.endpoints.userSessionsListView}/${groupId}/${sessionId}`
			});
		}
	};

	const activateListView = () => {
		document
			.querySelector('.contentWrapper__list')
			?.setAttribute('style', 'display: block');
		document
			.querySelector('.navigation__wrapper')
			?.classList.remove('navigation__wrapper--mobileHidden');

		if (window.innerWidth <= 900) {
			const contentWrapper = document.querySelector(
				'.contentWrapper__detail'
			);
			contentWrapper?.classList.add(
				'contentWrapper__detail--smallInactive'
			);
		}
	};

	const deactivateListView = () => {
		document
			.querySelector('.contentWrapper__list')
			?.setAttribute('style', 'display: none');
		document
			.querySelector('.navigation__wrapper')
			?.classList.add('navigation__wrapper--mobileHidden');
		document.querySelector('.header')?.classList.add('header--mobile');

		const contentWrapper = document.querySelector(
			'.contentWrapper__detail'
		);
		contentWrapper?.setAttribute('style', 'width: 100%');

		if (window.innerWidth <= 900) {
			contentWrapper?.classList.remove(
				'contentWrapper__detail--smallInactive'
			);
		}
	};

	const overlayItem: OverlayItem = {
		svg: EnvelopeCheckIcon,
		headline: translate('enquiry.write.overlayHeadline'),
		copy: translate('enquiry.write.overlayCopy'),
		buttonSet: [
			{
				label: translate('enquiry.write.overlay.button'),
				function: OVERLAY_FUNCTIONS.REDIRECT,
				type: BUTTON_TYPES.AUTO_CLOSE
			}
		]
	};

	const handleSendButton = useCallback(
		async (response) => {
			// ToDo: encrypt room logic could be moved to messageSubmitInterfaceComponent.tsx (SessionItemCompoent.tsx & WriteEnquiry.tsx)
			await encryptRoom({
				keyId: keyID,
				isE2eeEnabled,
				isRoomAlreadyEncrypted: false,
				rcGroupId: response.rcGroupId,
				sessionKeyExportedString
			});

			setSessionId(response.sessionId);
			setGroupId(response.rcGroupId);
			setOverlayActive(true);
		},
		[keyID, sessionKeyExportedString, isE2eeEnabled]
	);

	if (isLoading) {
		return <Loading />;
	}

	const isUnassignedSession = activeSession && !activeSession?.consultant;

	return (
		<div className="enquiry__wrapper">
			<div className="enquiry__contentWrapper">
				<div className="enquiry__infoWrapper">
					<div className="enquiry__text">
						<Headline
							semanticLevel="3"
							text={translate('enquiry.write.infotext.headline')}
							className="enquiry__infotextHeadline"
						/>
						<Headline
							semanticLevel="4"
							styleLevel="5"
							text={translate('enquiry.write.infotext.copy')}
						/>
						<Text
							text={translate(
								'enquiry.write.infotext.copy.facts'
							)}
							type="standard"
							className="enquiry__facts"
						/>
					</div>
					<WelcomeIcon className="enquiry__image" />
				</div>
				{isUnassignedSession && (
					<EnquiryLanguageSelection
						className="enquiry__languageSelection"
						handleSelection={setSelectedLanguage}
					/>
				)}
			</div>
			<ActiveSessionContext.Provider value={{ activeSession }}>
				<MessageSubmitInterfaceComponent
					handleSendButton={handleSendButton}
					placeholder={translate('enquiry.write.input.placeholder')}
					language={selectedLanguage}
					E2EEParams={{
						keyID: keyID,
						key: key,
						sessionKeyExportedString: sessionKeyExportedString,
						encrypted: !!keyID
					}}
				/>
			</ActiveSessionContext.Provider>
			{overlayActive && (
				<OverlayWrapper>
					<Overlay
						item={overlayItem}
						handleOverlay={handleOverlayAction}
					/>
				</OverlayWrapper>
			)}
		</div>
	);
};
