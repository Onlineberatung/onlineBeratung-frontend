import React from 'react';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import { ReactComponent as NewWindowIcon } from '../../resources/img/icons/new-window.svg';
import ChromeLogo from '../../resources/img/images/google_chrome.png';
import EdgeLogo from '../../resources/img/images/microsoft_edge.png';
import './help.styles.scss';
import { translate } from '../../utils/translate';

interface HelpProps {}
export const Help: React.FC<HelpProps> = () => {
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
							<NewWindowIcon /> {translate('help.googleChrome')}
						</a>
					</div>
					<div>
						<img src={EdgeLogo} alt={translate('help.msEdge')} />
						<a
							href="https://www.microsoft.com/edge"
							target="_blank"
							rel="noreferrer"
						>
							<NewWindowIcon /> {translate('help.msEdge')}
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
						{/* TODO */}
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
						{/* TODO */}
					</li>
					<li>{translate('help.videoCall.steps.5')}</li>
					<li>{translate('help.videoCall.steps.6')}</li>
				</ol>
			</div>
		</div>
	);
};
