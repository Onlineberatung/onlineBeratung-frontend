import * as React from 'react';
import { useCallback, useContext } from 'react';
import { ReactComponent as CopyIcon } from '../../resources/img/icons/documents.svg';
import {
	NotificationsContext,
	UserDataContext,
	NOTIFICATION_TYPE_SUCCESS
} from '../../globalState';
import { Headline } from '../headline/Headline';
import { copyTextToClipboard } from '../../utils/clipboardHelpers';
import { GenerateQrCode } from '../generateQrCode/GenerateQrCode';
import { useAppConfig } from '../../hooks/useAppConfig';
import { useTranslation } from 'react-i18next';

export const ConsultantAgencies = () => {
	const settings = useAppConfig();
	const { t: translate } = useTranslation(['common', 'agencies']);

	const { userData } = useContext(UserDataContext);

	return (
		<div>
			<div className="profile__content__title">
				<div className="flex flex--fd-column flex-xl--fd-row">
					<Headline
						className="pr--3"
						text={translate('profile.data.title.agencies')}
						semanticLevel="5"
					/>
				</div>
			</div>
			<div className="profile__data__item full">
				{userData.agencies.map((item, i) => {
					return (
						<div
							className="profile__data__content profile__data__content--agencies flex flex--fd-column flex-l--fd-row flex-l--jc-sb mb--2"
							key={`agencies-${i}`}
						>
							{translate([`agency.${item.id}.name`, item.name], {
								ns: 'agencies'
							})}
							<div className="flex flex--fd-row mt--1 flex-l--fd-column mt-l--0 ml-l--2 flex--ai-c flex-l--ai-fs">
								<div>
									<GenerateQrCode
										url={`${settings.urls.registration}?aid=${item.id}`}
										filename={'beratungsstelle'}
										headline={translate(
											`qrCode.agency.overlay.headline`
										)}
										text={translate(
											`qrCode.agency.overlay.info`,
											{
												agency: item.name
											}
										)}
									/>
								</div>
								<div className="ml--2 mt-l--1 ml-l--0">
									<AgencyRegistrationLink agency={item} />
								</div>
							</div>
						</div>
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
	const settings = useAppConfig();
	const { t: translate } = useTranslation();

	const { addNotification } = useContext(NotificationsContext);

	const copyRegistrationLink = useCallback(async () => {
		await copyTextToClipboard(
			`${settings.urls.registration}?aid=${agency.id}`,
			() => {
				addNotification({
					notificationType: NOTIFICATION_TYPE_SUCCESS,

					title: translate(
						'profile.data.agency.registrationLink.notification.title'
					),
					text: translate(
						'profile.data.agency.registrationLink.notification.text'
					)
				});
			}
		);
	}, [settings.urls.registration, agency.id, addNotification, translate]);

	return (
		<button
			className="profile__data__copy_registration_link text--nowrap text--tertiary primary mr--2 button-as-link"
			type="button"
			tabIndex={0}
			onClick={copyRegistrationLink}
			title={translate('profile.data.agency.registrationLink.title')}
			aria-label={translate('profile.data.agency.registrationLink.title')}
		>
			<CopyIcon className={`copy icn--s`} />{' '}
			{translate('profile.data.agency.registrationLink.text')}
		</button>
	);
};
