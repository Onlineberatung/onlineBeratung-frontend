import React from 'react';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import { ReactComponent as NewWindow } from '../../resources/img/icons/new-window.svg';
import { ReactComponent as CopyIcon } from '../../resources/img/icons/documents.svg';
import ChromeLogo from '../../resources/img/images/google_chrome.png';
import EdgeLogo from '../../resources/img/images/microsoft_edge.png';
import SafariLogo from '../../resources/img/images/safari.png';
import { useTranslation } from 'react-i18next';

interface HelpVideoCallProps {
	copyLoginLink: Function;
	consultant: boolean;
}

export const BrowserList: React.FC = () => {
	const { t: translate } = useTranslation();
	return (
		<div className="browser-list">
			<div>
				<img
					src={ChromeLogo}
					alt={translate('help.googleChrome')}
					title={translate('help.googleChrome')}
				/>
				<a
					href="https://www.google.com/chrome/"
					target="_blank"
					rel="noreferrer"
					className="button-as-link"
				>
					<NewWindow
						title={translate('help.openInNewTab')}
						aria-label={translate('help.openInNewTab')}
					/>{' '}
					{translate('help.googleChrome')}
				</a>
			</div>
			<div>
				<img
					src={EdgeLogo}
					alt={translate('help.msEdge')}
					title={translate('help.msEdge')}
				/>
				<a
					href="https://www.microsoft.com/edge"
					target="_blank"
					rel="noreferrer"
					className="button-as-link"
				>
					<NewWindow
						title={translate('help.openInNewTab')}
						aria-label={translate('help.openInNewTab')}
					/>{' '}
					{translate('help.msEdge')}
				</a>
			</div>
			<div>
				<img
					src={SafariLogo}
					alt={translate('help.safari')}
					title={translate('help.safari')}
				/>
				<a
					href="https://www.apple.com/de/safari/"
					target="_blank"
					rel="noreferrer"
					className="button-as-link"
				>
					<NewWindow
						title={translate('help.openInNewTab')}
						aria-label={translate('help.openInNewTab')}
					/>{' '}
					{translate('help.safari')}
				</a>
			</div>
		</div>
	);
};

export const HelpVideoCall: React.FC<HelpVideoCallProps> = ({
	copyLoginLink,
	consultant
}) => {
	const { t: translate } = useTranslation();
	const translationPrefix = `help.videoCall.${
		consultant ? 'consultant' : 'asker'
	}`;

	const copyLink = (
		<button
			className="help__copyLink button-as-link"
			type="button"
			tabIndex={0}
			onClick={() => {
				copyLoginLink();
			}}
			title={translate('help.videoCall.loginLink.title')}
		>
			<CopyIcon className={`copy icn--s`} />{' '}
			{translate('help.videoCall.loginLink.text')}
		</button>
	);

	return (
		<>
			<div className="help__top">
				<Headline
					text={translate(`${translationPrefix}.headline`)}
					semanticLevel="5"
				/>
				<Text
					text={translate(`${translationPrefix}.intro`)}
					type="standard"
					className="tertiary"
				/>
			</div>
			<BrowserList></BrowserList>
			<div className="help__mid">
				<Headline
					text={translate(`${translationPrefix}.steps.headline.1`)}
					semanticLevel="5"
				/>
				<ol className="tertiary">
					<li>
						{translate(`${translationPrefix}.steps.1.1`)}
						<a
							href="https://www.google.com/chrome/"
							target="_blank"
							rel="noreferrer"
							className="button-as-link"
						>
							{translate('help.googleChrome')}
						</a>
						{translate(`${translationPrefix}.steps.1.2`)}
						<a
							href="https://www.microsoft.com/edge"
							target="_blank"
							rel="noreferrer"
							className="button-as-link"
						>
							{translate('help.msEdge')}
						</a>
						{translate(`${translationPrefix}.steps.1.2`)}
						<a
							href="https://www.apple.com/de/safari/"
							target="_blank"
							rel="noreferrer"
							className="button-as-link"
						>
							{translate('help.safari')}
						</a>
						{translate(`${translationPrefix}.steps.1.3`)}.
					</li>
					<li>{translate(`${translationPrefix}.steps.2`)}</li>
					<li>{translate(`${translationPrefix}.steps.3`)}</li>
					<li>
						{translate(`${translationPrefix}.steps.4.1`)}
						{copyLink}
					</li>
					<li>{translate(`${translationPrefix}.steps.5`)}</li>
					<li>{translate(`${translationPrefix}.steps.6`)}</li>
				</ol>
			</div>
			<div className="help__bottom">
				<Headline
					text={translate(`${translationPrefix}.steps.headline.2`)}
					semanticLevel="5"
				/>
				<ol className="tertiary">
					<li>
						{translate(`${translationPrefix}.steps.4.2`)}
						{copyLink}
					</li>
					<li>{translate(`${translationPrefix}.steps.5`)}</li>
					<li>{translate(`${translationPrefix}.steps.6`)}</li>
				</ol>
			</div>
		</>
	);
};
