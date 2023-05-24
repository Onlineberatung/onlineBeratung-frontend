import { Typography } from '@mui/material';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiAgencyLanguages } from '../../../api/apiAgencyLanguages';
import { LanguagesContext } from '../../../globalState/provider/LanguagesProvider';

interface AgencyLanguagesProps {
	agencyId?: number;
}

export const AgencyLanguages = ({ agencyId }: AgencyLanguagesProps) => {
	const { t: translate } = useTranslation();
	const [languages, setLanguages] = useState<string[]>(['de']);
	const { fixed: fixedLanguages } = React.useContext(LanguagesContext);

	const getLanguages = async (agencyId: number) => {
		await apiAgencyLanguages(agencyId, false).then((res) => {
			const allLanguages = [...fixedLanguages, ...res.languages];
			setLanguages(
				allLanguages
					.filter((element, index) => {
						return allLanguages.indexOf(element) === index;
					})
					.sort()
			);
		});
	};

	useEffect(() => {
		if (agencyId !== undefined) {
			getLanguages(agencyId);
		}
	}, [agencyId]);

	return (
		<Typography variant="body2" sx={{ color: 'info.light' }}>
			{languages.map((lang, index) => {
				return `${index !== 0 ? ' |' : ''} ${translate(
					`languages.${lang}`
				)} (${lang.toUpperCase()})`;
			})}
		</Typography>
	);
};
