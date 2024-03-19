import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { AgencyDataInterface } from '../../../../globalState/interfaces';

const PreselectedAgency = ({
	hasError,
	agency
}: {
	hasError: boolean;
	agency: AgencyDataInterface;
}) => {
	const { t } = useTranslation();

	if (!hasError && !agency) {
		return null;
	}

	return (
		<>
			<Typography
				sx={{
					fontWeight: '600',
					mb: '8px'
				}}
			>
				{t('registration.agency.summary')}
			</Typography>
			{hasError ? (
				<Typography>
					<>
						<ReportProblemIcon
							aria-hidden="true"
							color="inherit"
							sx={{
								width: '20px',
								height: '20px',
								mr: '8px',
								color: '#FF9F00'
							}}
						/>
						{t('registration.errors.aid')}
					</>
				</Typography>
			) : (
				<Typography>{agency.name}</Typography>
			)}
		</>
	);
};

export default PreselectedAgency;
