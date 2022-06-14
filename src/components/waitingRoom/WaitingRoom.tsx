import * as React from 'react';
import { Header } from '../header/Header';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import './waitingRoom.styles';
import { ReactComponent as WelcomeIllustration } from '../../resources/img/illustrations/welcome.svg';
import { ReactComponent as WaitingIllustration } from '../../resources/img/illustrations/waiting.svg';
import { ReactComponent as ErrorIllustration } from '../../resources/img/illustrations/not-found.svg';
import { translate } from '../../utils/translate';
import { useContext, useEffect, useState } from 'react';
import {
	AnonymousRegistrationResponse,
	apiPostAnonymousRegistration
} from '../../api';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import { decodeUsername } from '../../utils/encryptionHelpers';
import {
	deleteCookieByName,
	getValueFromCookie,
	removeAllCookies,
	setValueInCookie
} from '../sessionCookie/accessSessionCookie';
import {
	Overlay,
	OverlayItem,
	OverlayWrapper,
	OVERLAY_FUNCTIONS
} from '../overlay/Overlay';
import {
	AnonymousConversationFinishedContext,
	AnonymousEnquiryAcceptedContext,
	LegalLinkInterface,
	WebsocketConnectionDeactivatedContext
} from '../../globalState';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import { history } from '../app/app';
import {
	acceptanceOverlayItem,
	rejectionOverlayItem
} from './waitingRoomHelpers';
import { handleTokenRefresh, setTokens } from '../auth/auth';

export interface WaitingRoomProps {
	consultingTypeSlug: string;
	consultingTypeId: number;
	legalLinks: Array<LegalLinkInterface>;
	onAnonymousRegistration: Function;
}

export const WaitingRoom = (props: WaitingRoomProps) => {
	const [isDataProtectionViewActive, setIsDataProtectionViewActive] =
		useState<boolean>(true);
	const [username, setUsername] = useState<string>();
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);
	const [isErrorPageActive, setIsErrorPageActive] = useState(false);
	const [isOverlayActive, setIsOverlayActive] = useState<boolean>(false);
	const [overlayItem, setOverlayItem] = useState<OverlayItem>();
	const { anonymousEnquiryAccepted, setAnonymousEnquiryAccepted } =
		useContext(AnonymousEnquiryAcceptedContext);
	const { anonymousConversationFinished, setAnonymousConversationFinished } =
		useContext(AnonymousConversationFinishedContext);
	const {
		websocketConnectionDeactivated,
		setWebsocketConnectionDeactivated
	} = useContext(WebsocketConnectionDeactivatedContext);
	const registrationUrl = `/${props.consultingTypeSlug}/registration`;

	useEffect(() => {
		const registeredUsername = getValueFromCookie('registeredUsername');
		const sessionId = getValueFromCookie('anonymousSessionId');

		// handle a refresh as registered user and not initialize a new user
		if (registeredUsername && getValueFromCookie('keycloak') && sessionId) {
			setIsDataProtectionViewActive(false);
			setUsername(registeredUsername);
			handleTokenRefresh();
			props.onAnonymousRegistration();
		}

		document.title = `${translate(
			'anonymous.waitingroom.title.start'
		)} ${capitalizeFirstLetter(props.consultingTypeSlug)}`;
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (anonymousEnquiryAccepted) {
			setOverlayItem(acceptanceOverlayItem);
			setIsOverlayActive(true);
			setAnonymousEnquiryAccepted(false);
		}
	}, [anonymousEnquiryAccepted, setAnonymousEnquiryAccepted]);

	useEffect(() => {
		if (anonymousConversationFinished === 'NEW') {
			setOverlayItem(rejectionOverlayItem);
			setIsOverlayActive(true);
			removeAllCookies();
			setAnonymousConversationFinished(null);
		}
	}, [anonymousConversationFinished, setAnonymousConversationFinished]);

	useEffect(() => {
		if (websocketConnectionDeactivated) {
			setIsErrorPageActive(true);
			setWebsocketConnectionDeactivated(null);
		}
	}, [websocketConnectionDeactivated, setWebsocketConnectionDeactivated]);

	const getUsernameText = () => {
		return `
		${translate('anonymous.waitingroom.username')} 
		<div class="waitingRoom__username">
		${
			username
				? username
				: `<span class="waitingRoom__username--loading">${translate(
						'anonymous.waitingroom.username.loading'
				  )}</span>`
		}
		</div>
		`;
	};

	const confirmButton: ButtonItem = {
		label: translate('anonymous.waitingroom.dataProtection.button'),
		type: BUTTON_TYPES.PRIMARY
	};

	const reloadButton: ButtonItem = {
		label: translate('anonymous.waitingroom.errorPage.button'),
		type: BUTTON_TYPES.PRIMARY
	};

	const handleConfirmButton = () => {
		if (!isRequestInProgress) {
			setIsRequestInProgress(true);
			setIsDataProtectionViewActive(false);
			window.scrollTo(0, 0);
			apiPostAnonymousRegistration(props.consultingTypeId)
				.then((response: AnonymousRegistrationResponse) => {
					const decodedUsername = decodeUsername(response.userName);
					setUsername(decodedUsername);
					setValueInCookie('registeredUsername', decodedUsername);
					setValueInCookie('rc_token', response.rcToken);
					setValueInCookie('rc_uid', response.rcUserId);
					setValueInCookie(
						'anonymousSessionId',
						`${response.sessionId}`
					);

					setTokens(
						response.accessToken,
						response.expiresIn,
						response.refreshToken,
						response.refreshExpiresIn
					);

					handleTokenRefresh();
					props.onAnonymousRegistration();
				})
				.catch((err) => {
					console.log(err);
				})
				.finally(() => {
					setIsRequestInProgress(false);
				});
		}
	};

	const handleReloadButton = () => {
		window.location.reload();
	};

	const handleOverlayAction = (buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECT) {
			history.push(`/app`);
			deleteCookieByName('registeredUsername');
		} else if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECT_TO_URL) {
			window.location.href = registrationUrl;
		}
	};

	const getContent = () => {
		if (isDataProtectionViewActive) {
			return (
				<>
					<div className="waitingRoom__illustration">
						<WelcomeIllustration />
					</div>
					<div>
						<Headline
							className="waitingRoom__headline"
							semanticLevel="1"
							text={translate(
								'anonymous.waitingroom.dataProtection.headline'
							)}
						/>
						<Headline
							className="waitingRoom__subline"
							semanticLevel="3"
							text={translate(
								'anonymous.waitingroom.dataProtection.subline'
							)}
						/>
						<Text
							type="standard"
							text={translate(
								'anonymous.waitingroom.dataProtection.description'
							)}
						/>
						<Text
							type="standard"
							text={[
								translate(
									'registration.dataProtection.label.prefix'
								),
								props.legalLinks
									.filter(
										(legalLink) => legalLink.registration
									)
									.map(
										(legalLink, index, { length }) =>
											(index > 0
												? index < length - 1
													? ', '
													: translate(
															'registration.dataProtection.label.and'
													  )
												: '') +
											`<a target="_blank" href="${legalLink.url}">${legalLink.label}</a>`
									)
									.join(''),
								translate(
									'registration.dataProtection.label.suffix'
								)
							].join(' ')}
						/>
						<Button
							className="waitingRoom__button"
							buttonHandle={handleConfirmButton}
							item={confirmButton}
						/>
					</div>
				</>
			);
		} else if (isErrorPageActive) {
			return (
				<>
					<div className="waitingRoom__illustration">
						<ErrorIllustration className="waitingRoom__waitingIllustration" />
					</div>
					<div>
						<Headline
							className="waitingRoom__headline"
							semanticLevel="1"
							text={translate(
								'anonymous.waitingroom.errorPage.headline'
							)}
						/>
						<Text
							type="standard"
							text={translate(
								'anonymous.waitingroom.errorPage.description'
							)}
						/>
						<Button
							className="waitingRoom__button"
							buttonHandle={handleReloadButton}
							item={reloadButton}
						/>
					</div>
				</>
			);
		} else {
			return (
				<>
					<div className="waitingRoom__illustration">
						<WaitingIllustration className="waitingRoom__waitingIllustration" />
					</div>
					<div>
						<Headline
							className="waitingRoom__headline"
							semanticLevel="1"
							text={translate('anonymous.waitingroom.headline')}
						/>
						<Headline
							className="waitingRoom__subline"
							semanticLevel="3"
							text={translate('anonymous.waitingroom.subline')}
						/>
						<div className="waitingRoom__user">
							<Text type="standard" text={getUsernameText()} />
							<Text
								type="standard"
								text={translate(
									'anonymous.waitingroom.info.accountDeletion'
								)}
							/>
						</div>
						<div className="waitingRoom__redirect">
							<Text
								type="standard"
								text={translate(
									'anonymous.waitingroom.redirect.title'
								)}
							/>
							<Text
								type="standard"
								text={translate(
									'anonymous.waitingroom.redirect.subline'
								)}
							/>
						</div>
					</div>
				</>
			);
		}
	};

	return (
		<>
			<div className="waitingRoom">
				<Header />
				<div className="waitingRoom__contentWrapper">
					{getContent()}
				</div>
			</div>
			{isOverlayActive && (
				<OverlayWrapper>
					<Overlay
						item={overlayItem}
						handleOverlay={handleOverlayAction}
					/>
				</OverlayWrapper>
			)}
		</>
	);
};
