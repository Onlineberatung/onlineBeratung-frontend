import { createContext, ReactNode, useCallback, useMemo } from 'react';
import { LegalLinkInterface } from '../interfaces/LegalLinkInterface';
import * as React from 'react';
import { useAppConfig } from '../../hooks/useAppConfig';

export type TProvidedLegalLink = Omit<LegalLinkInterface, 'url'> & {
	getUrl: (params?: {
		[key: string]: string | number | null | undefined;
	}) => string;
};

export const LegalLinksContext = createContext<TProvidedLegalLink[]>([]);

type TLegalLinksProvider = {
	legalLinks?: LegalLinkInterface[];
	children: ReactNode;
};

export function LegalLinksProvider({
	legalLinks: externalLegalLinks,
	children
}: TLegalLinksProvider) {
	const settings = useAppConfig();

	const getUrl = useCallback(
		(
			url: string,
			params: { [key: string]: string | number | null | undefined }
		) => {
			const urlObject = Object.entries(params || {})
				.filter(([, value]) => !!value)
				.map(([key, value]) => [
					key,
					typeof value === 'number' ? value.toString() : value
				])
				.reduce((acc, [key, value]) => {
					acc.searchParams.append(key, value);
					return acc;
				}, new URL(url));
			return urlObject.toString();
		},
		[]
	);

	const legalLinks = useMemo<TProvidedLegalLink[]>(
		() =>
			(externalLegalLinks ?? settings.legalLinks ?? []).map(
				({ url, ...legalLink }) => ({
					...legalLink,
					getUrl: (params: {
						[key: string]: string | number | null | undefined;
					}) => {
						// URL from config can be:
						// 1. Full URL with origin (e.g., "http://localhost:5173/impressum")
						// 2. Relative path (e.g., "/impressum")
						// We should NOT prepend origin if URL already starts with http/https
						const fullUrl = url.match(/^https?:\/\//)
							? url
							: url.startsWith('/')
							? `${window.location.origin}${url}`
							: `${window.location.origin}/${url}`;
						return getUrl(fullUrl, params);
					}
				})
			),
		[externalLegalLinks, settings.legalLinks, getUrl]
	);

	return (
		<LegalLinksContext.Provider value={legalLinks}>
			{children}
		</LegalLinksContext.Provider>
	);
}
