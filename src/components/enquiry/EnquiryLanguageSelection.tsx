import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiAgencyLanguages } from '../../api/apiAgencyLanguages';
import { getExtendedSession, SessionsDataContext } from '../../globalState';
import { Headline } from '../headline/Headline';
import { isUniqueLanguage } from '../profile/profileHelpers';

import './enquiryLanguageSelection.styles';
import { FixedLanguagesContext } from '../../globalState/provider/FixedLanguagesProvider';
import { useTranslation } from 'react-i18next';

interface EnquiryLanguageSelectionProps {
	className?: string;
	handleSelection: (language: string) => void;
}

export const EnquiryLanguageSelection: React.FC<EnquiryLanguageSelectionProps> =
	({ className = '', handleSelection }) => {
		const { t: translate } = useTranslation();
		const { sessions, ready } = useContext(SessionsDataContext);
		const fixedLanguages = useContext(FixedLanguagesContext);
		const { sessionId: sessionIdFromParam } = useParams();

		const [selectedLanguage, setSelectedLanguage] = useState(
			fixedLanguages[0]
		);
		const [languages, setLanguages] = useState([...fixedLanguages]);

		useEffect(() => {
			if (!ready) {
				return;
			}

			// async wrapper
			const getLanguagesFromApi = async () => {
				const activeSession = getExtendedSession(
					sessionIdFromParam,
					sessions
				);

				let agencyId = null;
				if (activeSession) {
					agencyId = activeSession.agency.id;
				} else if (sessions.length === 1) {
					agencyId = sessions[0].agency.id;
				}

				if (!agencyId) {
					return;
				}

				const response = await apiAgencyLanguages(agencyId).catch(
					() => {
						/* intentional, falls back to fixed languages */
					}
				);

				if (!response) {
					return;
				}

				const sortByTranslation = (a, b) => {
					if (
						translate(`languages.${a}`) >
						translate(`languages.${b}`)
					)
						return 1;
					if (
						translate(`languages.${a}`) <
						translate(`languages.${b}`)
					)
						return -1;
					return 0;
				};

				const sortedResponseLanguages = response.languages
					.slice()
					.sort(sortByTranslation);
				const sortedLanguages = [
					...fixedLanguages,
					...sortedResponseLanguages
				].filter(isUniqueLanguage);
				setLanguages(sortedLanguages);
			};

			getLanguagesFromApi();
		}, [sessions, ready, sessionIdFromParam, fixedLanguages, translate]);

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

		if (languages.length <= 1) {
			return null;
		}

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
