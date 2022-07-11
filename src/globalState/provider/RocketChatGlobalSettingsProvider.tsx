import * as React from 'react';
import { createContext, useCallback, useEffect, useState } from 'react';
import {
	apiRocketChatSettingsPublic,
	ISetting,
	SETTING_E2E_ENABLE
} from '../../api/apiRocketChatSettingsPublic';

const SETTINGS_TO_FETCH = [SETTING_E2E_ENABLE];

type RocketChatGlobalSettingsContextProps = {
	settings: ISetting[];
	getSetting: (id: string) => ISetting | null;
};

export const RocketChatGlobalSettingsContext =
	createContext<RocketChatGlobalSettingsContextProps>(null);

export const RocketChatGlobalSettingsProvider = (props) => {
	const [settings, setSettings] = useState<ISetting[]>([]);

	useEffect(() => {
		apiRocketChatSettingsPublic(SETTINGS_TO_FETCH).then((res) =>
			setSettings(res.settings)
		);
	}, []);

	const getSetting = useCallback(
		(id: string) => settings.find((s) => s._id === id) ?? null,
		[settings]
	);

	return (
		<RocketChatGlobalSettingsContext.Provider
			value={{ settings, getSetting }}
		>
			{props.children}
		</RocketChatGlobalSettingsContext.Provider>
	);
};
