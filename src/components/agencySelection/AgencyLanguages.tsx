import React, { useContext, useEffect, useState } from 'react';
import { apiAgencyLanguages } from '../../api/apiAgencyLanguages';
import { translate } from '../../utils/translate';
import { isUniqueLanguage } from '../profile/profileHelpers';
import './agencyLanguages.styles';
import { FixedLanguagesContext } from '../../globalState/provider/FixedLanguagesProvider';

interface AgencyLanguagesProps {
	agencyId: number;
}

export const AgencyLanguages: React.FC<AgencyLanguagesProps> = ({
	agencyId
}) => {
	const fixedLanguages = useContext(FixedLanguagesContext);
	const [isAllShown, setIsAllShown] = useState(false);
	const [languages, setLanguages] = useState<string[]>([...fixedLanguages]);

	useEffect(() => {
		// async wrapper
		const getLanguagesFromApi = async () => {
			const response = await apiAgencyLanguages(agencyId).catch(() => {
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
	}, [agencyId, fixedLanguages]);

	const languagesSelection = languages.slice(0, 2);
	const difference = languages.length - languagesSelection.length;

	const mapLanguages = (isoCode) => (
		<span key={isoCode}>
			{translate(`languages.${isoCode}`)} ({isoCode.toUpperCase()})
		</span>
	);

	if (languages.length > 0) {
		return (
			<div className="agencyLanguages">
				<p>
					{translate('registration.agencySelection.languages.info')}
				</p>
				{isAllShown || difference < 1 ? (
					<div>{languages.map(mapLanguages)}</div>
				) : (
					<div>
						{languagesSelection.map(mapLanguages)}
						<span
							className="agencyLanguages__more"
							onClick={() => {
								setIsAllShown(true);
							}}
						>
							{`+${difference} ${translate(
								'registration.agencySelection.languages.more'
							)}`}
						</span>
					</div>
				)}
			</div>
		);
	} else {
		return <></>;
	}
};
