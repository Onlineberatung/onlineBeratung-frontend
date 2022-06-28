import React from 'react';
import { translate } from '../../utils/translate';
import { Headline } from '../headline/Headline';
import { ReactComponent as NewWindow } from '../../resources/img/icons/new-window.svg';
import { ReactComponent as CopyIcon } from '../../resources/img/icons/documents.svg';
import ChromeLogo from '../../resources/img/images/google_chrome.png';
import EdgeLogo from '../../resources/img/images/microsoft_edge.png';

interface HelpVideoCallAskerProps {
	copyLoginLink: Function;
}

export const HelpVideoCallAsker: React.FC<HelpVideoCallAskerProps> = ({
	copyLoginLink
}) => {
	return (
		<>
			<div className="help__top">
				<Headline
					text={translate('help.videoCall.asker.steps.headline.1')}
					semanticLevel="5"
				/>
				<ol className="tertiary">
					<li>
						{translate('help.videoCall.asker.steps.1')}
						<div className="help__browser help__browser--asker">
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
									<NewWindow />{' '}
									{translate('help.googleChrome')}
								</a>
							</div>
							<div>
								<img
									src={EdgeLogo}
									alt={translate('help.msEdge')}
								/>
								<a
									href="https://www.microsoft.com/edge"
									target="_blank"
									rel="noreferrer"
								>
									<NewWindow /> {translate('help.msEdge')}
								</a>
							</div>
						</div>
					</li>
					<li>{translate('help.videoCall.asker.steps.2')}</li>
					<li>{translate('help.videoCall.asker.steps.3')}</li>
					<li>
						{translate('help.videoCall.asker.steps.4')}
						<span
							className="help__copyLink"
							role="button"
							onClick={() => {
								copyLoginLink();
							}}
							title={translate('help.videoCall.loginLink.title')}
						>
							<CopyIcon className={`copy icn--s`} />{' '}
							{translate('help.videoCall.loginLink.text')}
						</span>
					</li>
					<li>{translate('help.videoCall.asker.steps.5')}</li>
					<li>{translate('help.videoCall.asker.steps.6')}</li>
				</ol>
			</div>
			<div className="help__bottom">
				<Headline
					text={translate('help.videoCall.asker.steps.headline.2')}
					semanticLevel="5"
				/>
				<ol className="tertiary">
					<li>
						{translate('help.videoCall.asker.steps.4')}
						<span
							className="help__copyLink"
							role="button"
							onClick={() => {
								copyLoginLink();
							}}
							title={translate('help.videoCall.loginLink.title')}
						>
							<CopyIcon className={`copy icn--s`} />{' '}
							{translate('help.videoCall.loginLink.text')}
						</span>
					</li>
					<li>{translate('help.videoCall.asker.steps.5')}</li>
					<li>{translate('help.videoCall.asker.steps.6')}</li>
				</ol>
			</div>
		</>
	);
};
