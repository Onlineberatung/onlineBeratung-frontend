import * as React from 'react';
import { translate } from '../../../resources/ts/i18n/translate';
import { Icon, LOGO_KEYS } from '../../iconSet/ts/Icon';

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
				<Icon name={LOGO_KEYS.SKF} />
				<Icon name={LOGO_KEYS.CARITAS_WHITE} />
				<Icon name={LOGO_KEYS.SKM} />
				<Icon name={LOGO_KEYS.IN_VIA} />
				<Icon name={LOGO_KEYS.KREUZBUND} />
				<Icon name={LOGO_KEYS.RAPHAELSWERK} className="raphaelswerk" />
			</div>
		</div>
	);
};
