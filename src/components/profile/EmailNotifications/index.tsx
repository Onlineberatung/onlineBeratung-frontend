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

	const extraKey = isConsultant ? 'Consultant' : 'AdviceSeeker';

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
