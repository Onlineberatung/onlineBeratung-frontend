import * as React from 'react';
import { useCallback, useContext } from 'react';
import { ReactComponent as CopyIcon } from '../../resources/img/icons/documents.svg';
import {
	NOTIFICATION_TYPE_INFO,
	NotificationsContext,
	UserDataContext
} from '../../globalState';
import { translate } from '../../utils/translate';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import { copyTextToClipboard } from '../../utils/clipboardHelpers';
import { config } from '../../resources/scripts/config';

export const ConsultantPublicData = () => {
	const { userData } = useContext(UserDataContext);

	return (
		<div>
			<div className="profile__content__title">
				<Headline
					text={translate('profile.data.title.public')}
					semanticLevel="5"
				/>
				<Text
					text={translate('profile.data.info.public')}
					type="infoLargeAlternative"
				/>
			</div>
			<div className="profile__data__item">
				<p className="profile__data__label">
					{translate('profile.data.userName')}
				</p>
				<p className="profile__data__content">{userData.userName}</p>
			</div>
			<div className="profile__data__item">
				<p className="profile__data__label">
					{translate('profile.data.agency')}
				</p>
				{userData.agencies.map((item, i) => {
					return (
						<p className="profile__data__content" key={i}>
							{item.name} <AgencyRegistrationLink agency={item} />
						</p>
					);
				})}
			</div>
		</div>
	);
};

type AgencyRegistrationLinkProps = {
	agency: any;
};

const AgencyRegistrationLink = ({ agency }: AgencyRegistrationLinkProps) => {
	const { addNotification } = useContext(NotificationsContext);

	const copyRegistrationLink = useCallback(async () => {
		await copyTextToClipboard(
			`${config.urls.registration}?aid=${agency.id}`,
			() => {
				addNotification({
					notificationType: NOTIFICATION_TYPE_INFO,
					title: translate(
						'profile.data.agency.registrationLink.notification.title'
					),
					text: translate(
						'profile.data.agency.registrationLink.notification.text'
					)
				});
			}
		);
	}, [agency, addNotification]);

	return (
		<>
			<span className="profile__data__divider">|</span>
			<span
				className="profile__data__copy_registration_link"
				role="button"
				onClick={copyRegistrationLink}
				title={translate('profile.data.agency.registrationLink.title')}
			>
				<CopyIcon className={`copy`} />{' '}
				{translate('profile.data.agency.registrationLink.text')}
			</span>
		</>
	);
};
