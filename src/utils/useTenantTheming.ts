import { useCallback, useContext, useEffect, useState } from 'react';
import { apiGetTenantTheming } from '../api/apiGetTenantTheming';
import { TenantContext, useLocaleData } from '../globalState';
import { TenantDataInterface } from '../globalState/interfaces';
import getLocationVariables from './getLocationVariables';
import decodeHTML from './decodeHTML';
import contrast from 'get-contrast';
import { useAppConfig } from '../hooks/useAppConfig';

const RGBToHSL = (r, g, b) => {
	// Make r, g, and b fractions of 1
	r /= 255;
	g /= 255;
	b /= 255;

	// Find greatest and smallest channel values
	const cmin = Math.min(r, g, b);
	const cmax = Math.max(r, g, b);
	const delta = cmax - cmin;
	let h;
	let s;
	let l;

	// Calculate hue
	// No difference
	if (delta === 0) h = 0;
	// Red is max
	else if (cmax === r) h = ((g - b) / delta) % 6;
	// Green is max
	else if (cmax === g) h = (b - r) / delta + 2;
	// Blue is max
	else h = (r - g) / delta + 4;

	h = Math.round(h * 60);

	// Make negative hues positive behind 360°
	if (h < 0) h += 360;

	// Calculate lightness
	l = (cmax + cmin) / 2;

	// Calculate saturation
	s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

	// Multiply l and s by 100
	s = +(s * 100).toFixed(1);
	l = +(l * 100).toFixed(1);

	return { h, s, l };
};

const hexToRGB = (hex) => {
	let r = '0';
	let g = '0';
	let b = '0';

	// 3 digits
	if (hex.length === 4) {
		r = '0x' + hex[1] + hex[1];
		g = '0x' + hex[2] + hex[2];
		b = '0x' + hex[3] + hex[3];

		// 6 digits
	} else if (hex.length === 7) {
		r = '0x' + hex[1] + hex[2];
		g = '0x' + hex[3] + hex[4];
		b = '0x' + hex[5] + hex[6];
	}

	return RGBToHSL(r, g, b);
};

/**
 * adjusting colors via lightness, for hover effects, etc.
 * @param color {object}
 * @param adjust {number}
 * @return {string}
 */
const adjustHSLColor = ({
	color,
	adjust
}: {
	color: Record<string, any>;
	adjust: number;
}): string => {
	return `hsl(${color.h}, ${color.s}%, ${adjust}%)`;
};

const injectCss = ({ primaryColor, secondaryColor }) => {
	// make HSL colors over RGB from hex
	const primaryHSL = hexToRGB(primaryColor);
	const secondaryHSL = secondaryColor && hexToRGB(secondaryColor);
	// The level AA WCAG scrore requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text (at least 18pt) or bold text.
	const contrastThreshold = 4.5;

	// Intended to be used as the foreground color when text
	// or icons are used on top of the primary color.
	const textColorContrastSwitch =
		primaryColor && contrast.ratio('#fff', primaryColor) > contrastThreshold
			? 'var(--skin-color-primary-foreground-light)'
			: 'var(--skin-color-primary-foreground-dark)';

	// Intended to be used as the foreground color when text
	// or icons are used on top of the secondary color.
	const textColorSecondaryContrastSwitch =
		secondaryColor &&
		contrast.ratio('#fff', secondaryColor) > contrastThreshold
			? 'var(--skin-color-primary-foreground-light)'
			: 'var(--skin-color-primary-foreground-dark)';

	const secondaryColorContrastSafe =
		secondaryColor &&
		contrast.ratio('#fff', secondaryColor) > contrastThreshold
			? secondaryColor
			: 'var(--skin-color-default)';

	const primaryColorContrastSafe =
		primaryColor && contrast.ratio('#fff', primaryColor) < contrastThreshold
			? 'var(--skin-color-primary-foreground-dark)'
			: primaryColor;

	document.head.insertAdjacentHTML(
		'beforeend',
		`<style>
		:root {
		--skin-color-primary: ${primaryColor};
		--skin-color-primary-hover: ${
			primaryColor &&
			contrast.ratio('#fff', primaryColor) < contrastThreshold
				? adjustHSLColor({
						color: primaryHSL,
						adjust: primaryHSL.l + 10
					}) // lighter
				: adjustHSLColor({
						color: primaryHSL,
						adjust: primaryHSL.l - 1
					}) // darker
		};
		--skin-color-secondary: ${secondaryColor || ''};
		--skin-color-secondary-light: ${
			secondaryHSL
				? adjustHSLColor({
						color: secondaryHSL,
						adjust: 90
					})
				: ''
		};
		--skin-color-secondary-contrast-safe: ${secondaryColorContrastSafe || ''};
		--skin-color-primary-contrast-safe: ${primaryColorContrastSafe};
		--text-color-contrast-switch: ${textColorContrastSwitch};
		--text-color-secondary-contrast-switch: ${textColorSecondaryContrastSwitch};
		}
		</style>`
	);
};

const getOrCreateHeadNode = (
	tagName: string,
	attributes?: Record<string, string>
) => {
	let selector = tagName;
	if (attributes) {
		selector += '[';
		selector += Object.entries(attributes)
			.map(([key, value]) => `${key}="${value}"`)
			.join(' ');
		selector += ']';
	}

	let node = document.querySelector(selector);
	if (!node) {
		node = document.createElement(tagName);
		if (attributes) {
			Object.entries(attributes).forEach(([key, value]) => {
				node.setAttribute(key, value);
			});
		}
		document.head.appendChild(node);
	}

	return node;
};

const applyTheming = (tenant: TenantDataInterface) => {
	if (tenant.theming) {
		injectCss(tenant.theming);

		getOrCreateHeadNode('meta', { name: 'theme-color' }).setAttribute(
			'content',
			tenant.theming.primaryColor
		);

		if (tenant.theming.favicon) {
			getOrCreateHeadNode('link', { rel: 'icon' }).setAttribute(
				'href',
				tenant.theming.favicon
			);
		}
	}

	if (tenant.name) {
		getOrCreateHeadNode('title').textContent = tenant.name;
		getOrCreateHeadNode('meta', { property: 'og:title' }).setAttribute(
			'content',
			tenant.name
		);
	}
	if (tenant.content?.claim) {
		getOrCreateHeadNode('meta', { name: 'description' }).setAttribute(
			'content',
			tenant.content.claim
		);
		getOrCreateHeadNode('meta', {
			property: 'og:description'
		}).setAttribute('content', tenant.content.claim);
	}
};

const useTenantTheming = () => {
	const settings = useAppConfig();
	const tenantContext = useContext(TenantContext);
	const { locale } = useLocaleData();
	const { subdomain } = getLocationVariables();
	const [isLoadingTenant, setIsLoadingTenant] = useState(
		settings.useTenantService
	);

	const onTenantServiceResponse = useCallback(
		(tenant: TenantDataInterface) => {
			if (!subdomain) {
				tenantContext?.setTenant({ settings } as any);
			} else {
				// ToDo: See VIC-428 + VIC-427
				const decodedTenant = JSON.parse(JSON.stringify(tenant));

				decodedTenant.theming.logo = decodeHTML(tenant.theming.logo);
				decodedTenant.theming.favicon = decodeHTML(
					tenant.theming.favicon
				);
				decodedTenant.content.claim = decodeHTML(tenant.content.claim);
				decodedTenant.name = decodeHTML(tenant.name);

				applyTheming(decodedTenant);
				tenantContext?.setTenant(decodedTenant);
			}
			return;
		},
		[settings, subdomain, tenantContext]
	);

	useEffect(() => {
		if (!settings.useTenantService) {
			return;
		}

		apiGetTenantTheming()
			.then(onTenantServiceResponse)
			.catch((error) => {
				console.log('Theme could not be loaded', error);
			})
			.finally(() => {
				setIsLoadingTenant(false);
			});
		// False positive
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tenantContext?.setTenant, subdomain, locale]);

	return isLoadingTenant;
};

export default useTenantTheming;
