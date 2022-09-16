import { createContext, ReactNode } from 'react';
import { LegalLinkInterface } from '../interfaces/LegalLinkInterface';
import * as React from 'react';
import { config } from '../../resources/scripts/config';

export const LegalLinksContext = createContext<LegalLinkInterface[]>([]);

type TLegalLinksProvider = {
	legalLinks?: LegalLinkInterface[];
	children: ReactNode;
};

export function LegalLinksProvider({
	legalLinks,
	children
}: TLegalLinksProvider) {
	return (
		<LegalLinksContext.Provider
			value={legalLinks ?? config.legalLinks ?? []}
		>
			{children}
		</LegalLinksContext.Provider>
	);
}
