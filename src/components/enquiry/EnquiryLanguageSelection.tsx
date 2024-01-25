import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiAgencyLanguages } from '../../api/apiAgencyLanguages';
import {
	getExtendedSession,
	SessionsDataContext,
	LocaleContext
} from '../../globalState';
import { Headline } from '../headline/Headline';
import { isUniqueLanguage } from '../profile/profileHelpers';

import './enquiryLanguageSelection.styles';
import { LanguagesContext } from '../../globalState/provider/LanguagesProvider';
import { useTranslation } from 'react-i18next';
import { useAppConfig } from '../../hooks/useAppConfig';

interface EnquiryLanguageSelectionProps {
	className?: string;
	onSelect: (language: string) => void;
	value: string;
}

export const EnquiryLanguageSelection: React.FC<
	EnquiryLanguageSelectionProps
> = ({ className = '', onSelect, value }) => {
	const { t: translate } = useTranslation();
	const settings = useAppConfig();
	const { sessions, ready } = useContext(SessionsDataContext);
	const { fixed: fixedLanguages } = useContext(LanguagesContext);
	const { sessionId: sessionIdFromParam } = useParams<{
		sessionId: string;
	}>();
	const { locale } = useContext(LocaleContext);

	const [languages, setLanguages] = useState([]);

	useEffect(() => {
		if (!ready) {
			return;
		}

		// async wrapper
		const getLanguagesFromApi = new Promise<string[]>((resolve) => {
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

			if (agencyId === null) {
				resolve([]);
			}

			if (languages.length === 0) {
				apiAgencyLanguages(
					agencyId,
					settings?.multitenancyWithSingleDomainEnabled
				)
					.then((response) => {
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
						resolve(
							[
								...fixedLanguages,
								...sortedResponseLanguages
							].filter(isUniqueLanguage)
						);
					})
					.catch(() => {
						resolve([...fixedLanguages]);
						/* intentional, falls back to fixed languages */
					});
			}
		});

		getLanguagesFromApi.then((sortedLanguages) => {
			if (sortedLanguages.includes(locale)) {
				onSelect(locale);
			}
			setLanguages(sortedLanguages);
		});
	}, [
		sessions,
		ready,
		sessionIdFromParam,
		fixedLanguages,
		translate,
		settings?.multitenancyWithSingleDomainEnabled,
		locale,
		onSelect,
		languages
	]);

	const mapLanguages = (isoCode) => (
		<span
			key={isoCode}
			onClick={() => onSelect(isoCode)}
			className={`enquiryLanguageSelection__tab ${
				value === isoCode
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
