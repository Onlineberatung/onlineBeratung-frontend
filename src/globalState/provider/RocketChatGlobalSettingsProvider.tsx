import * as React from 'react';
import { createContext, useCallback, useEffect, useState } from 'react';
import { apiRocketChatSettings } from '../../api/apiRocketChatSettings';

export const SETTING_E2E_ENABLE = 'E2E_Enable';

const initialFetchSettings = [SETTING_E2E_ENABLE];

type RocketChatSetting = typeof SETTING_E2E_ENABLE;

interface ISetting {
	_id: typeof SETTING_E2E_ENABLE | string;
	requiredOnWizard: boolean;
	enterprise: boolean;
	value: any;
}

type RocketChatGlobalSettingsContextProps = {
	settings: ISetting[];
	getSetting: (id: string) => ISetting | null;
	isSettingEnabled: (setting: RocketChatSetting) => boolean;
};

export const RocketChatGlobalSettingsContext =
	createContext<RocketChatGlobalSettingsContextProps>(null);

export const RocketChatGlobalSettingsProvider = (props) => {
	const [settings, setSettings] = useState<ISetting[]>([]);

	useEffect(() => {
		(async () => {
			await fetchInitialRocketChatSettings();
		})();
	}, []);

	const fetchInitialRocketChatSettings = async () => {
		try {
			const data = await apiRocketChatSettings(initialFetchSettings);
			const newSettings: ISetting[] = [];
			initialFetchSettings.forEach((initialSetting) => {
				const setting = data.settings.find(
					(value) => value._id === initialSetting
				);
				if (!setting) {
					console.error(
						`error could not find rc settings: ${initialSetting}`
					);
				} else {
					newSettings.push(setting);
				}
			});

			console.log('got new settings', newSettings);
			setSettings((prevState) => [...prevState, ...newSettings]);
		} catch (e) {
			console.error('error fetching rocket chat settings');
		}
	};

	const getSetting = useCallback(
		(id: string) => settings.find((s) => s._id === id) ?? null,
		[settings]
	);

	const isSettingEnabled = useCallback(
		(setting: RocketChatSetting) => {
			return getSetting(setting)?.value === true;
		},
		[getSetting]
	);

	return (
		<RocketChatGlobalSettingsContext.Provider
			value={{ settings, getSetting, isSettingEnabled }}
		>
			{props.children}
		</RocketChatGlobalSettingsContext.Provider>
	);
};
