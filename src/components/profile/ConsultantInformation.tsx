import * as React from 'react';
import { useCallback, useContext, useState, useEffect } from 'react';
import { ReactComponent as CopyIcon } from '../../resources/img/icons/documents.svg';
import { ReactComponent as InfoIcon } from '../../resources/img/icons/i.svg';
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

export const ConsultantInformation = () => {
	const { t: translate } = useTranslation();
	const { userData, reloadUserData } = useContext(UserDataContext);
	const { addNotification } = useContext(NotificationsContext);
	const [isEditEnabled, setIsEditEnabled] = useState(false);
	const [isSaveDisabled, setIsSaveDisabled] = useState(false);
	const [editedDisplayName, setEditedDisplayName] = useState('');
	const [initialDisplayName, setInitialDisplayName] = useState('');

	const cancelEditButton: ButtonItem = {
		label: translate('profile.data.edit.button.cancel'),
		type: BUTTON_TYPES.LINK
	};

	const saveEditButton: ButtonItem = {
		disabled: isSaveDisabled,
		label: translate('profile.data.edit.button.save'),
		type: BUTTON_TYPES.LINK
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
		<div>
			<div className="profile__content__title">
				<div className="flex flex--fd-row flex--jc-sb">
					<Headline
						className="pr--3"
						text={translate('profile.data.title.information')}
						semanticLevel="5"
					/>
					{isDisplayNameFeatureEnabled && !isEditEnabled && (
						<span
							role="button"
							className="tertiary"
							onClick={() => {
								setIsEditEnabled(true);
							}}
						>
							<PenIcon />
						</span>
					)}
				</div>
				{hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) && (
					<PersonalRegistrationLink
						cid={userData.userId}
						className="profile__user__personal_link mb--1"
					/>
				)}
			</div>
			<div>
				<Text
					text={translate('profile.data.info.public')}
					type="standard"
					className="tertiary"
				/>
			</div>
			<EditableData
				label={translate('profile.data.displayName')}
				type="text"
				initialValue={initialDisplayName}
				isDisabled={!isDisplayNameFeatureEnabled || !isEditEnabled}
				onValueIsValid={handleValidDisplayName}
			/>
			{isDisplayNameFeatureEnabled && isEditEnabled && (
				<div className="editableData__buttonSet editableData__buttonSet--edit">
					<Button
						item={cancelEditButton}
						buttonHandle={handleCancelEditButton}
					/>
					<Button
						item={saveEditButton}
						buttonHandle={handleSaveEditButton}
					/>
				</div>
			)}
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
		<div
			className={`flex flex--wrap flex--ai-c flex-xl--nowrap ${className}`}
		>
			<div className="mt--1">
				<GenerateQrCode
					url={`${settings.urls.registration}?cid=${cid}`}
					filename={'kontaktlink'}
					headline={translate(`qrCode.personal.overlay.headline`)}
					text={translate(`qrCode.personal.overlay.info`)}
				/>
			</div>
			<div className="flex flex--ai-c flex--nowrap mt--1">
				<button
					type="button"
					className="text--right text--nowrap mr--1 text--tertiary primary button-as-link"
					tabIndex={0}
					onClick={copyRegistrationLink}
					title={translate(
						'profile.data.personal.registrationLink.title'
					)}
					aria-label={translate(
						'profile.data.personal.registrationLink.title'
					)}
				>
					<CopyIcon className={`copy icn--s`} />{' '}
					{translate('profile.data.personal.registrationLink.text')}
				</button>
				<div className="flex-xl__col--no-grow flex--inline flex--ai-c">
					<div className="flex-xl__col--no-grow flex--inline flex--ai-c">
						<Tooltip
							trigger={
								<InfoIcon
									className="icn icn--xl"
									title={translate('notifications.info')}
									aria-label={translate('notifications.info')}
								/>
							}
						>
							{translate(
								'profile.data.personal.registrationLink.tooltip'
							)}
						</Tooltip>
					</div>
				</div>
			</div>
		</div>
	);
};
