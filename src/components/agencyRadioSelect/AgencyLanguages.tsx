import React, { useContext, useEffect, useState } from 'react';
import { apiAgencyLanguages } from '../../api/apiAgencyLanguages';
import { isUniqueLanguage } from '../profile/profileHelpers';
import './agencyLanguages.styles';
import { LanguagesContext } from '../../globalState/provider/LanguagesProvider';
import { useTranslation } from 'react-i18next';
import { useAppConfig } from '../../hooks/useAppConfig';

interface AgencyLanguagesProps {
	agencyId: number;
}

export const AgencyLanguages = ({ agencyId }: AgencyLanguagesProps) => {
	const { t: translate } = useTranslation();
	const { fixed: fixedLanguages } = useContext(LanguagesContext);
	const settings = useAppConfig();
	const [isAllShown, setIsAllShown] = useState(false);
	const [languages, setLanguages] = useState<string[]>([...fixedLanguages]);
	const languagesSelection = languages.slice(0, 2);
	const difference = languages.length - languagesSelection.length;

	useEffect(() => {
		const getLanguagesFromApi = async () => {
			const response = await apiAgencyLanguages(
				agencyId,
				settings?.multitenancyWithSingleDomainEnabled
			).catch(() => {
				/* intentional, falls back to fixed languages */
			});

			if (response) {
				const sortedLanguages = [
					...fixedLanguages,
					...response.languages
				].filter(isUniqueLanguage);
				setLanguages(sortedLanguages);
			}
		};

		getLanguagesFromApi();
	}, [
		agencyId,
		fixedLanguages,
		settings?.multitenancyWithSingleDomainEnabled
	]);

	const mapLanguages = (isoCode) => (
		<span key={isoCode}>
			{translate(`languages.${isoCode}`)} ({isoCode.toUpperCase()})
		</span>
	);

	if (!languages.length) return null;

	return (
		<div className="agencyLanguages">
			<p>{translate('registration.agencySelection.languages.info')}</p>
			{isAllShown || difference < 1 ? (
				<div>{languages.map(mapLanguages)}</div>
			) : (
				<div>
					{languagesSelection.map(mapLanguages)}
					<button
						className="agencyLanguages__more"
						onClick={(event) => {
							event.preventDefault();
							setIsAllShown(true);
						}}
						tabIndex={0}
						onKeyUp={(event) => {
							event.preventDefault();
							if (event.key === 'Enter') {
								setIsAllShown(true);
							}
						}}
					>
						{`+${difference} ${translate(
							'registration.agencySelection.languages.more'
						)}`}
					</button>
				</div>
			)}
		</div>
	);
};
