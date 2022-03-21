import React, { useCallback, useContext } from 'react';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import { ReactComponent as NewWindow } from '../../resources/img/icons/new-window.svg';
import { ReactComponent as CopyIcon } from '../../resources/img/icons/documents.svg';
import ChromeLogo from '../../resources/img/images/google_chrome.png';
import EdgeLogo from '../../resources/img/images/microsoft_edge.png';
import './help.styles.scss';
import { translate } from '../../utils/translate';
import { copyTextToClipboard } from '../../utils/clipboardHelpers';
import { config } from '../../resources/scripts/config';
import {
	NotificationsContext,
	NOTIFICATION_TYPE_SUCCESS
} from '../../globalState';

interface HelpProps {}
export const Help: React.FC<HelpProps> = () => {
	const { addNotification } = useContext(NotificationsContext);

	const copyLoginLink = useCallback(async () => {
		await copyTextToClipboard(`${config.urls.toLogin}`, () => {
			addNotification({
				notificationType: NOTIFICATION_TYPE_SUCCESS,
				title: translate('help.videoCall.loginLink.notification.title'),
				text: translate('help.videoCall.loginLink.notification.text')
			});
		});
	}, [addNotification]);

	return (
		<div className="help">
			<div className="help__top">
				<Headline
					text={translate('help.videoCall.headline')}
					semanticLevel="5"
				/>
				<Text
					text={translate('help.videoCall.intro')}
					type="standard"
					className="tertiary"
				/>
				<div className="help__browser">
					<div>
						<img
							src={ChromeLogo}
							alt={translate('help.googleChrome')}
						/>
						<a
							href="https://www.google.com/chrome/"
							target="_blank"
							rel="noreferrer"
						>
							<NewWindow /> {translate('help.googleChrome')}
						</a>
					</div>
					<div>
						<img src={EdgeLogo} alt={translate('help.msEdge')} />
						<a
							href="https://www.microsoft.com/edge"
							target="_blank"
							rel="noreferrer"
						>
							<NewWindow /> {translate('help.msEdge')}
						</a>
					</div>
				</div>
			</div>
			<div className="help__mid">
				<Headline
					text={translate('help.videoCall.steps')}
					semanticLevel="5"
				/>
				<ol className="tertiary">
					<li>
						{translate('help.videoCall.steps.1.1')}
						<a
							href="https://www.google.com/chrome/"
							target="_blank"
							rel="noreferrer"
						>
							{translate('help.googleChrome')}
						</a>
						{translate('help.videoCall.steps.1.2')}
						<a
							href="https://www.microsoft.com/edge"
							target="_blank"
							rel="noreferrer"
						>
							{translate('help.msEdge')}
						</a>
						.
					</li>
					<li>{translate('help.videoCall.steps.2')}</li>
					<li>{translate('help.videoCall.steps.3')}</li>
					<li>
						{translate('help.videoCall.steps.4')}
						<span
							className="help__copyLink"
							role="button"
							onClick={copyLoginLink}
							title={translate('help.videoCall.loginLink.title')}
						>
							<CopyIcon className={`copy icn--s`} />{' '}
							{translate('help.videoCall.loginLink.text')}
						</span>
					</li>
					<li>{translate('help.videoCall.steps.5')}</li>
					<li>{translate('help.videoCall.steps.6')}</li>
				</ol>
			</div>
			<div className="help__bottom">
				<Headline
					text="Sie haben bereits Google Chrome oder Microsoft Edge?"
					semanticLevel="5"
				/>
				<ol className="tertiary">
					<li>
						{translate('help.videoCall.steps.4')}
						<span
							className="help__copyLink"
							role="button"
							onClick={copyLoginLink}
							title={translate('help.videoCall.loginLink.title')}
						>
							<CopyIcon className={`copy icn--s`} />{' '}
							{translate('help.videoCall.loginLink.text')}
						</span>
					</li>
					<li>{translate('help.videoCall.steps.5')}</li>
					<li>{translate('help.videoCall.steps.6')}</li>
				</ol>
			</div>
		</div>
	);
};
