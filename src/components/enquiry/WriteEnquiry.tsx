import * as React from 'react';
import { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { MessageSubmitInterfaceComponent } from '../messageSubmitInterface/messageSubmitInterfaceComponent';
import {
	OverlayItem,
	OVERLAY_FUNCTIONS,
	OverlayWrapper,
	Overlay
} from '../overlay/Overlay';
import { BUTTON_TYPES } from '../button/Button';
import { endpoints } from '../../resources/scripts/endpoints';
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
import { LanguagesContext } from '../../globalState/provider/LanguagesProvider';
import { useResponsive } from '../../hooks/useResponsive';
import { createGroupKey } from '../../utils/encryptionHelpers';

import { Loading } from '../app/Loading';
import { useSession } from '../../hooks/useSession';
import { apiGetAskerSessionList } from '../../api';
import { encryptRoom } from '../../utils/e2eeHelper';
import { useTranslation } from 'react-i18next';

export const WriteEnquiry: React.FC = () => {
	const { t: translate } = useTranslation();
	const { sessionId } = useParams<{ sessionId: string }>();
	const sessionIdFromParam = sessionId ? parseInt(sessionId) : null;
	const history = useHistory();

	const { fixed: fixedLanguages } = useContext(LanguagesContext);

	const [activeSession, setActiveSession] = useState(null);
	const [overlayActive, setOverlayActive] = useState(false);
	const [redirectSessionId, setRedirectSessionId] = useState<number | null>(
		null
	);
	const [redirectGroupId, setRedirectGroupId] = useState<string | null>(null);
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
				pathname: `${endpoints.userSessionsListView}/${redirectGroupId}/${redirectSessionId}`
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
		headline: translate('enquiry.write.overlay.headline'),
		copy: translate('enquiry.write.overlay.copy'),
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

			setRedirectSessionId(response.sessionId);
			setRedirectGroupId(response.rcGroupId);
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
							text={translate(
								'enquiry.write.infotext.copy.title'
							)}
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
						onSelect={setSelectedLanguage}
						value={selectedLanguage}
					/>
				)}
			</div>
			<ActiveSessionContext.Provider value={{ activeSession }}>
				<MessageSubmitInterfaceComponent
					handleSendButton={handleSendButton}
					placeholder={translate(
						'enquiry.write.input.placeholder.asker'
					)}
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
