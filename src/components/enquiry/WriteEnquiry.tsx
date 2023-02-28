import * as React from 'react';
import { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { Overlay, OVERLAY_FUNCTIONS, OverlayItem } from '../overlay/Overlay';
import { BUTTON_TYPES } from '../button/Button';
import { endpoints } from '../../resources/scripts/endpoints';
import { buildExtendedSession, STATUS_EMPTY } from '../../globalState';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';

import {
	desktopView,
	mobileDetailView,
	mobileListView
} from '../app/navigationHandler';
import { ReactComponent as EnvelopeCheckIcon } from '../../resources/img/illustrations/envelope-check.svg';
import { ReactComponent as WelcomeIcon } from '../../resources/img/illustrations/welcome.svg';
// ToDo: Check styles because enquiry_wrapper is defined in session.styles too but not imported in this view
import './enquiry.styles';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import { EnquiryLanguageSelection } from './EnquiryLanguageSelection';
import { LanguagesContext } from '../../globalState/provider/LanguagesProvider';
import { useResponsive } from '../../hooks/useResponsive';

import { Loading } from '../app/Loading';
import { useSession } from '../../hooks/useSession';
import { apiGetAskerSessionList } from '../../api';
import { useTranslation } from 'react-i18next';
import { SessionE2EEProvider } from '../../globalState/provider/SessionE2EEProvider';
import { MessageSubmitComponent } from '../messageSubmitInterface/MessageSubmitComponent';
import { DragAndDropArea } from '../dragAndDropArea/DragAndDropArea';
import { RocketChatUsersOfRoomProvider } from '../../globalState/provider/RocketChatUsersOfRoomProvider';

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

	const { session, ready: sessionReady } = useSession(
		null,
		sessionIdFromParam
	);

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

	// ToDo. Do it the react way
	const activateListView = () => {
		document
			.querySelector('.contentWrapper__list')
			?.setAttribute('style', 'display: block');
		document
			.querySelector('.navigation__wrapper')
			?.classList.remove('navigation__wrapper--mobileHidden');
		document.querySelector('.header')?.classList.remove('header--mobile');

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

	const handleSendButton = useCallback(async (response) => {
		setRedirectSessionId(response.sessionId);
		setRedirectGroupId(response.rcGroupId);
		setOverlayActive(true);
	}, []);

	if (isLoading) {
		return <Loading />;
	}

	const isUnassignedSession = activeSession && !activeSession?.consultant;

	return (
		<DragAndDropArea className="flex flex--fd-column flex--ai-s enquiry__wrapper">
			<ActiveSessionContext.Provider value={{ activeSession }}>
				<RocketChatUsersOfRoomProvider>
					<SessionE2EEProvider>
						<div className="enquiry__contentWrapper flex__col--1 flex flex--fd-column flex--ai-c flex--jc-c">
							<div className="enquiry__scrollContainer">
								<div className="enquiry__infoWrapper">
									<div className="enquiry__text">
										<Headline
											semanticLevel="3"
											text={translate(
												'enquiry.write.infotext.headline'
											)}
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
									<WelcomeIcon
										className="enquiry__image"
										title={translate(
											'enquiry.write.infotext.iconTitle'
										)}
										aria-label={translate(
											'enquiry.write.infotext.iconTitle'
										)}
									/>
								</div>
								{isUnassignedSession && (
									<EnquiryLanguageSelection
										className="enquiry__languageSelection"
										onSelect={setSelectedLanguage}
										value={selectedLanguage}
									/>
								)}
							</div>
						</div>
						<MessageSubmitComponent
							className="flex__col--0"
							onSendButton={handleSendButton}
							language={selectedLanguage}
						/>
						{overlayActive && (
							<Overlay
								item={overlayItem}
								handleOverlay={handleOverlayAction}
							/>
						)}
					</SessionE2EEProvider>
				</RocketChatUsersOfRoomProvider>
			</ActiveSessionContext.Provider>
		</DragAndDropArea>
	);
};
