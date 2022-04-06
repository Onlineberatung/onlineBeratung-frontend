import * as React from 'react';
import { useState, useEffect, useContext, useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { history } from '../app/app';
import { MessageSubmitInterfaceComponent } from '../messageSubmitInterface/messageSubmitInterfaceComponent';
import { translate } from '../../utils/translate';
import { SESSION_LIST_TYPES } from '../session/sessionHelpers';
import {
	OverlayItem,
	OVERLAY_FUNCTIONS,
	OverlayWrapper,
	Overlay
} from '../overlay/Overlay';
import { BUTTON_TYPES } from '../button/Button';
import { config } from '../../resources/scripts/config';
import {
	AcceptedGroupIdContext,
	getActiveSession,
	SessionsDataContext
} from '../../globalState';

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

export const WriteEnquiry: React.FC = () => {
	const { sessionId: sessionIdFromParam } = useParams();

	const { setAcceptedGroupId } = useContext(AcceptedGroupIdContext);
	const { sessionsData } = useContext(SessionsDataContext);
	const fixedLanguages = useContext(FixedLanguagesContext);

	const [activeSession, setActiveSession] = useState(null);
	const [overlayActive, setOverlayActive] = useState(false);
	const [sessionId, setSessionId] = useState<number | null>(null);
	const [groupId, setGroupId] = useState<string | null>(null);
	const [selectedLanguage, setSelectedLanguage] = useState(fixedLanguages[0]);

	useEffect(() => {
		const activeSession = getActiveSession(
			sessionIdFromParam,
			sessionsData
		);
		setActiveSession(activeSession);
	}, [sessionIdFromParam]); // eslint-disable-line react-hooks/exhaustive-deps

	const { fromL } = useResponsive();
	useEffect(() => {
		if (sessionIdFromParam) {
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
	}, [fromL, sessionIdFromParam]);

	const handleOverlayAction = (buttonFunction: string): void => {
		if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECT) {
			activateListView();
			setAcceptedGroupId(groupId);
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

	const handleSendButton = useCallback((response) => {
		setSessionId(response.sessionId);
		setGroupId(response.rcGroupId);
		setOverlayActive(true);
	}, []);

	const isUnassignedSession =
		(activeSession && !activeSession?.consultant) ||
		(!activeSession && !sessionsData?.mySessions?.[0]?.consultant);

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
			<MessageSubmitInterfaceComponent
				handleSendButton={handleSendButton}
				placeholder={translate('enquiry.write.input.placeholder')}
				type={SESSION_LIST_TYPES.ENQUIRY}
				sessionIdFromParam={sessionIdFromParam}
				groupIdFromParam={null}
				language={selectedLanguage}
			/>
			{overlayActive ? (
				<OverlayWrapper>
					<Overlay
						item={overlayItem}
						handleOverlay={handleOverlayAction}
					/>
				</OverlayWrapper>
			) : null}
		</div>
	);
};
