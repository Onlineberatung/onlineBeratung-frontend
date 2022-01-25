import React, { useState } from 'react';
import { translate } from '../../utils/translate';
import { Headline } from '../headline/Headline';

import './enquiryLanguageSelection.styles';

interface EnquiryLanguageSelectionProps {
	className?: string;
	languages: string[];
	defaultLanguage: string;
	handleSelection: (language: string) => void;
}

export const EnquiryLanguageSelection: React.FC<EnquiryLanguageSelectionProps> =
	({
		className = '',
		languages,
		defaultLanguage = 'de',
		handleSelection
	}) => {
		const [selectedLanguage, setSelectedLanguage] =
			useState(defaultLanguage);

		const selectLanguage = (isoCode) => {
			setSelectedLanguage(isoCode);
			handleSelection(isoCode);
		};

		const mapLanguages = (isoCode) => (
			<span
				key={isoCode}
				onClick={() => selectLanguage(isoCode)}
				className={`enquiryLanguageSelection__tab ${
					selectedLanguage === isoCode
						? 'enquiryLanguageSelection__tab--selected'
						: ''
				}`}
			>
				{translate(`languages.${isoCode}`)} ({isoCode.toUpperCase()})
			</span>
		);

		return (
			<div className={`enquiryLanguageSelection ${className}`}>
				<Headline
					semanticLevel="5"
					text={translate('enquiry.language.selection.headline')}
				/>
				<div className="enquiryLanguageSelection__tabs">
					{languages.map(mapLanguages)}
				</div>
			</div>
		);
	};
