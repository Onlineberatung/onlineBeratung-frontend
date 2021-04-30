import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { UserDataContext } from '../../globalState';
import { translate } from '../../utils/translate';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import { ReactComponent as PenIcon } from '../../resources/img/icons/pen.svg';
import { EditableData } from '../editableData/EditableData';
import { apiPutConsultantData, FETCH_ERRORS, X_REASON } from '../../api';

const cancelEditButton: ButtonItem = {
	label: translate('profile.data.edit.button.cancel'),
	type: BUTTON_TYPES.LINK
};

export const ConsultantPrivateData = () => {
	const { userData, setUserData } = useContext(UserDataContext);
	const [isEditDisabled, setIsEditDisabled] = useState<boolean>(true);
	const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(true);
	const [isRequestInProgress, setIsRequestInProgress] = useState<boolean>(
		false
	);
	const [email, setEmail] = useState<string>();
	const [emailLabel, setEmailLabel] = useState<string>(
		translate('profile.data.email')
	);
	const [isEmailNotAvailable, setIsEmailNotAvailable] = useState<boolean>(
		false
	);
	const [firstName, setFirstName] = useState<string>();
	const [lastName, setLastName] = useState<string>();

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
		if (!isRequestInProgress) {
			setIsRequestInProgress(true);
			apiPutConsultantData({
				email: email.trim(),
				firstname: firstName.trim(),
				lastname: lastName.trim()
			})
				.then((response) => {
					setIsRequestInProgress(false);
					const updatedUserData = { ...userData };
					updatedUserData.email = email;
					updatedUserData.firstName = firstName;
					updatedUserData.lastName = lastName;
					setUserData(updatedUserData);
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

	return (
		<div>
			<div className="profile__content__title">
				<Headline
					text={translate('profile.data.title.private')}
					semanticLevel="5"
				/>
				<Text
					text={translate('profile.data.info.private')}
					type="infoLargeAlternative"
				/>
				{isEditDisabled && (
					<span
						className="editableData__inputButton editableData__inputButton--edit"
						onClick={() => setIsEditDisabled(false)}
					>
						<PenIcon />
					</span>
				)}
			</div>
			<EditableData
				label={emailLabel}
				type="email"
				initialValue={userData.email}
				isDisabled={isEditDisabled}
				onValueIsValid={handleEmailChange}
				isEmailAlreadyInUse={isEmailNotAvailable}
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
		</div>
	);
};
