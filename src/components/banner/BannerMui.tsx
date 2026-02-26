import { createPortal } from 'react-dom';
import { ReactNode, useEffect, useState, MouseEvent, useCallback } from 'react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './bannerMui.styles.scss';

const fixedStage = document.getElementsByClassName(
	'stage'
) as HTMLCollectionOf<HTMLDivElement>;
const fixedStageLayout = document.getElementsByClassName(
	'stageLayout'
) as HTMLCollectionOf<HTMLDivElement>;
const bannerContainer = document.getElementById('banner');

export const BannerMui = ({
	children,
	className = '',
	style,
	onClose,
	severity = 'info'
}: {
	children: ReactNode;
	className?: string;
	style?: Partial<CSSStyleDeclaration>;
	onClose?: (e: MouseEvent<HTMLButtonElement>) => void;
	severity?: 'error' | 'warning' | 'info' | 'success';
}) => {
	const [element] = useState(() => document.createElement('div'));
	const { t: translate } = useTranslation();
	
	const getBannersHeight = useCallback(() => {
		let bannersHeight = 0;
		const banner = bannerContainer?.children ?? [];
		for (let i = 0; i < banner.length; i++) {
			const computedStyle = window.getComputedStyle(banner[i]);

			if (computedStyle.display !== 'none') {
				bannersHeight += banner[i].clientHeight;
			}
		}
		return bannersHeight;
	}, []);

	useEffect(() => {
		if (className) {
			element.classList.add(className);
		}
		element.classList.add('banner-mui__element');
		bannerContainer?.appendChild(element);

		if (style) {
			Object.keys(style).forEach((s) => {
				element.style[s] = style[s];
			});
		}

		if (fixedStage?.[0]) {
			fixedStage[0].style.paddingTop = `${bannerContainer.clientHeight}px`;
		}
		if (fixedStageLayout?.[0]) {
			const bannersHeight = getBannersHeight();
			fixedStageLayout[0].style.paddingTop = `${bannersHeight}px`;
			fixedStageLayout[0].style.marginTop = `-${bannersHeight}px`;
		}

		return () => {
			bannerContainer.removeChild(element);

			if (fixedStage?.[0]) {
				fixedStage[0].style.paddingTop = `0px`;
			}
			if (fixedStageLayout?.[0]) {
				const bannersHeight = getBannersHeight();
				fixedStageLayout[0].style.paddingTop = `${bannersHeight}px`;
				fixedStageLayout[0].style.marginTop = `-${bannersHeight}px`;
			}
		};
	}, [className, element, getBannersHeight, style]);

	return createPortal(
		<Alert
			severity={severity}
			className="banner-mui"
			action={
				onClose && (
					<IconButton
						onClick={onClose}
						aria-label={translate('app.closeBanner')}
						title={translate('app.closeBanner')}
						size="small"
					>
						<CloseIcon />
					</IconButton>
				)
			}
		>
			{children}
		</Alert>,
		element
	);
};
