import * as React from 'react';
import { useContext, useState } from 'react';
import { UserDataContext } from '../../globalState';
import { translate } from '../../resources/scripts/i18n/translate';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import { ReactComponent as PenIcon } from '../../resources/img/icons/pen.svg';
import { EditableData } from '../editableData/EditableData';

const cancelEditButton: ButtonItem = {
	label: translate('profile.data.edit.button.cancel'),
	type: BUTTON_TYPES.LINK
};

export const ConsultantPrivateData = () => {
	const { userData } = useContext(UserDataContext);
	const [isEditDisabled, setIsEditDisabled] = useState<boolean>(true);
	const [isRequestInProgress, setIsRequestInProgress] = useState<boolean>(
		false
	);
	const [email, setEmail] = useState<string>();
	const [firstName, setFirstName] = useState<string>();
	const [lastName, setLastName] = useState<string>();

	const handleCancelEditButton = () => {
		setIsEditDisabled(true);
	};

	const saveEditButton: ButtonItem = {
		// disabled: , todo only when one data different than before
		label: translate('profile.data.edit.button.save'),
		type: BUTTON_TYPES.LINK
	};

	const handleSaveEditButton = () => {
		if (!isRequestInProgress) {
			// setIsRequestInProgress(true);
			//Todo: send data
		}
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
						className="editableData__inputButton"
						onClick={() => setIsEditDisabled(false)}
					>
						<PenIcon />
					</span>
				)}
			</div>
			<EditableData
				label={translate('profile.data.email')}
				initialValue={
					userData.email
						? userData.email
						: translate('profile.noContent')
				}
				isDisabled={isEditDisabled}
			/>
			<EditableData
				label={translate('profile.data.firstName')}
				initialValue={
					userData.firstName
						? userData.firstName
						: translate('profile.noContent')
				}
				isDisabled={isEditDisabled}
			/>
			<EditableData
				label={translate('profile.data.lastName')}
				initialValue={
					userData.lastName
						? userData.lastName
						: translate('profile.noContent')
				}
				isDisabled={isEditDisabled}
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
