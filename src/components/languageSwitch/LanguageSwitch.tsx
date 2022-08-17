import * as React from 'react';
import './languageSwitch.styles';
import { ReactComponent as LanguageIcon } from '../../resources/img/icons/language.svg';
import { config } from '../../resources/scripts/config';
import Select from 'react-select';
import { useContext } from 'react';
import { AppLanguageContext } from '../../globalState';

export const LanguageSwitch = () => {
	const { appLanguage, setAppLanguage } = useContext(AppLanguageContext);

	const languageSwitchStyles = {
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
		}),
		input: () => ({
			color: 'transparent'
		})
	};

	return (
		<div className={'languageSwitch'}>
			<LanguageIcon width={20} height={20} />
			<Select
				options={config.languages}
				defaultValue={appLanguage ? appLanguage : config.languages[0]}
				onChange={(e) => setAppLanguage(e)}
				styles={languageSwitchStyles}
				components={{
					DropdownIndicator: () => null,
					IndicatorSeparator: () => null
				}}
			/>
		</div>
	);
};
