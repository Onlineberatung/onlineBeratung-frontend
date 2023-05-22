import React from 'react';
import { useTranslation } from 'react-i18next';
import {
	AUTHORITIES,
	hasUserAuthority,
	UserDataContext,
	useTenant
} from '../../../globalState';
import { Headline } from '../../headline/Headline';
import { Text } from '../../text/Text';
import { EmailToggle } from './EmailToggle';
import { NoEmailSet } from './NoEmailSet';

export const EmailNotification = () => {
	const { settings } = useTenant();
	const { userData } = React.useContext(UserDataContext);
	const { t } = useTranslation();
	const isConsultant = hasUserAuthority(
		AUTHORITIES.CONSULTANT_DEFAULT,
		userData
	);

	const reassignmentKey = isConsultant
		? 'reassignmentConsultant'
		: 'reassignmentAdviceSeeker';

	return (
		<div className="notifications__content">
			<div className="profile__content__title">
				<Headline
					text={t('profile.notifications.title')}
					semanticLevel="5"
				/>
				<Text
					text={t('profile.notifications.description')}
					type="standard"
					className="tertiary"
				/>
			</div>
			{!userData.email && <NoEmailSet />}
			{userData.email && (
				<>
					<EmailToggle
						name="emailNotificationsEnabled"
						titleKey="profile.notifications.mainEmail.title"
					/>

					{userData.emailNotifications?.emailNotificationsEnabled && (
						<>
							<hr />
							{isConsultant && (
								<EmailToggle
									name="settings.initialEnquiryNotificationEnabled"
									titleKey="profile.notifications.initialEnquiry.title"
									descriptionKey="profile.notifications.initialEnquiry.description"
								/>
							)}
							<EmailToggle
								name="settings.newChatMessageNotificationEnabled"
								titleKey="profile.notifications.newMessage.title"
								descriptionKey="profile.notifications.newMessage.description"
							/>
							<EmailToggle
								name="settings.reassignmentNotificationEnabled"
								titleKey={`profile.notifications.${reassignmentKey}.title`}
								descriptionKey={`profile.notifications.${reassignmentKey}.description`}
							/>
							{settings.featureAppointmentsEnabled && (
								<EmailToggle
									name="settings.appointmentNotificationEnabled"
									titleKey={`profile.notifications.appointmentNotificationEnabled.title`}
									descriptionKey={`profile.notifications.appointmentNotificationEnabled.description`}
								/>
							)}
						</>
					)}
				</>
			)}
		</div>
	);
};
