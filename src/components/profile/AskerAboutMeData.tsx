import * as React from 'react';
import { useContext, useState } from 'react';
import { apiPutEmail, FETCH_ERRORS, validateEmail } from '../../api';
import { UserDataContext } from '../../globalState';
import { translate } from '../../resources/scripts/i18n/translate';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import { EditableData } from '../editableData/EditableData';
import { InputFieldLabelState } from '../inputField/InputField';
import { Text } from '../text/Text';

const cancelEditButton: ButtonItem = {
	label: 'abbrechen',
	type: BUTTON_TYPES.LINK
};

export const AskerAboutMeData = () => {
	const { userData, setUserData } = useContext(UserDataContext);
	const [isEmailDisabled, setIsEmailDisabled] = useState<boolean>(true);
	const [email, setEmail] = useState<string>();
	const [emailLabel, setEmailLabel] = useState<string>(
		translate('profile.data.email')
	);
	const [emailLabelState, setEmailLabelState] = useState<
		InputFieldLabelState
	>();
	const [isRequestInProgress, setIsRequestInProgress] = useState<boolean>(
		false
	);

	const handleEmailValidation = (email) => {
		const validity = validateEmail(email);
		setEmailLabelState(validity.valid);
		setEmailLabel(validity.label);
		setEmail(email);
	};

	const handleCancelEditButton = () => {
		setIsEmailDisabled(true);
		setEmailLabel(translate('profile.data.email'));
		setEmailLabelState('valid');
	};

	const saveEditButton: ButtonItem = {
		disabled: !(email && emailLabelState === 'valid'),
		label: 'speichern',
		type: BUTTON_TYPES.LINK
	};

	const handleSaveEditButton = () => {
		if (!isRequestInProgress) {
			setIsRequestInProgress(true);
			//TODO: finish cleanups after call
			apiPutEmail(email)
				.then((response) => {
					setIsRequestInProgress(false);
					let updatedUserData = userData;
					updatedUserData.email = email;
					setUserData(updatedUserData);
					setIsEmailDisabled(true);
				})
				.catch((error: Response) => {
					const reason = error.headers.get(FETCH_ERRORS.X_REASON);
					if (reason === 'EMAIL_NOT_AVAILABLE') {
						setEmailLabel(
							translate(
								'furtherSteps.email.overlay.input.unavailable'
							)
						);
						setEmailLabelState('invalid');
						setIsRequestInProgress(false);
					}
					//TODO: handle other errors?
				});
		}
	};

	return (
		<div>
			<Text text={translate('profile.data.title')} type="divider" />
			<div className="profile__data__item">
				<p className="profile__data__label">
					{translate('profile.data.userName')}
				</p>
				<p className="profile__data__content">{userData.userName}</p>
			</div>
			<EditableData
				label={emailLabel}
				initialValue={userData.email}
				isDisabled={isEmailDisabled}
				isSingleEdit
				onSingleEditActive={() => setIsEmailDisabled(false)}
				validateCurrentValue={(value) => handleEmailValidation(value)}
				validity={emailLabelState}
			/>
			{!isEmailDisabled && (
				<>
					<Button
						item={cancelEditButton}
						buttonHandle={handleCancelEditButton}
					/>
					<Button
						item={saveEditButton}
						buttonHandle={handleSaveEditButton}
					/>
				</>
			)}
		</div>
	);
};
