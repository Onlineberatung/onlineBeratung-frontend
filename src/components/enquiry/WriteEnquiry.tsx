import * as React from 'react';
import { useState, useEffect, useContext, useCallback } from 'react';

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
	ActiveSessionGroupIdContext,
	AcceptedGroupIdContext
} from '../../globalState';
import { mobileDetailView, mobileListView } from '../app/navigationHandler';
import { ReactComponent as EnvelopeCheckIcon } from '../../resources/img/illustrations/envelope-check.svg';
import { ReactComponent as WelcomeIcon } from '../../resources/img/illustrations/willkommen.svg';
import './enquiry.styles';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import { EnquiryLanguageSelection } from './EnquiryLanguageSelection';

interface WriteEnquiryProps {
	fixedLanguages: string[];
}

export const WriteEnquiry: React.FC<WriteEnquiryProps> = ({
	fixedLanguages
}) => {
	const { setAcceptedGroupId } = useContext(AcceptedGroupIdContext);
	const { activeSessionGroupId } = useContext(ActiveSessionGroupIdContext);
	let [overlayActive, setOverlayActive] = useState(false);
	const [sessionId, setSessionId] = useState<number | null>(null);
	const [groupId, setGroupId] = useState<string | null>(null);
	const [selectedLanguage, setSelectedLanguage] = useState(fixedLanguages[0]);

	useEffect(() => {
		if (activeSessionGroupId) {
			mobileDetailView();
			return () => {
				mobileListView();
			};
		} else {
			deactivateListView();
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

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

	return (
		<div className="enquiry__wrapper">
			<div className="enquiry__infoWrapper">
				<WelcomeIcon className="enquiry__image" />
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
						text={translate('enquiry.write.infotext.copy.facts')}
						type="standard"
						className="enquiry__facts"
					/>
					<EnquiryLanguageSelection
						className="enquiry__languageSelection"
						languages={
							/* TODO */ [
								'de',
								'ar',
								'en',
								'fr',
								'pl',
								'it',
								'af',
								'ch',
								'ca'
							]
						}
						defaultLanguage={fixedLanguages[0]}
						handleSelection={setSelectedLanguage}
					/>
				</div>
			</div>
			<MessageSubmitInterfaceComponent
				handleSendButton={handleSendButton}
				placeholder={translate('enquiry.write.input.placeholder')}
				type={SESSION_LIST_TYPES.ENQUIRY}
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
