import * as React from 'react';
import { useState, useRef } from 'react';
import clsx from 'clsx';
import './stage.styles';
import { Spinner, useTenant } from '../../../../';
import { config } from '../../resources/scripts/config';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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
	const [t] = useTranslation();
	const rootNodeRef = useRef();
	const tenant = useTenant();
	const [isAnimationDone, setIsAnimationDone] = useState(false);
	const isTenantLoaded = tenant != null;

	function onAnimationEnd(event) {
		// Ignore animations of children
		if (event.target === rootNodeRef.current) {
			setIsAnimationDone(true);
		}
	}

	return (
		<div
			ref={rootNodeRef}
			onAnimationEnd={onAnimationEnd}
			id="loginLogoWrapper"
			className={clsx(className, 'stage', {
				'stage--animated': hasAnimation,
				'stage--animation-done': isAnimationDone,
				'stage--ready': isReady
			})}
		>
			{hasAnimation ? <Spinner className="stage__spinner" /> : null}
			<Link
				to={config.urls.home}
				className="stage__logo"
				style={{
					backgroundImage: `url(${
						isTenantLoaded
							? tenant?.theming?.logo || '/logo.png'
							: null
					})`
				}}
			></Link>
			<div className="stage__headline">
				<h1>{tenant?.name || t('app.stage.title')}</h1>
				<h4>{tenant?.content?.claim || t('app.claim')}</h4>
			</div>
		</div>
	);
};
