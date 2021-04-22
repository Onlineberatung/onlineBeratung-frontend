import * as React from 'react';
import { useContext, useState } from 'react';
import { UserDataContext } from '../../globalState';
import { translate } from '../../resources/scripts/i18n/translate';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import { EditableData } from '../editableData/EditableData';
import { Text } from '../text/Text';

const cancelEditButton: ButtonItem = {
	label: 'abbrechen!!?!=',
	type: BUTTON_TYPES.LINK
};

const saveEditButton: ButtonItem = {
	label: 'speichern!!?!=',
	type: BUTTON_TYPES.LINK
};

export const AskerAboutMeData = () => {
	const { userData } = useContext(UserDataContext);
	const [isEditActive, setIsEditActive] = useState<boolean>(false);

	const handleCancelEditButton = () => {
		setIsEditActive(false);
		// TODO: set disable true
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
				label={translate('profile.data.email')}
				initialValue={userData.email}
				isDisabled={true}
				isSingleEdit
				onSingleEditActive={() => setIsEditActive(true)} //TODO: set disable false
			/>
			{isEditActive && (
				<>
					<Button
						item={cancelEditButton}
						buttonHandle={handleCancelEditButton}
					/>
					<Button item={saveEditButton} buttonHandle={() => {}} />
				</>
			)}
		</div>
	);
};
