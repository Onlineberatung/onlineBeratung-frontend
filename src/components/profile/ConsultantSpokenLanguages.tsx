import React, { useContext, useEffect, useState } from 'react';
import { apiPutConsultantData } from '../../api';
import { UserDataContext } from '../../globalState';
import { translate } from '../../utils/translate';
import { Headline } from '../headline/Headline';
import { SelectDropdown, SelectOption } from '../select/SelectDropdown';
import { Text } from '../text/Text';

import './profile.styles';
import { isUniqueLanguage } from './profileHelpers';

interface ConsultantSpokenLanguagesProps {
	spokenLanguages: string[];
	fixedLanguages: string[];
}

export const ConsultantSpokenLanguages: React.FC<ConsultantSpokenLanguagesProps> =
	({ spokenLanguages, fixedLanguages }) => {
		const { userData, setUserData } = useContext(UserDataContext);
		const [hasError, setHasError] = useState(false);
		const [selectedLanguages, setSelectedLanguages] =
			useState(fixedLanguages);

		useEffect(() => {
			setSelectedLanguages([...userData.languages]);
		}, [userData]);

		const selectHandler = (e: SelectOption[]) => {
			const newLanguages = [
				...fixedLanguages,
				...e.map((languageObject) => languageObject.value)
			];

			setHasError(true);

			apiPutConsultantData({
				email: userData.email.trim(),
				firstname: userData.firstName.trim(),
				lastname: userData.lastName.trim(),
				languages: newLanguages.filter(isUniqueLanguage)
			})
				.then(() => {
					const updatedUserData = { ...userData };

					setUserData(updatedUserData);
					setSelectedLanguages(newLanguages); // TODO CHECK IF THIS IS NEEDED
				})
				.catch(() => {
					setHasError(true);
				});
		};

		const languageOptions = spokenLanguages.map((language) => {
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
						type="infoLargeAlternative"
					/>
				</div>
				<div className="spokenLanguages__languageSelect">
					<Text
						text={translate('profile.spokenLanguages.prefix')}
						type="infoLargeAlternative"
					/>

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
				</div>
			</div>
		);
	};
