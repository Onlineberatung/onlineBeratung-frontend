import clsx from 'clsx';
import * as React from 'react';
import { config } from '../../resources/scripts/config';
import { translate } from '../../utils/translate';
import { Text, TextTypeOptions } from '../text/Text';
import './legalInformationLinks.styles';
// import { Browser } from '@capacitor/browser';

export interface LegalInformationLinksProps {
	className?: string;
	showDivider?: boolean;
	textStyle?: TextTypeOptions;
	hideImprint?: boolean;
}

export const LegalInformationLinks = ({
	className,
	showDivider = true,
	textStyle = 'infoSmall',
	hideImprint = false
}: LegalInformationLinksProps) => {
	return (
		<div className={clsx(className, 'legalInformationLinks')}>
			{/* <button
				type="button"
				onClick={async () => {
					await Browser.open({
						// toolbarColor: '#3f373f',
						url: 'https://www.caritas.de/impressum'
					});
					console.log('funktion wird aufgerufen');
				}}
			> */}
			{!hideImprint && (
				<a href={config.urls.imprint} target="_blank" rel="noreferrer">
					<Text
						className="legalInformationLinks__linkLabel"
						text={translate('login.legal.infoText.impressum')}
						type={textStyle}
					/>
				</a>
			)}
			{!hideImprint && showDivider && (
				<Text
					type={textStyle}
					className="legalInformationLinks__separator"
					text=" | "
				/>
			)}
			<a href={config.urls.privacy} target="_blank" rel="noreferrer">
				<Text
					className="legalInformationLinks__linkLabel"
					text={translate('login.legal.infoText.dataprotection')}
					type={textStyle}
				/>
			</a>
		</div>
	);
};
