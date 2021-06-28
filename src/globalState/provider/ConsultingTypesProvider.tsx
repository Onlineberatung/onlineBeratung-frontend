import * as React from 'react';
import { createContext, useState, useContext } from 'react';
import { ConsultingTypeBasicInterface } from '../interfaces/ConsultingTypeInterface';

export const ConsultingTypesContext = createContext<{
	consultingTypes: Array<ConsultingTypeBasicInterface>;
	setConsultingTypes: (
		consultingTypes: Array<ConsultingTypeBasicInterface>
	) => void;
}>(null);

export function ConsultingTypesProvider(props) {
	const [consultingTypes, setConsultingTypes] = useState(null);

	return (
		<ConsultingTypesContext.Provider
			value={{ consultingTypes, setConsultingTypes }}
		>
			{props.children}
		</ConsultingTypesContext.Provider>
	);
}

export function getConsultingType(
	consultingTypes: Array<ConsultingTypeBasicInterface>,
	id?: number
) {
	if (id == null) {
		return undefined;
	}

	const consultingType = consultingTypes.find((cur) => cur.id === id);
	if (!consultingType) {
		throw new Error(`No consulting type found for id "${id}".`);
	}

	return consultingType;
}

export function useConsultingTypes() {
	const { consultingTypes } = useContext(ConsultingTypesContext);
	if (!consultingTypes) {
		throw new Error('`ConsultingTypesProvider` was not initialized.');
	}

	return consultingTypes;
}

export function useConsultingType(id?: number) {
	return getConsultingType(useConsultingTypes(), id);
}
