import React, { useContext, useEffect, useState } from 'react';
import { apiAgencyLanguages } from '../../api/apiAgencyLanguages';
import {
	ActiveSessionGroupIdContext,
	getActiveSession,
	SessionsDataContext
} from '../../globalState';
import { translate } from '../../utils/translate';
import { Headline } from '../headline/Headline';

import './enquiryLanguageSelection.styles';

interface EnquiryLanguageSelectionProps {
	className?: string;
	fixedLanguages: string[];
	handleSelection: (language: string) => void;
}

export const EnquiryLanguageSelection: React.FC<EnquiryLanguageSelectionProps> =
	({ className = '', fixedLanguages, handleSelection }) => {
		const { sessionsData } = useContext(SessionsDataContext);
		const { activeSessionGroupId } = useContext(
			ActiveSessionGroupIdContext
		);

		const [selectedLanguage, setSelectedLanguage] = useState(
			fixedLanguages[0]
		);
		const [languages, setLanguages] = useState([...fixedLanguages]);

		useEffect(() => {
			// async wrapper
			const getLanguagesFromApi = async () => {
				const activeSession = getActiveSession(
					activeSessionGroupId,
					sessionsData
				);

				if (activeSession) {
					const agencyId = activeSession.agency.id;

					const response = await apiAgencyLanguages(agencyId).catch(
						() => {
							/* intentional, falls back to fixed languages */
						}
					);

					if (response) {
						setLanguages(response.languages);
					}
				}
			};

			getLanguagesFromApi();
		}, [sessionsData, activeSessionGroupId]);

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
