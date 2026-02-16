import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useTenant } from '../../globalState';

interface SEOProps {
	title?: string;
	description?: string;
	keywords?: string;
	type?: 'website' | 'article';
	noIndex?: boolean;
	canonical?: string;
}

/**
 * SEO component for managing page metadata
 * Uses react-helmet-async for server-side rendering support
 */
export const SEO = ({
	title,
	description,
	keywords,
	type = 'website',
	noIndex = false,
	canonical
}: SEOProps) => {
	const { t: translate } = useTranslation();
	const tenant = useTenant();

	const siteTitle = tenant?.name || translate('app.stage.title');
	const siteClaim = tenant?.content?.claim || translate('app.claim');
	const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
	const fullDescription = description || siteClaim;

	const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
	const currentUrl =
		typeof window !== 'undefined' ? window.location.href : '';
	const canonicalUrl = canonical || currentUrl;

	return (
		<Helmet>
			{/* Basic Meta Tags */}
			<title>{fullTitle}</title>
			<meta name="description" content={fullDescription} />
			{keywords && <meta name="keywords" content={keywords} />}
			{canonical && <link rel="canonical" href={canonicalUrl} />}

			{/* Robots */}
			{noIndex && <meta name="robots" content="noindex,nofollow" />}

			{/* Open Graph / Facebook */}
			<meta property="og:type" content={type} />
			<meta property="og:url" content={currentUrl} />
			<meta property="og:title" content={fullTitle} />
			<meta property="og:description" content={fullDescription} />
			<meta property="og:site_name" content={siteTitle} />
			{tenant?.theming?.logo && (
				<meta property="og:image" content={tenant.theming.logo} />
			)}

			{/* Twitter */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:url" content={currentUrl} />
			<meta name="twitter:title" content={fullTitle} />
			<meta name="twitter:description" content={fullDescription} />
			{tenant?.theming?.logo && (
				<meta name="twitter:image" content={tenant.theming.logo} />
			)}

			{/* Structured Data - Organization */}
			{tenant && (
				<script type="application/ld+json">
					{JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'Organization',
						name: siteTitle,
						description: fullDescription,
						url: siteUrl,
						...(tenant.theming?.logo && {
							logo: tenant.theming.logo
						})
					})}
				</script>
			)}

			{/* Structured Data - WebSite */}
			<script type="application/ld+json">
				{JSON.stringify({
					'@context': 'https://schema.org',
					'@type': 'WebSite',
					name: siteTitle,
					url: siteUrl
				})}
			</script>
		</Helmet>
	);
};
