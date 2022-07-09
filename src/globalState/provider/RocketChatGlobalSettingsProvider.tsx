import * as React from 'react';
import { createContext, useCallback, useEffect, useState } from 'react';
import { apiRocketChatSettingsPublic } from '../../api/apiRocketChatSettingsPublic';

export const SETTING_E2E_ENABLE = 'E2E_Enable';

const initialFetchSettings = [SETTING_E2E_ENABLE];

interface ISetting {
	_id: typeof SETTING_E2E_ENABLE | string;
	requiredOnWizard: boolean;
	enterprise: boolean;
	value: any;
}

type RocketChatGlobalSettingsContextProps = {
	settings: ISetting[];
	getSetting: (id: string) => ISetting | null;
};

export const RocketChatGlobalSettingsContext =
	createContext<RocketChatGlobalSettingsContextProps>(null);

export const RocketChatGlobalSettingsProvider = (props) => {
	const [settings, setSettings] = useState<ISetting[]>([]);

	useEffect(() => {
		apiRocketChatSettingsPublic(initialFetchSettings).then(({ settings }) =>
			setSettings(settings)
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
