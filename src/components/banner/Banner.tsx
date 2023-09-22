import { createPortal } from 'react-dom';
import { ReactNode, useEffect, useState, MouseEvent, useCallback } from 'react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
const fixedStage = document.getElementsByClassName(
	'stage'
) as HTMLCollectionOf<HTMLDivElement>;
const fixedStageLayout = document.getElementsByClassName(
	'stageLayout'
) as HTMLCollectionOf<HTMLDivElement>;
const bannerContainer = document.getElementById('banner');

export const Banner = ({
	children,
	className = '',
	style,
	onClose
}: {
	children: ReactNode;
	className?: string;
	style?: Partial<CSSStyleDeclaration>;
	onClose?: (e: MouseEvent<HTMLButtonElement>) => void;
}) => {
	const [element] = useState(() => document.createElement('div'));
	const { t: translate } = useTranslation();
	const getBannersHeight = useCallback(() => {
		let bannersHeight = 0;
		const banner = bannerContainer?.children ?? [];
		for (let i = 0; i < banner.length; i++) {
			const style = window.getComputedStyle(banner[i]);

			if (style.display !== 'none') {
				bannersHeight += banner[i].clientHeight;
			}
		}
		return bannersHeight;
	}, []);

	useEffect(() => {
		if (className) {
			element.classList.add(className);
		}
		element.classList.add('banner__element');
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
		<>
			{children}
			{onClose && (
				<button
					onClick={onClose}
					className="close"
					aria-label={translate('app.closeBanner')}
					title={translate('app.closeBanner')}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						xmlnsXlink="http://www.w3.org/1999/xlink"
						width="72"
						height="72"
						viewBox="0 0 72 72"
					>
						<path
							id="x-a"
							d="M45.6482323,36.5771645 L65.5685425,56.4974747 C66.3495911,57.2785233 66.3495911,58.5448532 65.5685425,59.3259018 L59.3259018,65.5685425 C58.5448532,66.3495911 57.2785233,66.3495911 56.4974747,65.5685425 L36.5771645,45.6482323 L16.6568542,65.5685425 C15.8758057,66.3495911 14.6094757,66.3495911 13.8284271,65.5685425 L7.58578644,59.3259018 C6.80473785,58.5448532 6.80473785,57.2785233 7.58578644,56.4974747 L27.5060967,36.5771645 L7.58578644,16.6568542 C6.80473785,15.8758057 6.80473785,14.6094757 7.58578644,13.8284271 L13.8284271,7.58578644 C14.6094757,6.80473785 15.8758057,6.80473785 16.6568542,7.58578644 L36.5771645,27.5060967 L56.4974747,7.58578644 C57.2785233,6.80473785 58.5448532,6.80473785 59.3259018,7.58578644 L65.5685425,13.8284271 C66.3495911,14.6094757 66.3495911,15.8758057 65.5685425,16.6568542 L45.6482323,36.5771645 Z"
						/>
					</svg>
				</button>
			)}
		</>,
		element
	);
};
