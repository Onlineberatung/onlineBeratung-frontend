import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import {
	MessageSubmitItem,
	MessageSubmitInterfaceComponent
} from '../../messageSubmitInterface/ts/messageSubmitInterfaceComponent';
import { translate } from '../../../resources/ts/i18n/translate';
import { SESSION_TYPES } from '../../session/ts/sessionHelpers';
import {
	OverlayItem,
	OVERLAY_FUNCTIONS,
	OverlayWrapper,
	Overlay
} from '../../overlay/ts/Overlay';
import { BUTTON_TYPES } from '../../button/ts/Button';
import { logout } from '../../logout/ts/logout';
import { config } from '../../../resources/ts/config';
import { ActiveSessionGroupIdContext } from '../../../globalState';

export const WriteEnquiry = (props) => {
	const overlayItem: OverlayItem = {
		imgSrc: '/../resources/img/illustrations/envelope-check.svg',
		headline: translate('enquiry.write.overlayHeadline'),
		copy: translate('enquiry.write.overlayCopy'),
		buttonSet: [
			{
				label: translate('enquiry.write.overlayButton1.label'),
				function: OVERLAY_FUNCTIONS.REDIRECT,
				type: BUTTON_TYPES.PRIMARY
			},
			{
				label: translate('enquiry.write.overlayButton2.label'),
				function: OVERLAY_FUNCTIONS.LOGOUT,
				type: BUTTON_TYPES.LINK
			}
		]
	};

	let [overlayActive, setOverlayActive] = useState(false);
	const { activeSessionGroupId } = useContext(ActiveSessionGroupIdContext);

	useEffect(() => {
		if (!activeSessionGroupId) {
			deactivateListView();
		}
	}, []);

	const handleOverlayAction = (buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECT) {
			window.location.href = config.endpoints.dashboard;
		} else {
			logout();
		}
	};

	const activateListView = () => {
		document
			.querySelector('.contentWrapper__list')
			.setAttribute('style', 'display: block');
		document
			.querySelector('.navigation__wrapper')
			.classList.remove('navigation__wrapper--mobileHidden');

		if (window.innerWidth <= 900) {
			const contentWrapper = document.querySelector(
				'.contentWrapper__detail'
			);
			contentWrapper.classList.add(
				'contentWrapper__detail--smallInactive'
			);
		}
	};

	const deactivateListView = () => {
		document
			.querySelector('.contentWrapper__list')
			.setAttribute('style', 'display: none');
		document
			.querySelector('.navigation__wrapper')
			.classList.add('navigation__wrapper--mobileHidden');
		document
			.querySelector('.contentWrapper__header')
			.classList.add('contentWrapper__header--enquiry');

		const contentWrapper = document.querySelector(
			'.contentWrapper__detail'
		);
		contentWrapper.setAttribute('style', 'width: 100%');

		if (window.innerWidth <= 900) {
			contentWrapper.classList.remove(
				'contentWrapper__detail--smallInactive'
			);
		}
	};

	const prepareTextarea = (): MessageSubmitItem => {
		return {
			formId: 'messageForm',
			wrapperClass: 'textarea__session',
			textareaId: 'sendMessageInput',
			textareaName: 'messageTextarea',
			textareaClass: 'textarea__sessionInput',
			svgId: 'sendMessage',
			svgClass: 'textarea__icon',
			placeholder: translate('enquiry.write.input.placeholder'),
			sessionRoomId: ''
		};
	};

	const enquiryTextarea = prepareTextarea();
	return (
		<div className="enquiry__wrapper">
			<div className="enquiry__infoWrapper">
				<div className="enquiry__image">
					<img src="/resources/img/illustrations/willkommen.svg" />
				</div>
				<div className="enquiry__infotext">
					<h2 className="enquiry__headline">
						{translate('enquiry.write.headline')}
					</h2>
					<h2 className="enquiry__infotextHeadline">
						{translate('enquiry.write.infotext.headline')}
					</h2>
					<div className="enquiry__infotextCopy">
						<p>{translate('enquiry.write.infotext.copy')}</p>
						<ul>
							<li>
								{translate('enquiry.write.infotext.copy.fact1')}
							</li>
							<li>
								{translate('enquiry.write.infotext.copy.fact2')}
							</li>
							<li>
								{translate('enquiry.write.infotext.copy.fact3')}
							</li>
							<li>
								{translate('enquiry.write.infotext.copy.fact4')}
							</li>
						</ul>
					</div>
				</div>
			</div>
			<MessageSubmitInterfaceComponent
				handleSendButton={() => setOverlayActive(true)}
				{...enquiryTextarea}
				type={SESSION_TYPES.ENQUIRY}
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
