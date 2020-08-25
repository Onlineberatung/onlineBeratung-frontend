import * as React from 'react';
import {
	IconEnvelope,
	IconLock,
	IconPerson,
	IconPin,
	IconCaritasWhite,
	IconInVia,
	IconKreuzbund,
	IconRaphaelswerk,
	IconSKF,
	IconSKM
} from './index';

export const ICON_KEYS = {
	ENVELOPE: 'ENVELOPE',
	LOCK: 'LOCK',
	PERSON: 'PERSON',
	PIN: 'PIN'
};

export const LOGO_KEYS = {
	CARITAS_WHITE: 'CARITAS_WHITE',
	IN_VIA: 'IN_VIA',
	KREUZBUND: 'KREUZBUND',
	RAPHAELSWERK: 'RAPHAELSWERK',
	SKF: 'SKF',
	SKM: 'SKM'
};

export interface IconProps {
	name: string;
	className?: string;
}

export const Icon = (props: IconProps) => {
	switch (props.name) {
		case ICON_KEYS.ENVELOPE:
			return <IconEnvelope {...props} />;
		case ICON_KEYS.LOCK:
			return <IconLock {...props} />;
		case ICON_KEYS.PERSON:
			return <IconPerson {...props} />;
		case ICON_KEYS.LOCK:
			return <IconPin {...props} />;
		case LOGO_KEYS.CARITAS_WHITE:
			return <IconCaritasWhite {...props} />;
		case LOGO_KEYS.IN_VIA:
			return <IconInVia {...props} />;
		case LOGO_KEYS.KREUZBUND:
			return <IconKreuzbund {...props} />;
		case LOGO_KEYS.RAPHAELSWERK:
			return <IconRaphaelswerk {...props} />;
		case LOGO_KEYS.SKF:
			return <IconSKF {...props} />;
		case LOGO_KEYS.SKM:
			return <IconSKM {...props} />;
		default:
			return;
	}
};
