import * as React from 'react';
import clsx from 'clsx';
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
	hasAnimation?: boolean;
	isReady?: boolean;
}

export const Stage = ({ hasAnimation, isReady = true }: StageProps) => {
	return (
		<div
			id="loginLogoWrapper"
			className={clsx('stage', {
				'stage--animated': hasAnimation,
				'stage--ready': isReady
			})}
		>
			<div className="stage__headline">
				<h1>{translate('app.title')}</h1>
				<h4>{translate('app.claim')}</h4>
			</div>

			{hasAnimation ? (
				<div className="stage__spinner">
					<div className="double-bounce1"></div>
					<div className="double-bounce2"></div>
				</div>
			) : null}

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
