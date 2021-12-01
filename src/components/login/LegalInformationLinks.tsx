import clsx from 'clsx';
import * as React from 'react';
import { config } from '../../resources/scripts/config';
import { translate } from '../../utils/translate';
import { Text } from '../text/Text';
import './legalInformationLinks.styles';
import { Browser } from '@capacitor/browser';

interface LegalInformationLinksProps {
	className?: string;
}

export const LegalInformationLinks = ({
	className
}: LegalInformationLinksProps) => {
	return (
		<div className={clsx(className, 'legalInformationLinks')}>
			<button
				type="button"
				onClick={async () => {
					await Browser.open({
						// toolbarColor: '#3f373f',
						url: 'https://www.caritas.de/impressum'
					});
					console.log('funktion wird aufgerufen');
				}}
			>
				<Text
					className="legalInformationLinks__linkLabel"
					text={translate('login.legal.infoText.impressum')}
					type="infoSmall"
				/>
			</button>
			<Text
				type="infoSmall"
				className="legalInformationLinks__separator"
				text=" | "
			/>
			<a href={config.urls.privacy}>
				<Text
					className="legalInformationLinks__linkLabel"
					text={translate('login.legal.infoText.dataprotection')}
					type="infoSmall"
				/>
			</a>
		</div>
	);
};
