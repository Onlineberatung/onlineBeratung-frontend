import * as React from 'react';
import { useState, useEffect, useContext } from 'react';

import { history } from '../app/app';
import { MessageSubmitInterfaceComponent } from '../messageSubmitInterface/messageSubmitInterfaceComponent';
import { translate } from '../../utils/translate';
import { SESSION_TYPES } from '../session/sessionHelpers';
import {
	OverlayItem,
	OVERLAY_FUNCTIONS,
	OverlayWrapper,
	Overlay
} from '../overlay/Overlay';
import { BUTTON_TYPES } from '../button/Button';
import { logout } from '../logout/logout';
import { config } from '../../resources/scripts/config';
import {
	ActiveSessionGroupIdContext,
	AcceptedGroupIdContext,
	SessionsDataContext
} from '../../globalState';
import { mobileDetailView, mobileListView } from '../app/navigationHandler';
import { ReactComponent as EnvelopeCheckIcon } from '../../resources/img/illustrations/envelope-check.svg';
import { ReactComponent as WelcomeIcon } from '../../resources/img/illustrations/willkommen.svg';
import './enquiry.styles';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';

const overlayItem: OverlayItem = {
	svg: EnvelopeCheckIcon,
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

export const WriteEnquiry = () => {
	const { sessionsData } = useContext(SessionsDataContext);
	const { setAcceptedGroupId } = useContext(AcceptedGroupIdContext);
	const { activeSessionGroupId } = useContext(ActiveSessionGroupIdContext);
	let [overlayActive, setOverlayActive] = useState(false);

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

	const handleOverlayAction = (buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECT) {
			activateListView();
			activeSessionGroupId
				? setAcceptedGroupId(activeSessionGroupId)
				: setAcceptedGroupId(sessionsData.mySessions[0].session.id);
			history.push({
				pathname: config.endpoints.userSessionsListView
			});
		} else {
			logout();
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
				</div>
			</div>
			<MessageSubmitInterfaceComponent
				handleSendButton={() => setOverlayActive(true)}
				placeholder={translate('enquiry.write.input.placeholder')}
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
