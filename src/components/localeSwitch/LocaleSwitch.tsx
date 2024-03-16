import * as React from 'react';
import './localeSwitch.styles';
import { ReactComponent as LanguageIconOutline } from '../../resources/img/icons/language_outline.svg';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useState } from 'react';
import { UserDataContext, LocaleContext } from '../../globalState';
import { apiPatchUserData } from '../../api/apiPatchUserData';
import {
	MENUPLACEMENT,
	MENUPLACEMENT_BOTTOM,
	SelectDropdown,
	SelectDropdownItem
} from '../select/SelectDropdown';
import { setValueInCookie } from '../sessionCookie/accessSessionCookie';
import LanguageIcon from '@mui/icons-material/Language';

export interface LocaleSwitchProp {
	updateUserData?: boolean;
	vertical?: boolean;
	showIcon?: boolean;
	className?: string;
	iconSize?: number;
	label?: string;
	menuPlacement?: MENUPLACEMENT;
	selectRef?: any;
	isInsideMenu?: boolean;
	color?: string;
	colorHover?: string;
	iconOnly?: boolean;
}

export const LocaleSwitch: React.FC<LocaleSwitchProp> = ({
	updateUserData,
	className,
	showIcon = true,
	vertical,
	iconSize = 20,
	menuPlacement = MENUPLACEMENT_BOTTOM,
	label,
	selectRef,
	isInsideMenu = false,
	color = 'var(--secondary)',
	colorHover = 'var(--hover-primary)',
	iconOnly
}) => {
	const { t: translate } = useTranslation(['common', 'languages']);

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
			})
				.then(userDataContext.reloadUserData)
				.catch(console.log)
				.finally(() => {
					setRequestInProgress(false);
				});
		}
	}, [locale, requestInProgress, updateUserData, userDataContext]);

	if (selectableLocales.length <= 1) {
		return null;
	}

	const languageSelectDropdown: SelectDropdownItem = {
		handleDropdownSelect: ({ value }) => {
			// If we wait to be set in LocaleSwitch sometimes we've an problem of reloading the requests
			// because we're always looking by "locale" from the context but the locale is changed before
			// we save the cookie so to fix this we set the cookie before the locale switch
			setValueInCookie('lang', value);
			setLocale(value);
		},
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
					{(showIcon || iconOnly) && (
						<>
							{isInsideMenu && (
								<LanguageIconOutline
									title={translate('app.selectLanguage')}
									aria-label={translate('app.selectLanguage')}
									width={iconSize}
									height={iconSize}
									className="navigation__icon__outline"
								/>
							)}
							<LanguageIcon
								aria-label={translate('app.selectLanguage')}
								width={iconSize}
								height={iconSize}
								className="navigation__icon__filled"
								color="inherit"
							/>
						</>
					)}{' '}
					{!iconOnly && (
						<span>
							{label
								? label
								: translate([locale, locale], {
										ns: 'languages'
									})}
						</span>
					)}
				</>
			)
		},
		styleOverrides: {
			menu: () => ({
				width: 'auto',
				...(iconOnly && {
					left: '-100%'
				})
			}),
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
			menuSwitch: () => {
				return (
					iconOnly && {
						display: 'inline-block'
					}
				);
			},
			singleValue: () => ({
				'maxWidth': 'auto',
				'position': 'relative',
				'top': 0,
				'transform': 'none',
				'display': 'flex',
				'flexDirection': vertical ? 'column' : 'row',
				'alignItems': 'center',
				color,
				'&:hover': {
					color: colorHover
				}
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
