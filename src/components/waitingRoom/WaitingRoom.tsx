import * as React from 'react';
import { Text } from '../text/Text';
import { v4 as uuid } from 'uuid';
import './waitingRoom.styles';
import { ReactComponent as WaitingIllustration } from '../../resources/img/illustrations/waiting.svg';
import { ReactComponent as ErrorIllustration } from '../../resources/img/illustrations/not-found.svg';
import { ReactComponent as SecurityIllustration } from '../../resources/img/illustrations/security.svg';
import { ReactComponent as ClosedIllustration } from '../../resources/img/illustrations/closed.svg';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
	AnonymousConversationAvailabilityInterface,
	AnonymousRegistrationResponse,
	apiAnonymousConversationAvailability,
	apiPostAnonymousRegistration,
	FETCH_ERRORS
} from '../../api';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import { decodeUsername } from '../../utils/encryptionHelpers';
import {
	deleteCookieByName,
	getValueFromCookie,
	removeAllCookies,
	setValueInCookie
} from '../sessionCookie/accessSessionCookie';
import { Overlay, OverlayItem, OVERLAY_FUNCTIONS } from '../overlay/Overlay';
import {
	AnonymousConversationFinishedContext,
	AnonymousEnquiryAcceptedContext,
	WebsocketConnectionDeactivatedContext,
	AnonymousConversationStartedContext
} from '../../globalState';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import {
	acceptanceOverlayItem,
	rejectionOverlayItem
} from './waitingRoomHelpers';
import { handleTokenRefresh, setTokens } from '../auth/auth';
import { handleE2EESetup } from '../registration/autoLogin';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { LegalLinksContext } from '../../globalState/provider/LegalLinksProvider';
import { WaitingRoomContent } from './WaitingRoomContent';
import { StageLayout } from '../stageLayout/StageLayout';
import { appConfig } from '../../utils/appConfig';
import { Loading } from '../app/Loading';
import { GlobalComponentContext } from '../../globalState/provider/GlobalComponentContext';
export interface WaitingRoomProps {
	consultingTypeSlug: string;
	consultingTypeId: number;
	onAnonymousRegistration: Function;
}

// How many retries should run until 409 requests are failing
const USERNAME_CONFLICT_RETRY_LIMIT = 20;
// Slowdown request after every 5 requests to prevent 429
const USERNAME_CONFLICT_RETRY_SLOWDOWN = 5;

export const WaitingRoom = (props: WaitingRoomProps) => {
	const { t: translate } = useTranslation();
	const history = useHistory();

	const legalLinks = useContext(LegalLinksContext);
	const { Stage } = useContext(GlobalComponentContext);

	const [isDataProtectionViewActive, setIsDataProtectionViewActive] =
		useState<boolean>(true);
	const [username, setUsername] = useState<string>();
	const [isConsultantAvailable, setIsConsultantAvailable] =
		useState<boolean>();
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
	const { anonymousConversationStarted, setAnonymousConversationStarted } =
		useContext(AnonymousConversationStartedContext);
	const registrationUrl = `/${props.consultingTypeSlug}/registration`;

	const getPseudoPasswordForUser = (rc_uid) => {
		let pseudoPassword = localStorage.getItem(`pseudoPassword_${rc_uid}`);
		if (!pseudoPassword) {
			pseudoPassword = uuid();
			localStorage.setItem(`pseudoPassword_${rc_uid}`, pseudoPassword);
		}
		return pseudoPassword;
	};

	const afterRegistrationHandler = () => {
		const rc_uid = getValueFromCookie('rc_uid');
		const pseuodPassword = getPseudoPasswordForUser(rc_uid);
		handleE2EESetup(pseuodPassword, rc_uid, null, true).then(() =>
			props.onAnonymousRegistration()
		);
	};

	useEffect(() => {
		const registeredUsername = getValueFromCookie('registeredUsername');
		const sessionId = getValueFromCookie('anonymousSessionId');

		// handle a refresh as registered user and not initialize a new user
		if (registeredUsername && getValueFromCookie('keycloak') && sessionId) {
			setIsDataProtectionViewActive(false);
			setUsername(registeredUsername);
			handleTokenRefresh()
				.then(afterRegistrationHandler)
				.then(() => {
					return apiAnonymousConversationAvailability(
						parseInt(sessionId, 10)
					);
				})
				.then(
					(response: AnonymousConversationAvailabilityInterface) => {
						setIsConsultantAvailable(
							response.numAvailableConsultants > 0
						);
					}
				);
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
		if (anonymousConversationStarted) {
			setAnonymousConversationStarted(false);
		}
	}, [anonymousConversationStarted, setAnonymousConversationStarted]);

	useEffect(() => {
		if (anonymousConversationFinished === 'NEW') {
			setOverlayItem(rejectionOverlayItem);
			setIsOverlayActive(true);
			removeAllCookies();
		} else {
			setIsOverlayActive(false);
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
		${translate('anonymous.waitingroom.username.text')} 
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

	const retryCount = useRef(1);
	const registerAnonymous = useCallback(() => {
		return apiPostAnonymousRegistration(props.consultingTypeId).catch(
			(err: Error) => {
				if (
					err.message === FETCH_ERRORS.CONFLICT &&
					retryCount.current <= USERNAME_CONFLICT_RETRY_LIMIT
				) {
					retryCount.current += 1;
					return new Promise<AnonymousRegistrationResponse>(
						(resolve) => {
							setTimeout(
								() => {
									resolve(registerAnonymous());
								},
								Math.ceil(
									retryCount.current /
										USERNAME_CONFLICT_RETRY_SLOWDOWN
								) * 500
							);
						}
					);
				} else {
					throw err;
				}
			}
		);
	}, [props.consultingTypeId]);

	const handleConfirmButton = () => {
		if (!isRequestInProgress) {
			setIsRequestInProgress(true);
			setIsDataProtectionViewActive(false);
			window.scrollTo(0, 0);
			registerAnonymous()
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

					handleTokenRefresh().then(afterRegistrationHandler);
					return response.sessionId;
				})
				.then(apiAnonymousConversationAvailability)
				.then(
					(response: AnonymousConversationAvailabilityInterface) => {
						setIsConsultantAvailable(
							response.numAvailableConsultants > 0
						);
					}
				)
				.catch((err: Error) => {
					console.log(err);
				})
				.finally(() => {
					retryCount.current = 1;
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
				<WaitingRoomContent
					showRegistrationInfo={false}
					headlineKey="anonymous.waitingroom.dataProtection.headline"
					sublineKey="anonymous.waitingroom.dataProtection.subline"
					Illustration={
						<SecurityIllustration
							aria-label={translate(
								'anonymous.waitingroom.welcomeImageTitle'
							)}
							title={translate(
								'anonymous.waitingroom.welcomeImageTitle'
							)}
						/>
					}
				>
					<Text
						type="standard"
						text={[
							translate(
								'registration.dataProtection.label.prefix'
							),
							legalLinks
								.filter((legalLink) => legalLink.registration)
								.map(
									(legalLink, index, { length }) =>
										(index > 0
											? index < length - 1
												? ', '
												: translate(
														'registration.dataProtection.label.and'
													)
											: '') +
										`<a target="_blank" href="${legalLink.getUrl(
											{ aid: null }
										)}">${translate(legalLink.label)}</a>`
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
				</WaitingRoomContent>
			);
		} else if (isRequestInProgress) {
			return <Loading></Loading>;
		} else if (isConsultantAvailable === false) {
			return (
				<WaitingRoomContent
					showRegistrationInfo={true}
					headlineKey="anonymous.waitingroom.closed.headline"
					Illustration={
						<ClosedIllustration
							aria-label={translate(
								'anonymous.waitingroom.closed.illustrationTitle'
							)}
							title={translate(
								'anonymous.waitingroom.closed.illustrationTitle'
							)}
						/>
					}
				>
					<Text
						type="standard"
						text={translate(
							'anonymous.waitingroom.closed.description',
							{
								websiteUrl: appConfig.urls.chatScheduleUrl
							}
						)}
					/>
				</WaitingRoomContent>
			);
		} else if (isErrorPageActive) {
			return (
				<>
					<WaitingRoomContent
						showRegistrationInfo={false}
						headlineKey="anonymous.waitingroom.errorPage.headline"
						Illustration={
							<ErrorIllustration
								aria-label={translate(
									'anonymous.waitingroom.errorImageTitle'
								)}
								title={translate(
									'anonymous.waitingroom.errorImageTitle'
								)}
								className="waitingRoom__waitingIllustration"
							/>
						}
					>
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
					</WaitingRoomContent>
				</>
			);
		} else if (isConsultantAvailable) {
			return (
				<WaitingRoomContent
					showRegistrationInfo={true}
					headlineKey="anonymous.waitingroom.headline"
					sublineKey="anonymous.waitingroom.subline"
					Illustration={
						<WaitingIllustration
							aria-label={translate(
								'anonymous.waitingroom.waitingImageTitle'
							)}
							title={translate(
								'anonymous.waitingroom.waitingImageTitle'
							)}
							className="waitingRoom__waitingIllustration"
						/>
					}
				>
					<div className="waitingRoom__user">
						<Text
							className="waitingRoom__subline"
							type="standard"
							text={getUsernameText()}
						/>
						<Text
							type="standard"
							text={translate(
								'anonymous.waitingroom.info.accountDeletion'
							)}
							className="waitingRoom__user-description"
						/>
					</div>
				</WaitingRoomContent>
			);
		}
	};

	return (
		<StageLayout
			stage={<Stage hasAnimation={false} isReady={false} />}
			showLegalLinks
			showRegistrationLink={false}
		>
			{getContent()}
			{isOverlayActive && (
				<Overlay
					item={overlayItem}
					handleOverlay={handleOverlayAction}
				/>
			)}
		</StageLayout>
	);
};
