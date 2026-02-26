import React from 'react';
import { useTranslation } from 'react-i18next';
import {
	AUTHORITIES,
	hasUserAuthority,
	UserDataContext
} from '../../../globalState';
import { Headline } from '../../headline/Headline';
import { EmailToggle } from './EmailToggle';
import { NoEmailSet } from './NoEmailSet';
import { Box as MuiBox, Stack, Typography, Divider } from '@mui/material';

export const EmailNotification = () => {
	const { userData } = React.useContext(UserDataContext);
	const { t } = useTranslation();
	const isConsultant = hasUserAuthority(
		AUTHORITIES.CONSULTANT_DEFAULT,
		userData
	);

	const extraKey = isConsultant ? 'Consultant' : 'AdviceSeeker';

	return (
		<MuiBox>
			<Stack spacing={2}>
				<Headline
					text={t('profile.notifications.title')}
					semanticLevel="5"
				/>
				<Typography variant="body2" color="text.secondary">
					{t('profile.notifications.description')}
				</Typography>
				
				{!userData.email && <NoEmailSet />}
				{userData.email && (
					<Stack spacing={2}>
						<EmailToggle
							name="emailNotificationsEnabled"
							titleKey="profile.notifications.mainEmail.title"
						/>

						{userData.emailNotifications?.emailNotificationsEnabled && (
							<Stack spacing={2} divider={<Divider />}>
								{isConsultant && (
									<EmailToggle
										name="settings.initialEnquiryNotificationEnabled"
										titleKey="profile.notifications.initialEnquiry.title"
									/>
								)}
								<EmailToggle
									name="settings.newChatMessageNotificationEnabled"
									titleKey={`profile.notifications.newMessage${extraKey}.title`}
									descriptionKey={`profile.notifications.newMessage${extraKey}.description`}
								/>
								<EmailToggle
									name="settings.reassignmentNotificationEnabled"
									titleKey={`profile.notifications.reassignment${extraKey}.title`}
									descriptionKey={`profile.notifications.reassignment${extraKey}.description`}
								/>
							</Stack>
						)}
					</Stack>
				)}
			</Stack>
		</MuiBox>
	);
};
