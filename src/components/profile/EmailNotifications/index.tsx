import React from 'react';
import { useTranslation } from 'react-i18next';
import {
	AUTHORITIES,
	hasUserAuthority,
	UserDataContext
} from '../../../globalState';
import { Headline } from '../../headline/Headline';
import { Text } from '../../text/Text';
import { EmailToggle } from './EmailToggle';
import { NoEmailSet } from './NoEmailSet';

export const EmailNotification = () => {
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
					type="infoMedium"
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
								titleKey="profile.notifications.newMessage.title"
								descriptionKey="profile.notifications.newMessage.description"
							/>
							<EmailToggle
								name="settings.reassignmentNotificationEnabled"
								titleKey={`profile.notifications.${reassignmentKey}.title`}
								descriptionKey={`profile.notifications.${reassignmentKey}.description`}
							/>
						</>
					)}
				</>
			)}
		</div>
	);
};
