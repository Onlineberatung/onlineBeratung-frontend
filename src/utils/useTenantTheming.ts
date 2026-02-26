import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
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

/**
 * Convert HSL(A) to hex or rgba format for CSS
 * @param h Hue (0-360)
 * @param s Saturation (0-100)
 * @param l Lightness (0-100)
 * @param a Alpha (0-1) optional
 * @return {string} CSS color string in hex or rgba format
 * @throws {Error} If input values are invalid or out of range
 */
const hslToHex = (h: number, s: number, l: number, a?: number): string => {
	// Input validation to prevent NaN/Infinity and ensure valid ranges
	if (typeof h !== 'number' || !isFinite(h)) {
		throw new Error('Hue must be a finite number');
	}
	if (typeof s !== 'number' || !isFinite(s)) {
		throw new Error('Saturation must be a finite number');
	}
	if (typeof l !== 'number' || !isFinite(l)) {
		throw new Error('Lightness must be a finite number');
	}
	if (a !== undefined && (typeof a !== 'number' || !isFinite(a))) {
		throw new Error('Alpha must be a finite number');
	}

	// Clamp values to valid ranges
	h = Math.max(0, Math.min(360, h)) % 360;
	s = Math.max(0, Math.min(100, s)) / 100;
	l = Math.max(0, Math.min(100, l)) / 100;
	if (a !== undefined) {
		a = Math.max(0, Math.min(1, a));
	}

	const c = (1 - Math.abs(2 * l - 1)) * s;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = l - c / 2;
	let r = 0;
	let g = 0;
	let b = 0;

	if (0 <= h && h < 60) {
		r = c;
		g = x;
		b = 0;
	} else if (60 <= h && h < 120) {
		r = x;
		g = c;
		b = 0;
	} else if (120 <= h && h < 180) {
		r = 0;
		g = c;
		b = x;
	} else if (180 <= h && h < 240) {
		r = 0;
		g = x;
		b = c;
	} else if (240 <= h && h < 300) {
		r = x;
		g = 0;
		b = c;
	} else if (300 <= h && h < 360) {
		r = c;
		g = 0;
		b = x;
	}

	// Clamp RGB values to valid 0-255 range
	r = Math.max(0, Math.min(255, Math.round((r + m) * 255)));
	g = Math.max(0, Math.min(255, Math.round((g + m) * 255)));
	b = Math.max(0, Math.min(255, Math.round((b + m) * 255)));

	if (a !== undefined) {
		return `rgba(${r}, ${g}, ${b}, ${a})`;
	}

	const toHex = (n: number) => {
		const hex = n.toString(16);
		return hex.length === 1 ? '0' + hex : hex;
	};

	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
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
			: '#fff';

	const primaryColorContrastSafe =
		primaryColor && contrast.ratio('#fff', primaryColor) < contrastThreshold
			? 'var(--skin-color-primary-foreground-dark)'
			: primaryColor;

	// Calculate hover color HSL
	const hoverHsl = primaryHSL
		? {
				h: primaryHSL.h,
				s: primaryHSL.s,
				l:
					primaryColor &&
					contrast.ratio('#fff', primaryColor) < contrastThreshold
						? primaryHSL.l + 10 // lighter
						: primaryHSL.l - 10 // darker
			}
		: null;

	// Use getOrCreateHeadNode to ensure the style tag persists through Vite HMR
	const styleNode = getOrCreateHeadNode('style', { id: 'tenant-theming' });
	styleNode.textContent = `
		:root {
		--skin-color-primary: ${primaryColor};
		--skin-color-primary-hover: ${
			hoverHsl
				? adjustHSLColor({
						color: hoverHsl,
						adjust: hoverHsl.l
					})
				: ''
		};
		--skin-color-primary-hover-translucent: ${
			hoverHsl ? hslToHex(hoverHsl.h, hoverHsl.s, hoverHsl.l, 0.2) : ''
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
	`;
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
		if (tenant.theming.primaryColor) {
			injectCss(tenant.theming);
		}

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

	const cypressTenantEnabled = useMemo(
		() => (window as any).Cypress?.env('TENANT_ENABLED'),
		[]
	);

	const onTenantServiceResponse = useCallback(
		(tenant: TenantDataInterface) => {
			// If no subdomain and Cypress tenant not enabled, use default settings
			// But still decode and apply theming if tenant data is available
			if (!subdomain && cypressTenantEnabled !== '1' && !tenant) {
				tenantContext?.setTenant({ settings } as any);
				return;
			}

			// Process tenant data
			const decodedTenant = JSON.parse(JSON.stringify(tenant));

			if (decodedTenant.theming) {
				decodedTenant.theming.logo = decodeHTML(tenant.theming.logo);
				decodedTenant.theming.associationLogo = decodeHTML(
					tenant.theming.associationLogo
				);
				decodedTenant.theming.favicon = decodeHTML(
					tenant.theming.favicon
				);
			}
			if (decodedTenant.content) {
				decodedTenant.content.claim = decodeHTML(tenant.content.claim);
			}
			decodedTenant.name = decodeHTML(tenant.name);

			// Always apply theming if tenant data is available
			applyTheming(decodedTenant);
			tenantContext?.setTenant(decodedTenant);
		},
		[settings, subdomain, tenantContext, cypressTenantEnabled]
	);

	useEffect(() => {
		if (!settings.useTenantService) {
			return;
		}

		apiGetTenantTheming()
			.then(onTenantServiceResponse)
			.catch((error) => {
				console.error('Theme could not be loaded', error);
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
