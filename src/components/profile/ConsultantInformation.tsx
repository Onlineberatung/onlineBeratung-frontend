import * as React from 'react';
import { useCallback, useContext } from 'react';
import { ReactComponent as CopyIcon } from '../../resources/img/icons/documents.svg';
import { ReactComponent as InfoIcon } from '../../resources/img/icons/i.svg';
import {
	AUTHORITIES,
	hasUserAuthority,
	NOTIFICATION_TYPE_INFO,
	NotificationsContext,
	UserDataContext
} from '../../globalState';
import { translate } from '../../utils/translate';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import { copyTextToClipboard } from '../../utils/clipboardHelpers';
import { config } from '../../resources/scripts/config';
import { Tooltip } from '../tooltip/Tooltip';

export const ConsultantInformation = () => {
	const { userData } = useContext(UserDataContext);

	return (
		<div>
			<div className="profile__content__title">
				<div className="flex flex--fd-column flex--jc-fs flex-s--fd-row flex-s--jc-sb flex-l--fd-column flex-l--jc-fs flex-xl--fd-row flex-xl--jc-sb">
					<Headline
						className="pr--3"
						text={translate('profile.data.title.information')}
						semanticLevel="5"
					/>
					{hasUserAuthority(
						AUTHORITIES.CONSULTANT_DEFAULT,
						userData
					) && (
						<PersonalRegistrationLink
							cid={userData.userId}
							className="profile__user__personal_link mt-l--1 mb-l--1 mt-xl--0 mb-xl--0"
						/>
					)}
				</div>
				<Text
					text={translate('profile.data.info.public')}
					type="standard"
					className="tertiary"
				/>
			</div>
			<div className="profile__data__item">
				<p className="profile__data__label">
					{translate('profile.data.userName')}
				</p>
				<p className="profile__data__content">{userData.userName}</p>
			</div>
		</div>
	);
};

type PersonalRegistrationLinkProps = {
	cid: string;
	className: string;
};

const PersonalRegistrationLink = ({
	cid,
	className
}: PersonalRegistrationLinkProps) => {
	const { addNotification } = useContext(NotificationsContext);

	const copyRegistrationLink = useCallback(async () => {
		await copyTextToClipboard(
			`${config.urls.registration}?cid=${cid}`,
			() => {
				addNotification({
					notificationType: NOTIFICATION_TYPE_INFO,
					title: translate(
						'profile.data.personal.registrationLink.notification.title'
					),
					text: translate(
						'profile.data.personal.registrationLink.notification.text'
					)
				});
			}
		);
	}, [cid, addNotification]);

	return (
		<div className={`flex ${className}`}>
			<span
				role="button"
				className="text--right text--nowrap mr--1 flex__col--no-grow flex-xl__col--grow text--tertiary primary"
				onClick={copyRegistrationLink}
				title={translate(
					'profile.data.personal.registrationLink.title'
				)}
			>
				<CopyIcon className={`copy icn--s`} />{' '}
				{translate('profile.data.personal.registrationLink.text')}
			</span>
			<div className="flex-xl__col--no-grow flex--inline flex--ai-c">
				<Tooltip trigger={<InfoIcon className="icn icn--xl" />}>
					{translate(
						'profile.data.personal.registrationLink.tooltip'
					)}
				</Tooltip>
			</div>
		</div>
	);
};
