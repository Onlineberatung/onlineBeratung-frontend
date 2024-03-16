import * as React from 'react';
import { useContext, useState, useEffect, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import { RegistrationContext } from '../../../../globalState';
import { PreselectionDrawer } from '../preselectionDrawer/preselectionDrawer';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { useResponsive } from '../../../../hooks/useResponsive';

export const PreselectionBox: VFC<{
	hasDrawer?: boolean;
}> = ({ hasDrawer = false }) => {
	const {
		preselectedAgency,
		preselectedTopicName,
		isConsultantLink,
		hasConsultantError,
		hasTopicError,
		hasAgencyError,
		preselectedData
	} = useContext(RegistrationContext);
	const { t } = useTranslation();
	const [topicName, setTopicName] = useState('-');
	const [agencyName, setAgencyName] = useState('-');
	const { fromM } = useResponsive();

	useEffect(() => {
		if (preselectedTopicName) {
			setTopicName(preselectedTopicName);
		} else {
			setTopicName('-');
		}
		if (preselectedAgency) {
			setAgencyName(preselectedAgency?.name);
		} else {
			setAgencyName('-');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [preselectedAgency, preselectedTopicName]);

	if (
		!(preselectedData.includes('tid') || preselectedData.includes('aid')) &&
		(!isConsultantLink || !hasDrawer)
	) {
		return null;
	}

	return (
		<>
			<Box
				sx={{
					display: {
						xs: 'none',
						md: 'block'
					},
					p: '16px',
					my: '32px',
					borderRadius: '4px',
					border: '1px solid #c6c5c4'
				}}
			>
				{isConsultantLink &&
					(hasConsultantError ? (
						<Typography>
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
							{t('registration.errors.cid')}
						</Typography>
					) : (
						<Typography>
							{' '}
							{t('registration.consultantlink')}
						</Typography>
					))}
				{(preselectedTopicName || hasTopicError) &&
					!isConsultantLink && (
						<>
							<Typography sx={{ fontWeight: '600', mb: '8px' }}>
								{t('registration.topic.summary')}
							</Typography>
							{hasTopicError && !preselectedTopicName ? (
								<Typography
									sx={{ mb: hasAgencyError ? '16px' : '0px' }}
								>
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
										{t('registration.errors.tid')}
									</>
								</Typography>
							) : (
								<Typography
									sx={{
										mb:
											preselectedAgency || hasAgencyError
												? '16px'
												: '0px'
									}}
								>
									{preselectedTopicName}
								</Typography>
							)}
						</>
					)}
				{(preselectedAgency || hasAgencyError) && !isConsultantLink && (
					<>
						<Typography
							sx={{
								fontWeight: '600',
								mb: '8px'
							}}
						>
							{t('registration.agency.summary')}
						</Typography>
						{hasAgencyError && !preselectedAgency ? (
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
							<Typography>{preselectedAgency?.name}</Typography>
						)}
					</>
				)}
			</Box>
			{hasDrawer && !fromM && (
				<PreselectionDrawer
					topicName={topicName}
					agencyName={agencyName}
				/>
			)}
		</>
	);
};
