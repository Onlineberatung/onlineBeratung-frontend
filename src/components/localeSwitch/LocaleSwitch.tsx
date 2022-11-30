import * as React from 'react';
import './localeSwitch.styles';
import { ReactComponent as LanguageIconOutline } from '../../resources/img/icons/language_outline.svg';
import { ReactComponent as LanguageIconFilled } from '../../resources/img/icons/language_filled.svg';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useState } from 'react';
import { LocaleContext, UserDataContext } from '../../globalState';
import { apiPatchUserData } from '../../api/apiPatchUserData';
import { SelectDropdown, SelectDropdownItem } from '../select/SelectDropdown';

export interface LocaleSwitchProp {
	updateUserData?: boolean;
	vertical?: boolean;
	showIcon?: boolean;
	className?: string;
	iconSize?: number;
	label?: string;
	menuPlacement?: 'top' | 'bottom' | 'right';
	selectRef?: any;
	isInsideMenu?: boolean;
}

export const LocaleSwitch: React.FC<LocaleSwitchProp> = ({
	updateUserData,
	className,
	showIcon = true,
	vertical,
	iconSize = 20,
	menuPlacement = 'bottom',
	label,
	selectRef,
	isInsideMenu = false
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

	if (selectableLocales.length <= 1) {
		return null;
	}

	const languageSelectDropdown: SelectDropdownItem = {
		handleDropdownSelect: ({ value }) => setLocale(value),
		id: 'languageSelect',
		className,
		selectedOptions: selectableLocales.map((lng) => ({
			label: translate([lng, lng], { ns: 'languages' }),
			value: lng
		})),
		useIconOption: false,
		isSearchable: false,
		menuPlacement: menuPlacement,
		menuPosition: 'fixed',
		selectRef,
		isInsideMenu,
		defaultValue: {
			value: locale,
			label: (
				<>
					{showIcon && (
						<>
							{isInsideMenu && (
								<LanguageIconOutline
									width={iconSize}
									height={iconSize}
									className="navigation__icon__outline"
								/>
							)}
							<LanguageIconFilled
								width={iconSize}
								height={iconSize}
								className="navigation__icon__filled"
							/>
						</>
					)}{' '}
					<span>
						{label
							? label
							: translate([locale, locale], { ns: 'languages' })}
					</span>
				</>
			)
		},
		styleOverrides: {
			control: () => ({
				//'padding': '8px 12px',
				'height': 'auto',
				'border': 0,
				'&:hover': {
					border: 0
				},
				// Nav only
				'background': 'none',
				'padding': '0',
				'justifyContent': 'center'
			}),
			dropdownIndicator: () => ({
				display: 'none'
			}),
			singleValue: () => ({
				maxWidth: 'auto',
				position: 'relative',
				top: 0,
				transform: 'none',
				display: 'flex',
				flexDirection: vertical ? 'column' : 'row',
				alignItems: 'center'
			}),
			valueContainer: () => ({
				overflow: 'visible',
				display: 'flex'
			}),
			option: () => ({
				whiteSpace: 'nowrap',
				fontSize: '14px'
			})
		}
	};

	return (
		<div
			className={`localeSwitch ${
				vertical ? 'localeSwitch--vertical' : ''
			}`}
		>
			<SelectDropdown {...languageSelectDropdown} />
		</div>
	);
};
