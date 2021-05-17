import * as React from 'react';
import { Header } from '../header/Header';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import './waitingRoom.styles';
import { ReactComponent as WelcomeIllustration } from '../../resources/img/illustrations/willkommen.svg';
import { ReactComponent as WaitingIllustration } from '../../resources/img/illustrations/waiting.svg';
import { translate } from '../../utils/translate';
import { useEffect, useState } from 'react';
import { endpointPort, tld } from '../../resources/scripts/config';
import { apiPostAnonymousRegistration } from '../../api';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import { decodeUsername } from '../../utils/encryptionHelpers';
import {
	getTokenFromCookie,
	setTokenInCookie
} from '../sessionCookie/accessSessionCookie';

export interface WaitingRoomProps {
	consultingTypeSlug: string;
	consultingTypeId: number;
	onAnonymousRegistration: Function;
}

export const WaitingRoom = (props: WaitingRoomProps) => {
	const [
		isDataProtectionViewActive,
		setIsDataProtectionViewActive
	] = useState<boolean>(true);
	const [username, setUsername] = useState<string>();

	useEffect(() => {
		const registeredUsername = getTokenFromCookie('registeredUsername');

		if (registeredUsername && getTokenFromCookie('keycloak')) {
			setIsDataProtectionViewActive(false);
			setUsername(registeredUsername);
			props.onAnonymousRegistration();
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const getRedirectText = () => {
		const url = `${tld + endpointPort}/${
			props.consultingTypeSlug
		}/registration`;

		return `
			<a href="${url}">${translate('anonymous.waitingroom.redirect.link')}</a>
			${translate('anonymous.waitingroom.redirect.suffix')}
		`;
	};

	const getUsernameText = () => {
		return `
		 ${translate('anonymous.waitingroom.username')} 
		 <span class="waitingRoom__username">${username}</span>
		`;
	};

	const confirmButton: ButtonItem = {
		label: translate('anonymous.waitingroom.dataProtection.button'),
		type: BUTTON_TYPES.PRIMARY
	};

	const handleConfirmButton = () => {
		apiPostAnonymousRegistration(props.consultingTypeId)
			.then((response) => {
				const decodedUsername = decodeUsername(response.userName);
				setIsDataProtectionViewActive(false);
				setUsername(decodedUsername);
				setTokenInCookie('keycloak', response.accessToken);
				setTokenInCookie('registeredUsername', decodedUsername);
				props.onAnonymousRegistration();
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<div className="waitingRoom">
			<Header />
			{isDataProtectionViewActive ? (
				<div className="waitingRoom__contentWrapper">
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
							text={translate(
								'registration.dataProtection.label'
							)}
						/>
						<Button
							className="waitingRoom__confirmButton"
							buttonHandle={handleConfirmButton}
							item={confirmButton}
						/>
					</div>
				</div>
			) : (
				<div className="waitingRoom__contentWrapper">
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
						<Text type="standard" text={getUsernameText()} />
						<div className="waitingRoom__redirect">
							<Text
								type="standard"
								text={translate(
									'anonymous.waitingroom.redirect.prefix'
								)}
							/>
							<Text type="standard" text={getRedirectText()} />
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
