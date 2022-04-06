import * as React from 'react';
import { useRef, useState } from 'react';
import clsx from 'clsx';
import { Spinner } from '../spinner/Spinner';
import { useContext } from 'react';
import { TenantContext } from '../../globalState';
import { translate } from '../../utils/translate';
import { ReactComponent as SkfLogo } from '../../resources/img/logos/01_skf.svg';
import { ReactComponent as CaritasLogo } from '../../resources/img/logos/02_caritas.svg';
import { ReactComponent as SkmLogo } from '../../resources/img/logos/03_skm.svg';
import { ReactComponent as InViaLogo } from '../../resources/img/logos/04_via.svg';
import { ReactComponent as KreuzbundLogo } from '../../resources/img/logos/05_kreuzbund.svg';
import { ReactComponent as RaphaelswerkLogo } from '../../resources/img/logos/06_raphael.svg';
import { ReactComponent as MalteserLogo } from '../../resources/img/logos/07_malteser.svg';
import './stage.styles';

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
	const rootNodeRef = useRef();
	const { tenant } = useContext(TenantContext);
	const [isAnimationDone, setIsAnimationDone] = useState(false);

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
			<div className="stage__headline">
				<h1>{tenant?.name || translate('app.stage.title')}</h1>
				<h4>{tenant?.content?.claim || translate('app.claim')}</h4>
			</div>

			{hasAnimation ? <Spinner className="stage__spinner" /> : null}
			<div className="stage__logos">
				<SkfLogo />
				<CaritasLogo />
				<SkmLogo />
				<MalteserLogo />
				<KreuzbundLogo />
				<RaphaelswerkLogo />
				<InViaLogo />
			</div>
		</div>
	);
};
