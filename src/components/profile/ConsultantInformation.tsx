import * as React from 'react';
import { useCallback, useContext, useState, useEffect } from 'react';
import { ReactComponent as CopyIcon } from '../../resources/img/icons/documents.svg';
import { ReactComponent as InfoIcon } from '../../resources/img/icons/i.svg';
import {
	AUTHORITIES,
	hasUserAuthority,
	NotificationsContext,
	UserDataContext,
	NOTIFICATION_TYPE_SUCCESS
} from '../../globalState';
import { translate } from '../../utils/translate';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import { copyTextToClipboard } from '../../utils/clipboardHelpers';
import { config } from '../../resources/scripts/config';
import { Tooltip } from '../tooltip/Tooltip';
import { GenerateQrCode } from '../generateQrCode/GenerateQrCode';
import { PenIcon } from '../../resources/img/icons';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import { EditableData } from '../editableData/EditableData';
import useUpdateUserData from '../../utils/useUpdateUserData';
import { apiPatchUserData } from '../../api/apiPatchUserData';

export const ConsultantInformation = () => {
	const { userData } = useContext(UserDataContext);
	const updateUserData = useUpdateUserData();
	const [isEditEnabled, setIsEditEnabled] = useState(false);
	const [isSaveDisabled, setIsSaveDisabled] = useState(false);
	const [editedDisplayName, setEditedDisplayName] = useState('');

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
		apiPatchUserData({ displayName: editedDisplayName }).then(() => {
			setIsEditEnabled(false);
			updateUserData();
		});
	};

	useEffect(() => {
		setEditedDisplayName(userData.displayName);
	}, [userData.displayName]);

	useEffect(() => {
		if (editedDisplayName) {
			setIsSaveDisabled(false);
		} else {
			setIsSaveDisabled(true);
		}
	}, [editedDisplayName]);

	return (
		<div>
			<div className="profile__content__title">
				<div className="flex flex--fd-column flex--jc-fs flex-l--fd-column flex-l--jc-fs flex-xl--fd-row flex-xl--jc-sb flex-xl--wrap">
					<Headline
						className="pr--3"
						text={translate('profile.data.title.information')}
						semanticLevel="5"
					/>
					{!isEditEnabled && (
						<span
							role="button"
							className="primary"
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
						className="profile__user__personal_link mt-l--1 mb-l--1 mt-xl--0 mb-xl--0"
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
				initialValue={userData.displayName || userData.userName}
				isDisabled={!isEditEnabled}
				onValueIsValid={handleValidDisplayName}
			/>
			{isEditEnabled && (
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
	const { addNotification } = useContext(NotificationsContext);

	const copyRegistrationLink = useCallback(async () => {
		await copyTextToClipboard(
			`${config.urls.registration}?cid=${cid}`,
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
	}, [cid, addNotification]);

	return (
		<div className={`flex flex--wrap flex-xl--nowrap ${className}`}>
			<div className="mb--1 mb-l--0">
				<GenerateQrCode
					url={`${config.urls.registration}?cid=${cid}`}
					type="personal"
				/>
			</div>
			<div className="flex flex--ai-fs">
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
		</div>
	);
};
