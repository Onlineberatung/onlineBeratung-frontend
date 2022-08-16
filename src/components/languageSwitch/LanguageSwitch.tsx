import * as React from 'react';
import './languageSwitch.styles';
import { ReactComponent as PersonIcon } from '../../resources/img/icons/language.svg';
import { config } from '../../resources/scripts/config';
import i18n from '../../i18n';
import Select from 'react-select';

export const LanguageSwitch = () => {
	const setlanguage = (e) => {
		i18n.changeLanguage(e.value);
	};

	const customStyles = {
		control: (provided) => ({
			...provided,
			width: 160,
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
		})
	};

	return (
		<div className={'languageSwitch'}>
			<PersonIcon width={20} height={20} />
			<Select
				options={config.languages}
				defaultValue={config.languages[0]}
				onChange={setlanguage}
				styles={customStyles}
				components={{
					DropdownIndicator: () => null,
					IndicatorSeparator: () => null
				}}
			/>
		</div>
	);
};
