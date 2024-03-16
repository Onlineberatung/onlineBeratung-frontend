import * as React from 'react';
import { useState, useEffect, VFC, useContext } from 'react';
import { AgencySelectionResults } from './AgencySelectionResults';
import { apiAgencySelection } from '../../../../api';
import { RegistrationContext } from '../../../../globalState';
import { AgencyDataInterface } from '../../../../globalState/interfaces';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const AgencySelection: VFC<{
	nextStepUrl: string;
	onNextClick(): void;
}> = ({ nextStepUrl, onNextClick }) => {
	const {
		sessionStorageRegistrationData,
		isConsultantLink,
		consultant,
		setDataForSessionStorage
	} = useContext(RegistrationContext);

	const { t } = useTranslation();
	const [headlineZipcode, setHeadlineZipcode] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [results, setResults] = useState<AgencyDataInterface[] | undefined>(
		undefined
	);
	useEffect(() => {
		if (isConsultantLink) {
			setResults(
				consultant?.agencies?.filter((agency) =>
					agency?.topicIds?.includes(
						sessionStorageRegistrationData?.mainTopicId
					)
				)
			);
		} else if (sessionStorageRegistrationData?.zipcode?.length === 5) {
			setHeadlineZipcode(sessionStorageRegistrationData.zipcode);
			setResults(undefined);
			(async () => {
				setIsLoading(true);
				try {
					const agencyResponse = await apiAgencySelection({
						postcode: sessionStorageRegistrationData.zipcode,
						// We will keep consultingTypeId identical to mainTopicId
						consultingType:
							sessionStorageRegistrationData.mainTopicId ||
							undefined,
						topicId:
							sessionStorageRegistrationData.mainTopicId ||
							undefined
					});

					setResults(agencyResponse);
					if (
						agencyResponse.every(
							(agency) =>
								agency.id !==
								sessionStorageRegistrationData.agencyId
						)
					) {
						setDataForSessionStorage({ agencyId: undefined });
					}
				} catch {
					setResults([]);
				}
				setIsLoading(false);
			})();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sessionStorageRegistrationData, consultant]);

	return (
		<>
			<Typography variant="h3">
				{(isConsultantLink && consultant?.agencies?.length === 1) ||
				results?.length === 1
					? t('registration.agency.consultantheadline')
					: t('registration.agency.headline')}
			</Typography>
			<AgencySelectionResults
				nextStepUrl={nextStepUrl}
				onNextClick={onNextClick}
				zipcode={headlineZipcode}
				isLoading={isLoading}
				results={results}
			/>
		</>
	);
};
