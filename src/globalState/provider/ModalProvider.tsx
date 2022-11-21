import * as React from 'react';
import {
	createContext,
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useState
} from 'react';
import {
	OVERLAY_ABSENCE,
	OVERLAY_E2EE,
	OVERLAY_RELEASE_NOTE,
	OVERLAY_REQUEST,
	OVERLAY_TWO_FACTOR_NAG,
	OVERLAY_TYPES
} from '../interfaces/AppConfig/OverlaysConfigInterface';
import { useAppConfig } from '../../hooks/useAppConfig';

type TOverlay = {
	id: string;
	name: OVERLAY_TYPES;
};

const DEFAULT_PRIORITY: OVERLAY_TYPES[] = [
	OVERLAY_E2EE,
	OVERLAY_REQUEST,
	OVERLAY_TWO_FACTOR_NAG,
	OVERLAY_RELEASE_NOTE,
	OVERLAY_ABSENCE
];

export const ModalContext = createContext<{
	overlays: TOverlay[];
	setOverlays: Dispatch<SetStateAction<TOverlay[]>>;
	addOverlay: (overlay: TOverlay) => void;
	removeOverlay: (unique: string) => void;
}>(null);

export function ModalProvider(props) {
	const settings = useAppConfig();
	const [priorities, setPriorities] = useState(DEFAULT_PRIORITY);
	const [overlays, setOverlays] = useState<TOverlay[]>([]);

	useEffect(() => {
		const overwrittenPriorities = settings?.overlays?.priority || [];
		setPriorities([
			...overwrittenPriorities,
			...DEFAULT_PRIORITY.filter(
				(priority) => !overwrittenPriorities.includes(priority)
			)
		]);
	}, [settings?.overlays?.priority]);

	const addOverlay = useCallback(
		(overlay: TOverlay) => {
			setOverlays((overlays) => {
				const newOverlays = [...overlays];

				newOverlays.push(overlay);

				// Sort overlays by its priority
				return newOverlays.sort((a, b) => {
					const aIdx = priorities.indexOf(a.name);
					const bIdx = priorities.indexOf(b.name);
					// If both not found keep order as rendered
					if (aIdx === -1 && bIdx === -1) {
						return 0;
					}
					if (aIdx === -1) {
						return 1;
					}
					if (bIdx === -1) {
						return -1;
					}
					return aIdx < bIdx ? -1 : 1;
				});
			});
		},
		[priorities]
	);

	const removeOverlay = useCallback((unique: string) => {
		setOverlays((overlays) => {
			const newOverlays = [...overlays];
			const idx = newOverlays.findIndex(
				(overlay) => overlay.id === unique
			);
			if (idx === -1) {
				return newOverlays;
			}
			newOverlays.splice(idx, 1);
			return newOverlays;
		});
	}, []);

	return (
		<ModalContext.Provider
			value={{
				overlays,
				setOverlays,
				addOverlay,
				removeOverlay
			}}
		>
			{props.children}
		</ModalContext.Provider>
	);
}
