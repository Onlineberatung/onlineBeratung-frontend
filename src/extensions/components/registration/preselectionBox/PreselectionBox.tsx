import * as React from 'react';
import { useContext } from 'react';
import { Box } from '@mui/material';
import { RegistrationContext } from '../../../../globalState';
import { PreselectionDrawer } from '../preselectionDrawer/preselectionDrawer';
import { useResponsive } from '../../../../hooks/useResponsive';
import { UrlParamsContext } from '../../../../globalState/provider/UrlParamsProvider';
import PreselectedConsultant from './PreselectedConsultant';
import PreselectedTopic from './PreselectedTopic';
import PreselectedAgency from './PreselectedAgency';

export const PreselectionBox = ({
	hasDrawer = false
}: {
	hasDrawer?: boolean;
}) => {
	const { fromM } = useResponsive();

	const { hasConsultantError, hasTopicError, hasAgencyError } =
		useContext(RegistrationContext);
	const {
		agency: preselectedAgency,
		topic: preselectedTopic,
		consultant: preselectedConsultant
	} = useContext(UrlParamsContext);

	if (!preselectedTopic && !preselectedAgency && !preselectedConsultant) {
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
				data-cy="preselected"
				data-cy-preselected-consultant={
					preselectedConsultant?.consultantId
				}
				data-cy-preselected-consultant-error={hasConsultantError}
				data-cy-preselected-agency={preselectedAgency?.id}
				data-cy-preselected-agency-error={hasAgencyError}
				data-cy-preselected-topic={preselectedTopic?.id}
				data-cy-preselected-topic-error={hasTopicError}
			>
				{preselectedConsultant ? (
					<PreselectedConsultant hasError={hasConsultantError} />
				) : (
					<>
						<PreselectedTopic
							hasError={hasTopicError}
							topic={preselectedTopic}
							sx={{
								mb:
									preselectedAgency || hasAgencyError
										? '16px'
										: '0px'
							}}
						/>
						<PreselectedAgency
							hasError={hasAgencyError}
							agency={preselectedAgency}
						/>
					</>
				)}
			</Box>
			{hasDrawer && !fromM && <PreselectionDrawer />}
		</>
	);
};
