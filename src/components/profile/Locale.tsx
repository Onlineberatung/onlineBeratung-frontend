import React, { useContext } from 'react';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import { useTranslation } from 'react-i18next';
import { ReactComponent as LanguageIcon } from '../../resources/img/icons/language_filled.svg';

import './profile.styles';
import { SelectDropdown, SelectDropdownItem } from '../select/SelectDropdown';
import { LocaleContext } from '../../globalState';

export const Locale = () => {
	const { t: translate } = useTranslation(['common', 'languages']);
	const { locale, setLocale, selectableLocales } = useContext(LocaleContext);

	const languageSelectDropdown: SelectDropdownItem = {
		handleDropdownSelect: ({ value }) => setLocale(value),
		id: 'languageSelect',
		selectedOptions: selectableLocales.map((lng) => ({
			label: translate([lng, lng], { ns: 'languages' }),
			value: lng
		})),
		useIconOption: false,
		isSearchable: false,
		menuPlacement: 'bottom',
		defaultValue: {
			value: locale,
			label: translate([locale, locale], {
				ns: 'languages'
			})
		}
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
