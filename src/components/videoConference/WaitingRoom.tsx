import '../waitingRoom/waitingRoom.styles';

import * as React from 'react';
import { useContext, useEffect } from 'react';

import { renderToString } from 'react-dom/server';
import { useTranslation } from 'react-i18next';

import {
	STATUS_CREATED,
	STATUS_PAUSED,
	STATUS_STARTED
} from '../../globalState/interfaces';
import { GlobalComponentContext } from '../../globalState/provider/GlobalComponentContext';
import { LegalLinksContext } from '../../globalState/provider/LegalLinksProvider';
import { ReactComponent as ErrorIllustration } from '../../resources/img/illustrations/not-found.svg';
import { ReactComponent as WaitingIllustration } from '../../resources/img/illustrations/waiting.svg';
import { ReactComponent as WelcomeIllustration } from '../../resources/img/illustrations/welcome.svg';
import { Button, BUTTON_TYPES, ButtonItem } from '../button/Button';
import LegalLinks from '../legalLinks/LegalLinks';
import { StageLayout } from '../stageLayout/StageLayout';
import { Text } from '../text/Text';
import { WaitingRoomContent } from '../waitingRoom/WaitingRoomContent';

export interface WaitingRoomProps {
	confirmed: boolean;
	setConfirmed: Function;
	error?: {
		title: string;
		description?: string;
	};
	status:
		| typeof STATUS_STARTED
		| typeof STATUS_CREATED
		| typeof STATUS_PAUSED;
}

export const WaitingRoom = ({
	confirmed,
	setConfirmed,
	status,
	error
}: WaitingRoomProps) => {
	const { t: translate } = useTranslation();

	const legalLinks = useContext(LegalLinksContext);
	const { Stage } = useContext(GlobalComponentContext);

	const reloadButton: ButtonItem = {
		label: translate('videoConference.waitingroom.errorPage.button'),
		type: BUTTON_TYPES.PRIMARY
	};

	const confirmButton: ButtonItem = {
		label: translate('anonymous.waitingroom.dataProtection.button'),
		type: BUTTON_TYPES.PRIMARY
	};

	const handleReloadButton = () => {
		window.location.reload();
	};

	useEffect(() => {
		const previousTitle = document.title;
		document.title = `${translate(
			'videoConference.waitingroom.title.start'
		)}`;

		return () => {
			document.title = previousTitle;
		};
	}, [translate]);

	const handleConfirmButton = () => {
		setConfirmed(true);
		window.scrollTo(0, 0);
	};

	const getContent = () => {
		if (error) {
			return (
				<WaitingRoomContent
					headlineKey={error.title}
					Illustration={
						<ErrorIllustration className="waitingRoom__waitingIllustration" />
					}
				>
					{error.description && (
						<Text
							type="standard"
							text={translate(error.description)}
						/>
					)}
					<Button
						className="waitingRoom__button"
						buttonHandle={handleReloadButton}
						item={reloadButton}
					/>
				</WaitingRoomContent>
			);
		} else if (!confirmed) {
			return (
				<WaitingRoomContent
					headlineKey="videoConference.waitingroom.dataProtection.headline"
					sublineKey="videoConference.waitingroom.dataProtection.subline"
					textKey="videoConference.waitingroom.dataProtection.description"
					Illustration={<WelcomeIllustration />}
				>
					<Text
						type="standard"
						text={translate(
							'videoConference.waitingroom.dataProtection.label.text',
							{
								interpolation: { escapeValue: false },
								legal_links: renderToString(
									<LegalLinks
										legalLinks={legalLinks}
										filter={(legalLink) =>
											legalLink.registration
										}
									/>
								)
							}
						)}
					/>
					<Button
						className="waitingRoom__button"
						buttonHandle={handleConfirmButton}
						item={confirmButton}
					/>
				</WaitingRoomContent>
			);
		} else if (status === STATUS_PAUSED) {
			return (
				<WaitingRoomContent
					headlineKey="videoConference.waitingroom.paused.headline"
					Illustration={
						<WaitingIllustration className="waitingRoom__waitingIllustration" />
					}
				>
					<Text
						type="standard"
						text={translate(
							'videoConference.waitingroom.paused.subline'
						)}
					/>
				</WaitingRoomContent>
			);
		} else {
			return (
				<WaitingRoomContent
					headlineKey="videoConference.waitingroom.headline"
					Illustration={
						<WaitingIllustration className="waitingRoom__waitingIllustration" />
					}
				>
					<Text
						type="standard"
						text={translate('videoConference.waitingroom.subline')}
					/>
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
		</StageLayout>
	);
};
