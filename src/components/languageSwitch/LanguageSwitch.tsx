import * as React from 'react';
import './languageSwitch.styles';
import { ReactComponent as LanguageIcon } from '../../resources/img/icons/language.svg';
import { config } from '../../resources/scripts/config';
import Select from 'react-select';

export interface LanguageSwitchProp {
	appLanguage: any;
	setAppLanguage: Function;
}

export const LanguageSwitch: React.FC<LanguageSwitchProp> = ({
	appLanguage,
	setAppLanguage
}) => {
	const languageSwitchStyles = {
		control: (provided) => ({
			...provided,
			width: 100,
			border: 0,
			boxShadow: 'none',
			zIndex: 2,
			cursor: 'pointer'
		}),
		menu: ({ width, ...css }) => ({
			...css,
			width: 'max-content',
			minWidth: '100%'
		}),
		option: (styles) => ({
			...styles,
			cursor: 'pointer'
		}),
		input: () => ({
			color: 'transparent'
		})
	};

	const handleChangeSelect = (language) => {
		setAppLanguage(language);
		localStorage.setItem(`appLanguage`, JSON.stringify(language));
	};

	return (
		<div className={'languageSwitch'}>
			<LanguageIcon width={20} height={20} />
			<Select
				options={config.languages}
				defaultValue={appLanguage ? appLanguage : config.languages[0]}
				onChange={(language) => handleChangeSelect(language)}
				styles={languageSwitchStyles}
				components={{
					DropdownIndicator: () => null,
					IndicatorSeparator: () => null
				}}
			/>
		</div>
	);
};
