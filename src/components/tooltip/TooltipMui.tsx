import * as React from 'react';
import { ReactNode } from 'react';
import { Tooltip as MuiTooltip, TooltipProps as MuiTooltipProps } from '@mui/material';
import './tooltipMui.styles.scss';

export const DIRECTION_TOP = 'top';
export const DIRECTION_BOTTOM = 'bottom';
export const DIRECTION_LEFT = 'left';
export const DIRECTION_RIGHT = 'right';

export interface TooltipProps {
	direction?:
		| typeof DIRECTION_TOP
		| typeof DIRECTION_BOTTOM
		| typeof DIRECTION_LEFT
		| typeof DIRECTION_RIGHT;
	children: ReactNode;
	trigger: ReactNode;
	className?: string;
}

/**
 * MUI Tooltip wrapper that maintains API compatibility with the old Tooltip component
 * Uses MUI's native Tooltip with clean styling
 */
export const TooltipMui = ({
	direction = DIRECTION_BOTTOM,
	children,
	trigger,
	className
}: TooltipProps) => {
	// Map our direction prop to MUI's placement prop
	const placementMap: Record<string, MuiTooltipProps['placement']> = {
		[DIRECTION_TOP]: 'top',
		[DIRECTION_BOTTOM]: 'bottom',
		[DIRECTION_LEFT]: 'left',
		[DIRECTION_RIGHT]: 'right'
	};

	return (
		<MuiTooltip
			title={children}
			placement={placementMap[direction]}
			arrow
			className={className}
			classes={{
				tooltip: 'tooltip-mui__content',
				arrow: 'tooltip-mui__arrow'
			}}
		>
			<span className="tooltip-mui__trigger">{trigger}</span>
		</MuiTooltip>
	);
};
