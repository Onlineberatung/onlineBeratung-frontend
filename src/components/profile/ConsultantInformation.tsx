import * as React from 'react';
import { useCallback, useContext, useState, useEffect } from 'react';
import { Stack, Typography, Box as MuiBox } from '@mui/material';
import CopyIcon from '@mui/icons-material/ContentCopy';
import InfoIcon from '@mui/icons-material/Info';
import {
	AUTHORITIES,
	hasUserAuthority,
	NotificationsContext,
	UserDataContext,
	NOTIFICATION_TYPE_SUCCESS,
	NOTIFICATION_TYPE_ERROR
} from '../../globalState';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import { copyTextToClipboard } from '../../utils/clipboardHelpers';
import { Tooltip } from '../tooltip/Tooltip';
import { GenerateQrCode } from '../generateQrCode/GenerateQrCode';
import { PenIcon } from '../../resources/img/icons';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import { EditableData } from '../editableData/EditableData';
import { apiPatchUserData } from '../../api/apiPatchUserData';
import { useTranslation } from 'react-i18next';
import { useAppConfig } from '../../hooks/useAppConfig';
import { OverlayItem, OVERLAY_FUNCTIONS, Overlay } from '../overlay/Overlay';
import CheckIcon from '../../resources/img/illustrations/check.svg?react';

export const ConsultantInformation = () => {
	const { t: translate } = useTranslation();
	const { userData, reloadUserData } = useContext(UserDataContext);
	const { addNotification } = useContext(NotificationsContext);
	const [isEditEnabled, setIsEditEnabled] = useState(false);
	const [isSaveDisabled, setIsSaveDisabled] = useState(false);
	const [editedDisplayName, setEditedDisplayName] = useState('');
	const [initialDisplayName, setInitialDisplayName] = useState('');
	const [successOverlayActive, setSuccessOverlayActive] = useState(false);

	const cancelEditButton: ButtonItem = {
		label: translate('profile.data.edit.button.cancel'),
		type: BUTTON_TYPES.SECONDARY
	};

	const saveEditButton: ButtonItem = {
		disabled: isSaveDisabled,
		label: translate('profile.data.edit.button.save'),
		type: BUTTON_TYPES.PRIMARY
	};

	const overlayItem: OverlayItem = {
		svg: CheckIcon,
		headline: translate('profile.data.displayNameInfo'),
		buttonSet: [
			{
				label: translate('profile.data.displayNameInfoClose'),
				function: OVERLAY_FUNCTIONS.CLOSE,
				type: BUTTON_TYPES.AUTO_CLOSE
			}
		]
	};

	const handleValidDisplayName = (displayName) => {
		setEditedDisplayName(displayName);
	};

	const handleCancelEditButton = () => {
		setIsEditEnabled(false);
	};

	const handleSaveEditButton = () => {
		apiPatchUserData({ displayName: editedDisplayName })
			.then(() => {
				reloadUserData().catch(console.log);
				setInitialDisplayName(editedDisplayName);
				setSuccessOverlayActive(true);
			})
			.catch((error) => {
				addNotification({
					notificationType: NOTIFICATION_TYPE_ERROR,
					title: translate('profile.notifications.error.title'),
					text: translate('profile.notifications.error.description'),
					closeable: true,
					timeout: 60000
				});
				console.error('Error while patching consultant', error);
			})
			.finally(() => {
				setIsEditEnabled(false);
			});
	};

	const handleSuccessOverlayAction = (buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.CLOSE) {
			setSuccessOverlayActive(false);
		}
	};

	useEffect(() => {
		if (editedDisplayName) {
			setIsSaveDisabled(false);
		} else {
			setIsSaveDisabled(true);
		}
	}, [editedDisplayName]);

	useEffect(() => {
		setInitialDisplayName(userData.displayName || userData.userName);
		setEditedDisplayName(userData.displayName);
	}, [userData.displayName, userData.userName]);

	const isDisplayNameFeatureEnabled = userData?.isDisplayNameEditable;

	return (
		<MuiBox>
			<Stack spacing={2}>
				<Stack direction="row" justifyContent="space-between" alignItems="flex-start">
					<Headline
						text={translate('profile.data.title.information')}
						semanticLevel="5"
					/>
					{isDisplayNameFeatureEnabled && !isEditEnabled && (
						<MuiBox
							component="span"
							role="button"
							className="tertiary"
							onClick={() => {
								setIsEditEnabled(true);
							}}
							sx={{ cursor: 'pointer' }}
						>
							<PenIcon />
						</MuiBox>
					)}
				</Stack>

				{hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) && (
					<PersonalRegistrationLink
						cid={userData.userId}
					/>
				)}

				<Typography variant="body2" color="text.secondary">
					{translate('profile.data.info.public')}
				</Typography>

				<EditableData
					label={translate('profile.data.displayName')}
					type="text"
					initialValue={initialDisplayName}
					isDisabled={!isDisplayNameFeatureEnabled || !isEditEnabled}
					onValueIsValid={handleValidDisplayName}
				/>

				{isDisplayNameFeatureEnabled && isEditEnabled && (
					<Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
						<Button
							item={cancelEditButton}
							buttonHandle={handleCancelEditButton}
						/>
						<Button
							item={saveEditButton}
							buttonHandle={handleSaveEditButton}
						/>
					</Stack>
				)}
			</Stack>

			{successOverlayActive && (
				<Overlay
					item={overlayItem}
					handleOverlay={handleSuccessOverlayAction}
				/>
			)}
		</MuiBox>
	);
};

type PersonalRegistrationLinkProps = {
	cid: string;
};

const PersonalRegistrationLink = ({
	cid
}: PersonalRegistrationLinkProps) => {
	const { t: translate } = useTranslation();
	const settings = useAppConfig();

	const { addNotification } = useContext(NotificationsContext);

	const copyRegistrationLink = useCallback(async () => {
		await copyTextToClipboard(
			`${settings.urls.registration}?cid=${cid}`,
			() => {
				addNotification({
					notificationType: NOTIFICATION_TYPE_SUCCESS,
					title: translate(
						'profile.data.personal.registrationLink.notification.title'
					),
					text: translate(
						'profile.data.personal.registrationLink.notification.text'
					)
				});
			}
		);
	}, [settings.urls.registration, cid, addNotification, translate]);

	return (
		<Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
			<GenerateQrCode
				url={`${settings.urls.registration}?cid=${cid}`}
				filename={'kontaktlink'}
				headline={translate(`qrCode.personal.overlay.headline`)}
				text={translate(`qrCode.personal.overlay.info`)}
			/>
			<Stack direction="row" spacing={1} alignItems="center">
				<MuiBox
					component="button"
					type="button"
					className="text--nowrap text--tertiary primary button-as-link"
					tabIndex={0}
					onClick={copyRegistrationLink}
					title={translate(
						'profile.data.personal.registrationLink.title'
					)}
					aria-label={translate(
						'profile.data.personal.registrationLink.title'
					)}
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
					{translate('profile.data.personal.registrationLink.text')}
				</MuiBox>
				<Tooltip
					trigger={
						<InfoIcon
							className="icn icn--xl"
							titleAccess={translate('notifications.info')}
							aria-label={translate('notifications.info')}
						/>
					}
				>
					{translate(
						'profile.data.personal.registrationLink.tooltip'
					)}
				</Tooltip>
			</Stack>
		</Stack>
	);
};
