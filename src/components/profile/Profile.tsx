import * as React from 'react';
import { ComponentType, useCallback, useContext, useEffect } from 'react';
import { translate } from '../../utils/translate';
import { logout } from '../logout/logout';
import {
	AUTHORITIES,
	hasUserAuthority,
	NOTIFICATION_TYPE_INFO,
	NotificationsContext,
	useConsultingTypes,
	UserDataContext
} from '../../globalState';
import { ConsultantPrivateData } from './ConsultantPrivateData';
import { ConsultantPublicData } from './ConsultantPublicData';
import { consultingTypeSelectOptionsSet } from './profileHelpers';
import { AskerAboutMeData } from './AskerAboutMeData';
import { AskerConsultingTypeData } from './AskerConsultingTypeData';
import { AskerRegistration } from './AskerRegistration';
import { setProfileWrapperInactive } from '../app/navigationHandler';
import { ReactComponent as PersonIcon } from '../../resources/img/icons/person.svg';
import { ReactComponent as LogoutIcon } from '../../resources/img/icons/out.svg';
import { DeleteAccount } from './DeleteAccount';
import { AbsenceFormular } from '../absenceFormular/AbsenceFormular';
import { PasswordReset } from '../passwordReset/PasswordReset';
import { Text } from '../text/Text';
import { TwoFactorAuth } from './TwoFactorAuth';
import { ConsultantStatistics } from './ConsultantStatistics';
import { LegalInformationLinksProps } from '../login/LegalInformationLinks';
import './profile.styles';
import { ConsultantSpokenLanguages } from './ConsultantSpokenLanguages';
import { copyTextToClipboard } from '../../utils/clipboardHelpers';
import { config } from '../../resources/scripts/config';
import { ReactComponent as CopyIcon } from '../../resources/img/icons/documents.svg';
import { Tooltip } from '../tooltip/Tooltip';
import { ReactComponent as InfoIcon } from '../../resources/img/icons/i.svg';

interface ProfileProps {
	legalComponent: ComponentType<LegalInformationLinksProps>;
	spokenLanguages: string[];
	fixedLanguages: string[];
}

export const Profile = (props: ProfileProps) => {
	const { userData } = useContext(UserDataContext);
	const consultingTypes = useConsultingTypes();

	useEffect(() => {
		setProfileWrapperActive();
		return () => {
			setProfileWrapperInactive();
		};
	}, []);

	const handleLogout = () => {
		logout();
	};

	const setProfileWrapperActive = () => {
		document
			.querySelector('.contentWrapper__list')
			?.setAttribute('style', 'display: none');
		document
			.querySelector('.contentWrapper__detail')
			?.setAttribute('style', 'display: none');
		document
			.querySelector('.contentWrapper__profile')
			?.setAttribute('style', 'display: block');
	};

	return (
		<div className="profile__wrapper">
			<div className="profile__header">
				<div className="profile__header__wrapper">
					<h3 className="profile__header__title">
						{translate('profile.header.title')}
					</h3>
					<div className="profile__header__actions">
						{hasUserAuthority(
							AUTHORITIES.CONSULTANT_DEFAULT,
							userData
						) && (
							<PersonalRegistrationLink
								cid={userData.userId}
								className="profile__header__personal_link"
							/>
						)}
						<div
							onClick={handleLogout}
							className="profile__header__logout"
						>
							<LogoutIcon />
						</div>
					</div>
				</div>
				<div className="profile__header__metaInfo">
					<p className="profile__header__username">
						{hasUserAuthority(
							AUTHORITIES.CONSULTANT_DEFAULT,
							userData
						)
							? `${userData.firstName} ${userData.lastName}`
							: userData.userName}
					</p>
				</div>
			</div>
			<div className="profile__innerWrapper">
				<div className="profile__user">
					<div className="profile__icon">
						<PersonIcon className="profile__icon--user" />
					</div>
					<h2>
						{hasUserAuthority(
							AUTHORITIES.CONSULTANT_DEFAULT,
							userData
						)
							? `${userData.firstName} ${userData.lastName}`
							: userData.userName}
					</h2>
					{hasUserAuthority(
						AUTHORITIES.CONSULTANT_DEFAULT,
						userData
					) && (
						<div>
							<PersonalRegistrationLink
								cid={userData.userId}
								className="profile__user__personal_link"
							/>
						</div>
					)}
				</div>
				<div className="profile__content">
					<div className="profile__content__item profile__functions">
						<Text
							text={translate('profile.functions.title')}
							type="divider"
						/>
						{hasUserAuthority(
							AUTHORITIES.CONSULTANT_DEFAULT,
							userData
						) && <AbsenceFormular />}
						<PasswordReset />
						{hasUserAuthority(
							AUTHORITIES.CONSULTANT_DEFAULT,
							userData
						) &&
							userData.twoFactorAuth?.isEnabled && (
								<TwoFactorAuth />
							)}
					</div>
					{hasUserAuthority(
						AUTHORITIES.CONSULTANT_DEFAULT,
						userData
					) ? (
						<div className="profile__content__item profile__data">
							<Text
								text={translate('profile.data.title')}
								type="divider"
							/>
							<ConsultantStatistics />
							<ConsultantSpokenLanguages
								spokenLanguages={props.spokenLanguages}
								fixedLanguages={props.fixedLanguages}
							/>
							<ConsultantPrivateData />
							<ConsultantPublicData />
						</div>
					) : (
						<div className="profile__content__item profile__data">
							<AskerAboutMeData />
							<AskerConsultingTypeData />
							{consultingTypeSelectOptionsSet(
								userData,
								consultingTypes
							).length > 0 && (
								<AskerRegistration
									fixedLanguages={props.fixedLanguages}
								/>
							)}
						</div>
					)}
					{hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) && (
						<DeleteAccount />
					)}
				</div>
				<div className="profile__footer">
					<props.legalComponent textStyle={'standard'} />
				</div>
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
		<div className={className}>
			<span
				role="button"
				onClick={copyRegistrationLink}
				title={translate(
					'profile.data.personal.registrationLink.title'
				)}
			>
				<CopyIcon className={`copy`} />{' '}
				{translate('profile.data.personal.registrationLink.text')}
			</span>
			<Tooltip trigger={<InfoIcon />}>
				{translate('profile.data.personal.registrationLink.tooltip')}
			</Tooltip>
		</div>
	);
};
