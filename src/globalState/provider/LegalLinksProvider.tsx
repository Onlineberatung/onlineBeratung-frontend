import { createContext, ReactNode } from 'react';
import { LegalLinkInterface } from '../interfaces/LegalLinkInterface';
import * as React from 'react';
import { useAppConfig } from '../../hooks/useAppConfig';

export const LegalLinksContext = createContext<LegalLinkInterface[]>([]);

type TLegalLinksProvider = {
	legalLinks?: LegalLinkInterface[];
	children: ReactNode;
};

export function LegalLinksProvider({
	legalLinks,
	children
}: TLegalLinksProvider) {
	const settings = useAppConfig();

	return (
		<LegalLinksContext.Provider
			value={legalLinks ?? settings.legalLinks ?? []}
		>
			{children}
		</LegalLinksContext.Provider>
	);
}
