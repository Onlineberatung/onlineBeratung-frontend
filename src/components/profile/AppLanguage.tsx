import React, { useContext } from 'react';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import { useTranslation } from 'react-i18next';
import { ReactComponent as LanguageIcon } from '../../resources/img/icons/language.svg';

import './profile.styles';
import { config } from '../../resources/scripts/config';
import { SelectDropdown, SelectDropdownItem } from '../select/SelectDropdown';
import { apiPatchUserData } from '../../api/apiPatchUserData';
import { AppLanguageContext, UserDataContext } from '../../globalState';

export const AppLanguage = () => {
	const { t: translate } = useTranslation();
	const { userData, setUserData } = useContext(UserDataContext);
	const { appLanguage, setAppLanguage } = useContext(AppLanguageContext);

	const userLanguage = config.languages.find((language) => {
		return language.short === userData.preferredLanguage;
	});

	const languageSelectDropdown: SelectDropdownItem = {
		handleDropdownSelect: (language) => setlanguage(language),
		id: 'languageSelect',
		selectedOptions: config.languages,
		useIconOption: false,
		isSearchable: false,
		menuPlacement: 'bottom',
		defaultValue: appLanguage ? appLanguage : userLanguage
	};

	const setlanguage = (language) => {
		const updatedUserData = { ...userData };
		updatedUserData.preferredLanguage = language.short;
		apiPatchUserData(updatedUserData)
			.then(() => {
				setUserData(updatedUserData);
				setAppLanguage(language);
				localStorage.setItem(`appLanguage`, JSON.stringify(language));
			})
			.catch((error) => {
				console.log(error);
			});
	};

	return (
		<div className="appLanguage">
			<div className="profile__content__title">
				<div className="profile__content__header">
					<LanguageIcon className="icon" />
					<Headline
						text={translate('profile.appLanguage.title')}
						semanticLevel="5"
					/>
				</div>
				<Text
					text={translate('profile.appLanguage.info')}
					type="standard"
					className="tertiary"
				/>
			</div>
			<SelectDropdown {...languageSelectDropdown} />
		</div>
	);
};
