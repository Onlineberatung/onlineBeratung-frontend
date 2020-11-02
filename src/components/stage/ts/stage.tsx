import * as React from 'react';
import { translate } from '../../../resources/scripts/i18n/translate';
import { SVG } from '../../svgSet/ts/SVG';
import { LOGO_KEYS } from '../../svgSet/ts/SVGHelpers';

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
				<SVG name={LOGO_KEYS.SKF} />
				<SVG name={LOGO_KEYS.CARITAS_WHITE} />
				<SVG name={LOGO_KEYS.SKM} />
				<SVG name={LOGO_KEYS.IN_VIA} />
				<SVG name={LOGO_KEYS.KREUZBUND} />
				<SVG name={LOGO_KEYS.RAPHAELSWERK} />
			</div>
		</div>
	);
};
