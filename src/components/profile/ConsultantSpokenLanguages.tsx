import React, { useContext, useEffect, useState } from 'react';
import { apiPutConsultantData } from '../../api';
import { UserDataContext } from '../../globalState';
import { translate } from '../../utils/translate';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import { Headline } from '../headline/Headline';
import { SelectDropdown, SelectOption } from '../select/SelectDropdown';
import { Text } from '../text/Text';

import './profile.styles';
import { isUniqueLanguage } from './profileHelpers';
import { FixedLanguagesContext } from '../../globalState/provider/FixedLanguagesProvider';

interface ConsultantSpokenLanguagesProps {
	spokenLanguages: string[];
}

const cancelEditButton: ButtonItem = {
	label: translate('profile.data.edit.button.cancel'),
	type: BUTTON_TYPES.LINK
};

const saveEditButton: ButtonItem = {
	label: translate('profile.data.edit.button.save'),
	type: BUTTON_TYPES.LINK
};

export const ConsultantSpokenLanguages: React.FC<ConsultantSpokenLanguagesProps> =
	({ spokenLanguages }) => {
		const { userData, setUserData } = useContext(UserDataContext);
		const fixedLanguages = useContext(FixedLanguagesContext);

		const [hasError, setHasError] = useState(false);
		const [selectedLanguages, setSelectedLanguages] =
			useState(fixedLanguages);
		const [previousLanguages, setPreviousLanguages] =
			useState(fixedLanguages);

		useEffect(() => {
			setSelectedLanguages([...userData.languages]);
			setPreviousLanguages([...userData.languages]);
		}, [userData]);

		const selectHandler = (e: SelectOption[]) => {
			const newLanguages = [
				...fixedLanguages,
				...e.map((languageObject) => languageObject.value)
			];

			setSelectedLanguages(newLanguages.filter(isUniqueLanguage));
		};

		const cancelHandler = () => {
			setSelectedLanguages(previousLanguages);
			setHasError(false);
		};

		const saveHandler = () => {
			apiPutConsultantData({
				email: userData.email.trim(),
				firstname: userData.firstName.trim(),
				lastname: userData.lastName.trim(),
				languages: selectedLanguages.filter(isUniqueLanguage)
			})
				.then(() => {
					const updatedUserData = {
						...userData,
						languages: selectedLanguages.filter(isUniqueLanguage)
					};

					setUserData(updatedUserData);
					setHasError(false);
				})
				.catch(() => {
					setHasError(true);
				});
		};

		const availableLanguages = [
			...fixedLanguages,
			...spokenLanguages
		].filter(isUniqueLanguage);

		const languageOptions = availableLanguages.map((language) => {
			return {
				value: language,
				label: translate(`languages.${language}`),
				isFixed: fixedLanguages.indexOf(language) !== -1
			};
		});

		return (
			<div className="spokenLanguages">
				<div className="profile__content__title">
					<Headline
						text={translate('profile.spokenLanguages.title')}
						semanticLevel="5"
					/>

					<Text
						text={translate('profile.spokenLanguages.info')}
						type="standard"
						className="tertiary"
					/>
				</div>
				<div className="spokenLanguages__languageSelect">
					<SelectDropdown
						handleDropdownSelect={selectHandler}
						id="spoken-languages-select"
						menuPlacement="bottom"
						selectedOptions={languageOptions}
						isClearable={false}
						isSearchable
						isMulti
						hasError={hasError}
						errorMessage={translate(
							'profile.functions.spokenLanguages.saveError'
						)}
						defaultValue={languageOptions.filter(
							(option) =>
								selectedLanguages.indexOf(option.value) !== -1
						)}
					/>

					{JSON.stringify(previousLanguages) !==
						JSON.stringify(selectedLanguages) && (
						<div className="spokenLanguages__buttons">
							<Button
								item={cancelEditButton}
								buttonHandle={cancelHandler}
							/>
							<Button
								item={saveEditButton}
								buttonHandle={saveHandler}
							/>
						</div>
					)}
				</div>
			</div>
		);
	};
