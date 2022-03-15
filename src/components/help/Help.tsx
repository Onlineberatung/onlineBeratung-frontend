import React, { ComponentType } from 'react';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import { ReactComponent as NewWindowIcon } from '../../resources/img/icons/new-window.svg';
import ChromeLogo from '../../resources/img/images/google_chrome.png';
import EdgeLogo from '../../resources/img/images/microsoft_edge.png';
import { LegalInformationLinksProps } from '../login/LegalInformationLinks';
import { StageProps } from '../stage/stage';
import './help.styles.scss';

interface HelpProps {
	legalComponent: ComponentType<LegalInformationLinksProps>;
	stageComponent: ComponentType<StageProps>;
}
export const Help: React.FC<HelpProps> = ({
	legalComponent,
	stageComponent: Stage
}) => {
	return (
		<div className="help">
			<div className="help__top">
				<Headline text="Video-Call" semanticLevel="5" />
				<Text
					text="Um einen Video-Call starten zu können, müssen Sie sich über Google Chrome oder Microsoft Edge bei der Online-Beratung anmelden. Somit kann der Video-Call Ende-zu-Ende verschlüsselt werden und Sie können starten"
					type="standard"
				/>
				<div className="help__browser">
					<div>
						<img src={ChromeLogo} alt="Google Chrome" />
						<a
							href="https://www.google.com/chrome/"
							target="_blank"
							rel="noreferrer"
						>
							<NewWindowIcon /> Google Chrome
						</a>
					</div>
					<div>
						<img src={EdgeLogo} alt="Microsoft Edge" />
						<a
							href="https://www.microsoft.com/edge"
							target="_blank"
							rel="noreferrer"
						>
							<NewWindowIcon /> Microsoft Edge
						</a>
					</div>
				</div>
			</div>
			<div className="help__mid">
				<Headline
					text="Schritt für Schritt Anleitung"
					semanticLevel="5"
				/>
				<ol>
					<li>
						Folgen Sie dem Link zu{' '}
						<a
							href="https://www.google.com/chrome/"
							target="_blank"
							rel="noreferrer"
						>
							Google Chrome
						</a>{' '}
						oder{' '}
						<a
							href="https://www.microsoft.com/edge"
							target="_blank"
							rel="noreferrer"
						>
							Microsoft Edge
						</a>
						.
					</li>
					<li>
						Laden Sie sich Chrome oder Edge herunter. Dafür brauchen
						Sie möglicherweise die Unterstützung Ihrer EDV.
					</li>
					<li>
						Installieren Sie Chrome oder Edge auf Ihrem
						PC/Laptop/Tablet/ Smartphone.
					</li>
					<li>
						Öffnen Sie nun über Chrome oder Edge die
						Online-Beratung. {/* TODO */}
					</li>
					<li>Melden Sie sich bei der Online-Beratung an.</li>
					<li>Nun können Sie den Video-Call starten.</li>
				</ol>
			</div>
			<div className="help__bottom">
				<Headline
					text="Sie haben bereits Google Chrome oder Microsoft Edge?"
					semanticLevel="5"
				/>
				<ol>
					<li>
						Öffnen Sie nun über Chrome oder Edge die
						Online-Beratung. {/* TODO */}
					</li>
					<li>Melden Sie sich bei der Online-Beratung an.</li>
					<li>Nun können Sie den Video-Call starten.</li>
				</ol>
			</div>
		</div>
	);
};
