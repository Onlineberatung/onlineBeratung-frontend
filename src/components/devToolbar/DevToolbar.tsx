import React, {
	ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState
} from 'react';
import * as ReactDOM from 'react-dom';
import './devToolbar.styles.scss';
import i18n from '../../i18n';

export const STORAGE_KEY_LOCALE = 'locale';
export const STORAGE_KEY_DEV_TOOLBAR = 'showDevTools';
export const STORAGE_KEY_POSITION = 'positionDevTools';
export const STORAGE_KEY_HIDDEN = 'hiddenDevTools';

export const STORAGE_KEY_2FA = '2fa';
export const STORAGE_KEY_2FA_DUTY = '2fa_duty';
export const STORAGE_KEY_RELEASE_NOTES = 'release_notes';
export const STORAGE_KEY_ERROR_BOUNDARY = 'error_boundary';
export const STORAGE_KEY_ENABLE_TRANSLATION_CHECK = 'enable_translation_check';

const DEVTOOLBAR_EVENT = 'devToolbar';

type TLocalStorageSwitch = {
	label: string;
	key: string;
	persistent?: boolean;
	value: string;
	className?: string;
	description?: string;
	postScript?: (value: string) => void;
};

const BUTTON = 'button';
type TButton = typeof BUTTON;
type TLocalStorageSwitchButton = TLocalStorageSwitch & {
	type: TButton;
	choices: string[];
};

const STATELESS = 'link';
type TStateless = typeof STATELESS;
type TLocalStorageSwitchStateless = TLocalStorageSwitch & {
	type: TStateless;
	choices: string[];
};

const SELECT = 'select';
type TSelect = typeof SELECT;
type TLocalStorageSwitchSelect = TLocalStorageSwitch & {
	type: TSelect;
	choices: { [key: string]: ReactNode };
};

const RADIO = 'radio';
type TRadio = typeof RADIO;
type TLocalStorageSwitchRadio = TLocalStorageSwitch & {
	type: TRadio;
	choices: { [key: string]: ReactNode };
};

const TOGGLE = 'toggle';
type TToggle = typeof TOGGLE;
type TLocalStorageSwitchToggle = TLocalStorageSwitch & {
	type: TToggle;
	choices: { [key: string]: ReactNode };
};

type TLocalStorageSwitches =
	| TLocalStorageSwitchStateless
	| TLocalStorageSwitchButton
	| TLocalStorageSwitchSelect
	| TLocalStorageSwitchRadio
	| TLocalStorageSwitchToggle;

const LOCAL_STORAGE_SWITCHES: TLocalStorageSwitches[] = [
	{
		label: 'Dev Toolbar',
		key: STORAGE_KEY_HIDDEN,
		type: STATELESS,
		choices: ['hidden', 'visible'],
		value: 'hidden',
		className: 'devToolbar__toggle'
	},
	{
		label: 'Dev Toolbar Position',
		key: STORAGE_KEY_POSITION,
		type: TOGGLE,
		choices: {
			right: <>&rarr;</>,
			bottom: <>&darr;</>
		},
		value: 'right',
		description: 'Position of the DevToolbar on the screen'
	},
	{
		label: 'Disable Dev Toolbar',
		key: STORAGE_KEY_DEV_TOOLBAR,
		type: BUTTON,
		choices: ['0', '1'],
		value: process.env.NODE_ENV === 'development' ? '1' : '0',
		description:
			'Disables the DevToolbar! The settings which were changed in the DevToolbar will not be resetet to its default!'
	},
	{
		label: 'Disable 2FA Dialog',
		key: STORAGE_KEY_2FA,
		type: TOGGLE,
		choices: { '0': 'Off', '1': 'On' },
		value: '1',
		description: 'Disable the 2FA dialog'
	},
	{
		label: '2FA Duty',
		key: STORAGE_KEY_2FA_DUTY,
		type: TOGGLE,
		choices: { '0': 'Off', '1': 'On' },
		value: '1',
		description:
			'Disable the duty to add a 2fa and show only the defautl 2fa dialog if enabled'
	},
	{
		label: 'Release Notes Dialog',
		key: STORAGE_KEY_RELEASE_NOTES,
		type: TOGGLE,
		choices: { '0': 'Off', '1': 'On' },
		value: '1',
		description:
			'Disable the release notes dialog if there are new release notes added'
	},
	{
		label: 'DEV Error Boundary',
		key: STORAGE_KEY_ERROR_BOUNDARY,
		type: TOGGLE,
		choices: { '0': 'Off', '1': 'On' },
		value:
			process.env.REACT_APP_DISABLE_ERROR_BOUNDARY &&
			parseInt(process.env.REACT_APP_DISABLE_ERROR_BOUNDARY) === 1
				? '0'
				: '1',
		description:
			'Disable the Error Boundary to prevent getting logged out when an error occurs. DEV only'
	},
	{
		label: 'DEV Translation check',
		key: STORAGE_KEY_ENABLE_TRANSLATION_CHECK,
		type: TOGGLE,
		choices: { '0': 'Off', '1': 'On' },
		value:
			process.env.REACT_APP_ENABLE_TRANSLATION_CHECK &&
			parseInt(process.env.REACT_APP_ENABLE_TRANSLATION_CHECK) === 1
				? '1'
				: '0',
		description:
			'Enable the translation check to see if all keys are defined in your translation files and keep them in sync. Errors will be printed to console. DEV only'
	},
	{
		label: 'DEV Toggle translation CIMODE',
		key: STORAGE_KEY_LOCALE,
		persistent: false,
		type: BUTTON,
		choices: ['cimode', localStorage.getItem(STORAGE_KEY_LOCALE) ?? 'de'],
		value: localStorage.getItem(STORAGE_KEY_LOCALE) ?? 'de',
		description: 'Enable cimode for translation to see translation keys.',
		postScript: (value) => {
			i18n.changeLanguage(
				value === 'cimode'
					? 'cimode'
					: localStorage.getItem(STORAGE_KEY_LOCALE) ?? 'de'
			);
		}
	}
];

export const useDevToolbar = () => {
	const [configs, setConfigs] = useState({});

	const readDevToobarLocalStorage = useCallback(() => {
		let configs = {};
		LOCAL_STORAGE_SWITCHES.forEach((localStorageSwitch) => {
			configs[localStorageSwitch.key] =
				localStorage.getItem(localStorageSwitch.key) ??
				localStorageSwitch.value;
		});
		setConfigs(configs);
	}, []);

	useEffect(() => {
		readDevToobarLocalStorage();

		window.addEventListener(DEVTOOLBAR_EVENT, readDevToobarLocalStorage);

		return () => {
			window.removeEventListener(
				DEVTOOLBAR_EVENT,
				readDevToobarLocalStorage
			);
		};
	}, [readDevToobarLocalStorage]);

	const getDevToolbarOption = useCallback(
		(key) => {
			return configs?.[key];
		},
		[configs]
	);

	return { getDevToolbarOption, configs };
};

/*
 * The wrapper should only have a minimum of code to prevent affection the application
 * if something is broken/miss configured in the DevToolbar but its disabled
 */
export const DevToolbarWrapper = () => {
	const devtoolbarContainer = useRef(null);
	const { getDevToolbarOption } = useDevToolbar();
	const [ready, setReady] = useState(false);

	useEffect(() => {
		if (devtoolbarContainer.current) {
			return;
		}
		if (getDevToolbarOption(STORAGE_KEY_DEV_TOOLBAR) === '1') {
			const container = document.createElement('div');
			container.id = 'devToolbar__container';
			container.className = 'devToolbar__container';
			document.body.appendChild(container);
			devtoolbarContainer.current = container;

			setReady(true);
		}
	}, [getDevToolbarOption]);

	useEffect(() => {
		const devToolbar = getDevToolbarOption(STORAGE_KEY_DEV_TOOLBAR);
		setReady((state) => {
			if (devToolbar === '1' && state === false) {
				return true;
			} else if (devToolbar === '0' && state === true) {
				return false;
			}
			return state;
		});
	}, [getDevToolbarOption]);

	if (!ready) {
		return null;
	}

	return ReactDOM.createPortal(<DevToolbar />, devtoolbarContainer.current);
};

export const DevToolbar = () => {
	const { getDevToolbarOption } = useDevToolbar();
	const [initialized, setInitialized] = useState(false);
	const [lcSwitches, setLcSwitches] = useState<TLocalStorageSwitches[]>([]);

	const initLcSwitches = useCallback(() => {
		setLcSwitches(
			LOCAL_STORAGE_SWITCHES.map((localStorageSwitch) => ({
				...localStorageSwitch,
				value:
					localStorage.getItem(localStorageSwitch.key) ??
					localStorageSwitch.value
			}))
		);
	}, []);

	useEffect(() => {
		initLcSwitches();
		setInitialized(true);
	}, [initLcSwitches]);

	useEffect(() => {
		const devToolbar = getDevToolbarOption(STORAGE_KEY_DEV_TOOLBAR);
		setInitialized((state) => {
			if (devToolbar === '1' && state === false) {
				return true;
			} else if (devToolbar === '0' && state === true) {
				return false;
			}
			return state;
		});
	}, [getDevToolbarOption]);

	const handleChangeLocalStorageSwitch = useCallback(
		(
			key,
			value,
			postScript?: (value: string) => void,
			persistent?: boolean
		) => {
			if (persistent) {
				localStorage.setItem(key, value);
			}

			setLcSwitches((lcSwitches) => {
				const changedLcSwitches = [...lcSwitches];
				const index = changedLcSwitches.findIndex(
					(lcSwitch) => lcSwitch.key === key
				);
				if (index < 0) {
					return lcSwitches;
				}
				changedLcSwitches.splice(index, 1, {
					...changedLcSwitches[index],
					value
				});
				window.dispatchEvent(new Event(DEVTOOLBAR_EVENT));
				return changedLcSwitches;
			});

			if (postScript) {
				postScript(value);
			}
		},
		[]
	);

	const reset = useCallback(() => {
		LOCAL_STORAGE_SWITCHES.forEach((localStorageSwitch) => {
			if (localStorageSwitch.key === STORAGE_KEY_DEV_TOOLBAR) {
				return;
			}

			localStorage.removeItem(localStorageSwitch.key);
		});
		window.dispatchEvent(new Event(DEVTOOLBAR_EVENT));
		initLcSwitches();
	}, [initLcSwitches]);

	if (!initialized) {
		return null;
	}

	return (
		<div
			className={`devToolbar devToolbar--${getDevToolbarOption(
				STORAGE_KEY_POSITION
			)} devToolbar--${getDevToolbarOption(STORAGE_KEY_HIDDEN)}`}
		>
			<div className="devToolbar__content">
				<h4>DEV Toolbar</h4>
				<hr />
				<div className="devToolbar__switches">
					{lcSwitches.map((localStorageSwitch) => (
						<LocalStorageSwitch
							key={localStorageSwitch.key}
							onChange={(value) =>
								handleChangeLocalStorageSwitch(
									localStorageSwitch.key,
									value,
									localStorageSwitch.postScript,
									localStorageSwitch.persistent ?? true
								)
							}
							localStorageSwitch={localStorageSwitch}
						/>
					))}
				</div>
				<hr />
				<button type="button" onClick={reset}>
					Reset
				</button>
				<div style={{ fontSize: '12px', lineHeight: '14px' }}>
					Resets all settings back to its defaults but keeps the dev
					toolbar visible.
				</div>
			</div>
		</div>
	);
};

const LocalStorageSwitch = ({
	localStorageSwitch,
	onChange
}: {
	localStorageSwitch: TLocalStorageSwitches;
	onChange: (value: string) => void;
}) => {
	switch (localStorageSwitch.type) {
		case BUTTON:
			return (
				<div className={localStorageSwitch.className}>
					<div className="devToolbar__switches__headline">
						<h5>{localStorageSwitch.label}</h5>
						{localStorageSwitch.description && (
							<div
								className="devToolbar__switches__description"
								title={localStorageSwitch.description}
							>
								i
							</div>
						)}
					</div>
					<hr />
					<button
						type="button"
						onClick={() =>
							onChange(
								localStorageSwitch.choices.find(
									(v) => v !== localStorageSwitch.value
								)
							)
						}
					>
						{localStorageSwitch.label}
					</button>
				</div>
			);
		case STATELESS:
			return (
				<div className={localStorageSwitch.className}>
					<span
						onClick={() =>
							onChange(
								localStorageSwitch.choices.find(
									(v) => v !== localStorageSwitch.value
								)
							)
						}
					>
						{localStorageSwitch.label}
					</span>
				</div>
			);
		case TOGGLE:
			return (
				<div className={localStorageSwitch.className}>
					<div className="devToolbar__switches__headline">
						<h5>{localStorageSwitch.label}</h5>
						{localStorageSwitch.description && (
							<div
								className="devToolbar__switches__description"
								title={localStorageSwitch.description}
							>
								i
							</div>
						)}
					</div>
					<hr />
					<div className="flex">
						{Object.keys(localStorageSwitch.choices).map(
							(value) => (
								<button
									key={`${localStorageSwitch.key}-${value}`}
									className={
										localStorageSwitch.value === value
											? 'active'
											: ''
									}
									type="button"
									onClick={() => onChange(value)}
								>
									{localStorageSwitch.choices[value]}
								</button>
							)
						)}
					</div>
				</div>
			);
		case SELECT:
			return (
				<div className={localStorageSwitch.className}>
					<div className="devToolbar__switches__headline">
						<h5>{localStorageSwitch.label}</h5>
						{localStorageSwitch.description && (
							<div
								className="devToolbar__switches__description"
								title={localStorageSwitch.description}
							>
								i
							</div>
						)}
					</div>
					<hr />
					<select
						onChange={({ target: { value } }) => onChange(value)}
					>
						{Object.keys(localStorageSwitch.choices).map(
							(value) => (
								<option
									key={`${localStorageSwitch.key}-${value}`}
									value={value}
								>
									{localStorageSwitch.choices[value]}
								</option>
							)
						)}
					</select>
				</div>
			);
		case RADIO:
			return (
				<div className={localStorageSwitch.className}>
					<div className="devToolbar__switches__headline">
						<h5>{localStorageSwitch.label}</h5>
						{localStorageSwitch.description && (
							<div
								className="devToolbar__switches__description"
								title={localStorageSwitch.description}
							>
								i
							</div>
						)}
					</div>
					<hr />
					<div>
						{Object.keys(localStorageSwitch.choices).map(
							(value) => (
								<div key={`${localStorageSwitch.key}-${value}`}>
									<input
										type="radio"
										name={localStorageSwitch.key}
										value={value.toString()}
										checked={
											localStorageSwitch.value ===
											value.toString()
										}
										onChange={() =>
											onChange(value.toString())
										}
									/>{' '}
									{localStorageSwitch.choices[value]}
								</div>
							)
						)}
					</div>
				</div>
			);
	}

	return null;
};
