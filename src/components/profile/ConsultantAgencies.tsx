import * as React from 'react';
import { useCallback, useContext } from 'react';

import { useTranslation } from 'react-i18next';
import { Stack, Typography, Box as MuiBox } from '@mui/material';

import {
	NOTIFICATION_TYPE_SUCCESS,
	NotificationsContext,
	UserDataContext
} from '../../globalState';
import { useAppConfig } from '../../hooks/useAppConfig';
import CopyIcon from '@mui/icons-material/ContentCopy';
import { copyTextToClipboard } from '../../utils/clipboardHelpers';
import { GenerateQrCode } from '../generateQrCode/GenerateQrCode';
import { Headline } from '../headline/Headline';

type Agency = {
	id: string | number;
	name: string;
};

export const ConsultantAgencies = () => {
	const settings = useAppConfig();
	const { t: translate } = useTranslation(['common', 'agencies']);

	const { userData } = useContext(UserDataContext);

	return (
		<MuiBox>
			<Stack spacing={2}>
				<Headline
					text={translate('profile.data.title.agencies')}
					semanticLevel="5"
				/>
				
				<Stack spacing={2} divider={<MuiBox sx={{ borderBottom: 1, borderColor: 'divider' }} />}>
					{userData.agencies.map((item: Agency) => {
						return (
							<Stack
								key={`agencies-${item.id}`}
								direction={{ xs: 'column', lg: 'row' }}
								justifyContent="space-between"
								spacing={2}
							>
								<Typography variant="body1">
									{translate(`agency.${item.id}.name`, {
										ns: 'agencies',
										defaultValue: item.name
									})}
								</Typography>
								<Stack direction="row" spacing={2} alignItems="center">
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
									<AgencyRegistrationLink agency={item} />
								</Stack>
							</Stack>
						);
					})}
				</Stack>
			</Stack>
		</MuiBox>
	);
};

type AgencyRegistrationLinkProps = {
	agency: Agency;
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
		<MuiBox
			component="button"
			className="text--nowrap text--tertiary primary button-as-link"
			type="button"
			tabIndex={0}
			onClick={copyRegistrationLink}
			title={translate('profile.data.agency.registrationLink.title')}
			aria-label={translate('profile.data.agency.registrationLink.title')}
			sx={{ 
				border: 'none', 
				background: 'none', 
				p: 0, 
				textDecoration: 'underline',
				cursor: 'pointer',
				display: 'flex',
				alignItems: 'center',
				gap: 0.5
			}}
		>
			<CopyIcon className={`copy icn--s`} />{' '}
			{translate('profile.data.agency.registrationLink.text')}
		</MuiBox>
	);
};
