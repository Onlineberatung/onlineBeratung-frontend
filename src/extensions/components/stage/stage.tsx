import clsx from 'clsx';
import * as React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useState, useEffect, useRef, useCallback, MouseEvent } from 'react';
import { ReactComponent as Logo } from './logo.svg';
import { ReactComponent as Loader } from './loader.svg';
import './stage.styles';
import { Banner } from '../../../components/banner/Banner';
import { Headline } from '../../../components/headline/Headline';

export interface StageProps {
	className?: string;
	hasAnimation?: boolean;
	isReady?: boolean;
}

export const Stage = ({
	className,
	hasAnimation,
	isReady = true
}: StageProps) => {
	const rootNodeRef = useRef(null);
	const [isOpen, setIsOpen] = useState(!hasAnimation);
	const [hasAnimationFinished, setHasAnimationFinished] = useState(false);
	const { t: translate } = useTranslation();

	useEffect(() => {
		if (hasAnimation && isReady) {
			setIsOpen(true);
		}

		const onTransitionEnd = () => {
			setHasAnimationFinished(true);
		};

		const rootNode = rootNodeRef.current;
		rootNode.addEventListener('transitionend', onTransitionEnd);
		return () => {
			rootNode.removeEventListener('transitionend', onTransitionEnd);
		};
	}, [hasAnimation, isReady]);

	const [ieBanner, setIeBanner] = useState(true);
	const closeIeBanner = useCallback((e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setIeBanner(false);
	}, []);

	return (
		<div
			ref={rootNodeRef}
			className={clsx(className, 'stage', {
				'stage--no-animation': !hasAnimation,
				'stage--open': isOpen || !hasAnimation,
				'stage--animation-finished': hasAnimationFinished
			})}
			data-cy="stage"
		>
			{ieBanner && (
				<Banner
					className="ieBanner"
					style={{ display: 'none' }}
					onClose={closeIeBanner}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="72"
						height="72"
						viewBox="0 0 72 72"
					>
						<path d="M37.7654935,7.31698782 L67.4353219,63.0603018 C67.9543029,64.035357 67.5845817,65.2465126 66.6095266,65.7654935 C66.3202373,65.9194701 65.9975433,66 65.6698284,66 L6.33017157,66 C5.22560207,66 4.33017157,65.1045695 4.33017157,64 C4.33017157,63.6722851 4.41070152,63.3495911 4.56467805,63.0603018 L34.2345065,7.31698782 C34.7534874,6.34193268 35.964643,5.9722115 36.9396982,6.49119247 C37.29099,6.67817038 37.5785156,6.96569598 37.7654935,7.31698782 Z M39,46 L39,26 L33,26 L33,46 L39,46 Z M39,56.4 L39,50.4 L33,50.4 L33,56.4 L39,56.4 Z" />
					</svg>
					<Trans i18nKey="banner.ie.text" />
				</Banner>
			)}

			<div className="stage__content">
				<div className="stage__logo-wrapper">
					<Logo
						className="stage__logo"
						aria-label={translate('app.stage.title')}
					/>
				</div>
				<div className="stage__headline">
					<Headline
						className="stage__title"
						semanticLevel="1"
						text={translate('app.stage.title')}
					/>
					<Headline
						className="stage__claim"
						semanticLevel="4"
						text={translate('app.claim')}
					/>
				</div>
			</div>
			<div className="stage__loader">
				<Loader />
			</div>
		</div>
	);
};
