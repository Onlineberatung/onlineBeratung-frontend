import * as React from 'react';
import {
	getSVGPath,
	getSVGViewBox,
	ICON_KEYS,
	DEFAULT_SVG_VALUES
} from './SVGHelpers';

export interface SVGProps {
	name: string;
	className?: string;
	fill?: string;
	height?: string;
	viewBox?: string;
	width?: string;
}

const SVG_TYPES = {
	ICON: 'ICON',
	LOGO: 'LOGO'
};

export const SVG = (props: SVGProps) => {
	const currentSVGType =
		props.name in ICON_KEYS ? SVG_TYPES.ICON : SVG_TYPES.LOGO;
	const currentDefaultFill =
		currentSVGType === SVG_TYPES.ICON
			? DEFAULT_SVG_VALUES.ICON_FILL
			: DEFAULT_SVG_VALUES.LOGO_FILL;
	const currentDefaultSize =
		currentSVGType === SVG_TYPES.ICON
			? DEFAULT_SVG_VALUES.ICON_SIZE
			: DEFAULT_SVG_VALUES.LOGO_SIZE;
	return (
		<svg
			name={props.name}
			className={props.className ? props.className : null}
			fill={props.fill ? props.fill : currentDefaultFill}
			height={props.height ? props.height : currentDefaultSize}
			width={props.width ? props.width : currentDefaultSize}
			viewBox={getSVGViewBox(props.name)}
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
		>
			{getSVGPath(props.name)}
		</svg>
	);
};
