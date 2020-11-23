import * as React from 'react';
import { translate } from '../../resources/scripts/i18n/translate';
import { ReactComponent as Skf } from '../../resources/img/logos/01_skf.svg';
import { ReactComponent as Caritas } from '../../resources/img/logos/02_caritas.svg';
import { ReactComponent as Skm } from '../../resources/img/logos/03_skm.svg';
import { ReactComponent as InVia } from '../../resources/img/logos/04_via.svg';
import { ReactComponent as Kreuzbund } from '../../resources/img/logos/05_kreuzbund.svg';
import { ReactComponent as Raphaelswerk } from '../../resources/img/logos/06_raphael.svg';
import './stage.styles';

export interface StageProps {
	hasAnimation?: boolean;
}

export const Stage = (props: StageProps) => {
	return (
		<div
			id="loginLogoWrapper"
			className={props.hasAnimation ? `stage stage--animated` : `stage`}
		>
			<div className="stage__headline">
				<h1>{translate('app.title')}</h1>
				<h4>{translate('app.claim')}</h4>
			</div>

			{props.hasAnimation ? (
				<div className="stage__spinner">
					<div className="double-bounce1"></div>
					<div className="double-bounce2"></div>
				</div>
			) : null}

			<div className="stage__logos">
				<Skf />
				<Caritas />
				<Skm />
				<InVia />
				<Kreuzbund />
				<Raphaelswerk />
			</div>
		</div>
	);
};
