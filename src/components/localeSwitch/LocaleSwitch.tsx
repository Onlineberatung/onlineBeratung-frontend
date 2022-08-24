import * as React from 'react';
import './localeSwitch.styles';
import { ReactComponent as LanguageIcon } from '../../resources/img/icons/language.svg';
import Select, { StylesConfig, SelectComponentsConfig } from 'react-select';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useState } from 'react';
import { LocaleContext, UserDataContext } from '../../globalState';
import { apiPatchUserData } from '../../api/apiPatchUserData';

export interface LocaleSwitchProp {
	updateUserData?: boolean;
	showIcon?: boolean;
	styles?: StylesConfig;
	components?: SelectComponentsConfig;
	menuIsOpen?: boolean;
	className?: string;
}

export const LocaleSwitch: React.FC<LocaleSwitchProp> = ({
	updateUserData,
	styles,
	components,
	className,
	menuIsOpen,
	showIcon = false
}) => {
	const { t: translate } = useTranslation('languages');

	const userDataContext = useContext(UserDataContext);
	const { locale, setLocale, selectableLocales } = useContext(LocaleContext);

	const [requestInProgress, setRequestInProgress] = useState(false);

	useEffect(() => {
		if (
			updateUserData &&
			userDataContext?.userData?.preferredLanguage !== locale &&
			!requestInProgress
		) {
			setRequestInProgress(true);
			apiPatchUserData({
				preferredLanguage: locale
			}).then(() => {
				userDataContext.setUserData({
					...userDataContext.userData,
					preferredLanguage: locale
				});
				setRequestInProgress(false);
			});
		}
	}, [locale, requestInProgress, updateUserData, userDataContext]);

	const localeSwitchStyles = {
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

	if (selectableLocales.length <= 1) {
		return null;
	}

	return (
		<div className={'localeSwitch'}>
			{showIcon && <LanguageIcon width={20} height={20} />}
			<Select
				className={className}
				menuIsOpen={menuIsOpen}
				options={selectableLocales.map((lng) => ({
					label: translate(lng, lng),
					value: lng
				}))}
				defaultValue={{
					value: locale,
					label: translate(locale, locale)
				}}
				onChange={({ value }) => setLocale(value)}
				styles={styles ?? localeSwitchStyles}
				components={
					components ?? {
						DropdownIndicator: () => null,
						IndicatorSeparator: () => null
					}
				}
			/>
		</div>
	);
};
