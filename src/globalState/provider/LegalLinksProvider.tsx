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
						// For React Router Link component, we should return relative paths
						// Extract pathname from URL if it's already a full URL
						let path = url;
						if (url.match(/^https?:\/\//)) {
							// It's a full URL, extract the pathname
							try {
								const urlObj = new URL(url);
								path = urlObj.pathname;
							} catch (e) {
								path = url;
							}
						}
						
						// If params are provided, append them as query string
						if (params && Object.keys(params).length > 0) {
							const queryParams = Object.entries(params)
								.filter(([, value]) => !!value)
								.map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
								.join('&');
							return queryParams ? `${path}?${queryParams}` : path;
						}
						
						return path;
					}
				})
			),
		[externalLegalLinks, settings.legalLinks]
	);

	return (
		<LegalLinksContext.Provider value={legalLinks}>
			{children}
		</LegalLinksContext.Provider>
	);
}
