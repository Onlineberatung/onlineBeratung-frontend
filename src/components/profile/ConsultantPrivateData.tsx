import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { UserDataContext } from '../../globalState';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import { ReactComponent as PenIcon } from '../../resources/img/icons/pen.svg';
import { EditableData } from '../editableData/EditableData';
import {
	apiDeleteTwoFactorAuth,
	apiPutConsultantData,
	FETCH_ERRORS,
	X_REASON
} from '../../api';
import { TWO_FACTOR_TYPES } from '../twoFactorAuth/TwoFactorAuth';
import { Overlay, OVERLAY_FUNCTIONS } from '../overlay/Overlay';
import { useTranslation } from 'react-i18next';
import { useAppConfig } from '../../hooks/useAppConfig';
import { useHistory } from 'react-router-dom';

export const ConsultantPrivateData = () => {
	const history = useHistory();
	const { t: translate } = useTranslation();
	const { userData, reloadUserData } = useContext(UserDataContext);
	const [isEditDisabled, setIsEditDisabled] = useState<boolean>(true);
	const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(true);
	const [isRequestInProgress, setIsRequestInProgress] =
		useState<boolean>(false);
	const [email, setEmail] = useState<string>();
	const [emailLabel, setEmailLabel] = useState<string>(
		translate('profile.data.email')
	);
	const [isEmailNotAvailable, setIsEmailNotAvailable] =
		useState<boolean>(false);
	const [firstName, setFirstName] = useState<string>();
	const [lastName, setLastName] = useState<string>();
	const [overlayActive, setOverlayActive] = useState(false);

	const cancelEditButton: ButtonItem = {
		label: translate('profile.data.edit.button.cancel'),
		type: BUTTON_TYPES.LINK
	};

	const isEmail2faActive =
		userData.twoFactorAuth?.isActive &&
		userData.twoFactorAuth?.type === TWO_FACTOR_TYPES.EMAIL;

	const isEmailEditedAndEmail2faActive =
		userData.email !== email && isEmail2faActive;

	const settings = useAppConfig();
	const todaysDate = new Date();
	const isTwoFactorBinding =
		todaysDate >= settings.twofactor.dateTwoFactorObligatory;

	useEffect(() => {
		if (email && firstName && lastName) {
			setIsSaveDisabled(false);
		} else {
			setIsSaveDisabled(true);
		}
	}, [email, firstName, lastName]);

	const handleCancelEditButton = () => {
		setIsEditDisabled(true);
	};

	const saveEditButton: ButtonItem = {
		disabled: isSaveDisabled,
		label: translate('profile.data.edit.button.save'),
		type: BUTTON_TYPES.LINK
	};

	const handleSaveEditButton = () => {
		if (isEmailEditedAndEmail2faActive) {
			setOverlayActive(true);
		}
		if (!isRequestInProgress) {
			setIsRequestInProgress(true);
			apiPutConsultantData({
				email: email.trim(),
				firstname: firstName.trim(),
				lastname: lastName.trim(),
				languages: userData.languages
			})
				.then(reloadUserData)
				.then(() => {
					setIsRequestInProgress(false);
					setIsEditDisabled(true);
					setEmailLabel(translate('profile.data.email'));
				})
				.catch((error: Response) => {
					const reason = error.headers?.get(FETCH_ERRORS.X_REASON);
					if (reason === X_REASON.EMAIL_NOT_AVAILABLE) {
						setIsEmailNotAvailable(true);
						setIsRequestInProgress(false);
					}
				});
		}
	};

	const handleEmailChange = (email) => {
		setEmailLabel(translate('profile.data.email'));
		setEmail(email);
		setIsEmailNotAvailable(false);
	};

	const emailOverlay = () => {
		return (
			<div className="profile__emailOverlay">
				<Headline
					text={translate(
						'twoFactorAuth.email.change.confirmOverlay.title'
					)}
					semanticLevel="2"
				/>

				<Text
					text={
						isTwoFactorBinding
							? translate(
									'twoFactorAuth.email.change.confirmOverlay.binding.copy.1'
								)
							: translate(
									'twoFactorAuth.email.change.confirmOverlay.copy.1'
								)
					}
					type="infoLargeStandard"
				/>
				<Text
					text={
						isTwoFactorBinding
							? translate(
									'twoFactorAuth.email.change.confirmOverlay.binding.copy.2'
								)
							: translate(
									'twoFactorAuth.email.change.confirmOverlay.copy.2'
								)
					}
					type="infoLargeStandard"
				/>
			</div>
		);
	};

	const handleOverlayAction = (buttonFunction: string) => {
		switch (buttonFunction) {
			case OVERLAY_FUNCTIONS.CLOSE:
				setOverlayActive(false);
				setIsEditDisabled(true);
				break;
			case OVERLAY_FUNCTIONS.CONFIRM_EDIT:
				if (isTwoFactorBinding) {
					history.push({
						pathname: '/profile/einstellungen/sicherheit',
						state: {
							openTwoFactor: true,
							isEditMode: true
						}
					});
				} else {
					apiDeleteTwoFactorAuth().then(() => {
						setOverlayActive(false);
					});
				}
				break;
		}
	};

	return (
		<div>
			<div className="profile__content__title">
				<div className="flex flex--jc-sb">
					<Headline
						text={translate('profile.data.title.private')}
						semanticLevel="5"
					/>
					{isEditDisabled && (
						<span
							role="button"
							className="tertiary"
							onClick={() => {
								setIsEditDisabled(false);
							}}
						>
							<PenIcon
								title={translate(
									'profile.data.edit.button.edit'
								)}
								aria-label={translate(
									'profile.data.edit.button.edit'
								)}
							/>
						</span>
					)}
				</div>
				<Text
					text={translate('profile.data.info.private')}
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
			<EditableData
				label={emailLabel}
				type="email"
				initialValue={userData.email}
				isDisabled={isEditDisabled}
				onValueIsValid={handleEmailChange}
				isEmailAlreadyInUse={isEmailNotAvailable}
				onBeforeRemoveButtonClick={() =>
					isEmail2faActive && setOverlayActive(true)
				}
				onSingleFocus={() => isEmail2faActive && setOverlayActive(true)}
			/>
			<EditableData
				label={translate('profile.data.firstName')}
				type="text"
				initialValue={
					userData.firstName
						? userData.firstName
						: translate('profile.noContent')
				}
				isDisabled={isEditDisabled}
				onValueIsValid={(firstName) => setFirstName(firstName)}
			/>
			<EditableData
				label={translate('profile.data.lastName')}
				type="text"
				initialValue={
					userData.lastName
						? userData.lastName
						: translate('profile.noContent')
				}
				isDisabled={isEditDisabled}
				onValueIsValid={(lastName) => setLastName(lastName)}
			/>
			{!isEditDisabled && (
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
			{overlayActive && (
				<Overlay
					items={[
						{
							nestedComponent: emailOverlay(),
							buttonSet: [
								{
									type: BUTTON_TYPES.SECONDARY,
									function: OVERLAY_FUNCTIONS.CLOSE,
									label: translate(
										'twoFactorAuth.email.change.confirmOverlay.button.deny'
									)
								},
								{
									type: BUTTON_TYPES.PRIMARY,
									function: OVERLAY_FUNCTIONS.CONFIRM_EDIT,
									label: isTwoFactorBinding
										? translate(
												'twoFactorAuth.email.change.confirmOverlay.button.edit'
											)
										: translate(
												'twoFactorAuth.email.change.confirmOverlay.button.confirm'
											)
								}
							],
							handleOverlay: handleOverlayAction
						}
					]}
				/>
			)}
		</div>
	);
};
