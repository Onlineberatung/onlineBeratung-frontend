import { Typography } from '@mui/material';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiAgencyLanguages } from '../../../../api/apiAgencyLanguages';
import { LanguagesContext } from '../../../../globalState/provider/LanguagesProvider';

interface AgencyLanguagesProps {
	agencyId?: number;
}

export const AgencyLanguages = ({ agencyId }: AgencyLanguagesProps) => {
	const { t } = useTranslation();
	const [languages, setLanguages] = useState<string[]>(['de']);
	const { fixed: fixedLanguages } = React.useContext(LanguagesContext);

	useEffect(() => {
		if (agencyId !== undefined) {
			apiAgencyLanguages(agencyId, false).then((res) => {
				const allLanguages = [...fixedLanguages, ...res.languages];
				setLanguages(
					allLanguages
						.filter((element, index) => {
							return allLanguages.indexOf(element) === index;
						})
						.sort()
				);
			});
		}
	}, [agencyId, fixedLanguages]);

	return (
		<Typography variant="body2" sx={{ color: 'info.light' }}>
			{languages.map(
				(lang, index) =>
					`${index !== 0 ? ' |' : ''} ${t(
						`languages.${lang}`
					)} (${lang.toUpperCase()})`
			)}
		</Typography>
	);
};
