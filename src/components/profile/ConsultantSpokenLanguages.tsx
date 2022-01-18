import React, { useState } from 'react';
import { translate } from '../../utils/translate';
import { Headline } from '../headline/Headline';
import { SelectDropdown, SelectOption } from '../select/SelectDropdown';
import { Text } from '../text/Text';

import './profile.styles';

interface ConsultantSpokenLanguagesProps {
	spokenLanguages: string[];
}

export const ConsultantSpokenLanguages: React.FC<ConsultantSpokenLanguagesProps> =
	({ spokenLanguages }) => {
		const [selectedLanguages, setSelectedLanguages] = useState(['de']);

		const selectHandler = (e: SelectOption[]) => {
			// API CALL -> then state
			setSelectedLanguages(
				e.map((languageObject) => languageObject.value)
			);
		};

		const languageOptions = spokenLanguages.map((language) => {
			return {
				value: language,
				label: translate(`languages.${language}`),
				isFixed: language === 'de' // fixed value
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
						defaultValue={languageOptions.filter(
							(option) =>
								selectedLanguages.indexOf(option.value) !== -1
						)}
					/>
				</div>
			</div>
		);
	};
