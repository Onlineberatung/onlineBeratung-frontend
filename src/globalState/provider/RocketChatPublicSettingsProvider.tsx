import * as React from 'react';
import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState
} from 'react';
import { RocketChatContext } from './RocketChatProvider';
import {
	EVENT_PUBLIC_SETTINGS_CHANGED,
	METHOD_PUBLIC_SETTINGS_GET,
	SUB_STREAM_NOTIFY_ALL
} from '../../components/app/RocketChat';
import useUpdatingRef from '../../hooks/useUpdatingRef';

export const SETTING_E2E_ENABLE = 'E2E_Enable';

interface ISetting {
	_id: typeof SETTING_E2E_ENABLE | string;
	requiredOnWizard: boolean;
	enterprise: boolean;
	value: any;
}

type RocketChatSubscriptionsContextProps = {
	settingsReady: boolean;
	settings: ISetting[];
	getSetting: (id: string) => ISetting | null;
};

export const RocketChatPublicSettingsContext =
	createContext<RocketChatSubscriptionsContextProps>(null);

type RocketChatPublicSettingsProviderProps = {
	children: ReactNode;
};

export const RocketChatPublicSettingsProvider = ({
	children
}: RocketChatPublicSettingsProviderProps) => {
	const { subscribe, unsubscribe, sendMethod, ready } =
		useContext(RocketChatContext);

	const subscribed = useRef(false);

	const [settingsReady, setSettingsReady] = useState(false);
	const [settings, setSettings] = useState<ISetting[]>([]);

	const handlePublicSettingsChanged = useUpdatingRef(
		useCallback(
			([status, setting]: [
				'inserted' | 'updated' | 'deleted',
				ISetting
			]) => {
				setSettings((settings) => {
					const newSettings = [...settings];

					const index = newSettings.findIndex(
						(s) => s._id === setting._id
					);

					switch (status) {
						case 'inserted':
						case 'updated':
							if (index >= 0) {
								newSettings.splice(index, 1, setting);
							} else {
								newSettings.push(setting);
							}
							break;
						case 'deleted':
							newSettings.splice(index, 1);
					}

					return newSettings;
				});
			},
			[]
		)
	);

	useEffect(() => {
		if (ready && !subscribed.current) {
			subscribed.current = true;
			// Get public settings
			sendMethod(METHOD_PUBLIC_SETTINGS_GET, null, (settings) => {
				setSettings(settings);

				subscribe(
					{
						name: SUB_STREAM_NOTIFY_ALL,
						event: EVENT_PUBLIC_SETTINGS_CHANGED
					},
					handlePublicSettingsChanged,
					{ useCollection: false, args: [] }
				);

				setSettingsReady(true);
			});
		} else if (!ready) {
			// Reconnect
			subscribed.current = false;
		}

		return () => {
			if (subscribed.current) {
				subscribed.current = false;
				unsubscribe(
					{
						name: SUB_STREAM_NOTIFY_ALL,
						event: EVENT_PUBLIC_SETTINGS_CHANGED
					},
					handlePublicSettingsChanged
				);
			}
		};
	}, [
		ready,
		sendMethod,
		subscribe,
		unsubscribe,
		subscribed,
		handlePublicSettingsChanged
	]);

	const getSetting = useCallback(
		(id: string) => settings.find((s) => s._id === id) ?? null,
		[settings]
	);

	return (
		<RocketChatPublicSettingsContext.Provider
			value={{ settingsReady, settings, getSetting }}
		>
			{children}
		</RocketChatPublicSettingsContext.Provider>
	);
};
