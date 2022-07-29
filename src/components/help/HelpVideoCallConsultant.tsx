import React, { useContext } from 'react';
import { translate } from '../../utils/translate';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import { ReactComponent as NewWindow } from '../../resources/img/icons/new-window.svg';
import { ReactComponent as CopyIcon } from '../../resources/img/icons/documents.svg';
import ChromeLogo from '../../resources/img/images/google_chrome.png';
import EdgeLogo from '../../resources/img/images/microsoft_edge.png';
import { UserDataContext } from '../../globalState';

interface HelpVideoCallConsultantProps {
	copyLoginLink: Function;
}

export const HelpVideoCallConsultant: React.FC<HelpVideoCallConsultantProps> =
	({ copyLoginLink }) => {
		const { userData } = useContext(UserDataContext);

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
						text={
							userData.e2eEncryptionEnabled
								? translate(
										'help.videoCall.consultant.headline'
								  )
								: translate(
										'help.videoCall.asker.steps.headline.1'
								  )
						}
						semanticLevel="5"
					/>
					<Text
						text={
							userData.e2eEncryptionEnabled
								? translate('help.videoCall.consultant.intro')
								: ''
						}
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
				</div>
				<div className="help__mid">
					<Headline
						text={translate(
							'help.videoCall.consultant.steps.headline.1'
						)}
						semanticLevel="5"
					/>
					<ol className="tertiary">
						<li>
							{translate('help.videoCall.consultant.steps.1.1')}
							<a
								href="https://www.google.com/chrome/"
								target="_blank"
								rel="noreferrer"
							>
								{translate('help.googleChrome')}
							</a>
							{translate('help.videoCall.consultant.steps.1.2')}
							<a
								href="https://www.microsoft.com/edge"
								target="_blank"
								rel="noreferrer"
							>
								{translate('help.msEdge')}
							</a>
							.
						</li>
						<li>
							{translate('help.videoCall.consultant.steps.2')}
						</li>
						<li>
							{translate('help.videoCall.consultant.steps.3')}
						</li>
						<li>
							{translate('help.videoCall.consultant.steps.4')}
							{copyLink}
						</li>
						<li>
							{translate('help.videoCall.consultant.steps.5')}
						</li>
						<li>
							{translate('help.videoCall.consultant.steps.6')}
						</li>
					</ol>
				</div>
				<div className="help__bottom">
					<Headline
						text={translate(
							'help.videoCall.consultant.steps.headline.2'
						)}
						semanticLevel="5"
					/>
					<ol className="tertiary">
						<li>
							{translate('help.videoCall.consultant.steps.4')}
							{copyLink}
						</li>
						<li>
							{translate('help.videoCall.consultant.steps.5')}
						</li>
						<li>
							{translate('help.videoCall.consultant.steps.6')}
						</li>
					</ol>
				</div>
			</>
		);
	};
