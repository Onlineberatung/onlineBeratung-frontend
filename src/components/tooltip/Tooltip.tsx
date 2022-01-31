import * as React from 'react';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { ReactComponent as ExclamationIcon } from '../../resources/img/icons/exclamation-mark.svg';
import { ReactComponent as InfoIcon } from '../../resources/img/icons/i.svg';
import { ReactComponent as ErrorIcon } from '../../resources/img/icons/x.svg';
import { isMobile } from 'react-device-detect';
import './tooltip.styles';

export const ICON_INFO = 'info';
export const ICON_EXCLAMATION = 'exclamation';
export const ICON_ERROR = 'error';

export const DIRECTION_TOP = 'top';
export const DIRECTION_BOTTOM = 'bottom';
export const DIRECTION_LEFT = 'left';
export const DIRECTION_RIGHT = 'right';

const TOOLTIP_POSITION_CENTER = 'center';
const TOOLTIP_POSITION_LEFT = 'left';
const TOOLTIP_POSITION_RIGHT = 'right';
const TOOLTIP_POSITION_TOP = 'top';
const TOOLTIP_POSITION_BOTTOM = 'bottom';

export const ICON_SIZE_SMALL = 'small';
export const ICON_SIZE_DEFAULT = 'default';

export interface TooltipProps {
	icon?: typeof ICON_INFO | typeof ICON_EXCLAMATION | typeof ICON_ERROR;
	iconSize?: typeof ICON_SIZE_SMALL | typeof ICON_SIZE_DEFAULT;
	direction?:
		| typeof DIRECTION_TOP
		| typeof DIRECTION_BOTTOM
		| typeof DIRECTION_LEFT
		| typeof DIRECTION_RIGHT;
	children: ReactNode;
}

export const Tooltip = ({
	icon,
	iconSize,
	direction,
	children
}: TooltipProps) => {
	const infoRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLSpanElement>(null);
	const [visible, setVisible] = useState<boolean>(false);
	const [positioned, setPositioned] = useState<boolean>(true);
	const [top, setTop] = useState(null);
	const [bottom, setBottom] = useState(null);
	const [left, setLeft] = useState(null);
	const [right, setRight] = useState(null);
	const [tooltipPosition, setTooltipPosition] = useState('center');

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				!infoRef.current?.contains(event.target) &&
				!event.target.getAttribute('data-agency-info-id') &&
				!event.target.closest('[data-agency-info-id]')
			) {
				if (visible) {
					setVisible(false);
				}
			}
		};
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, [visible]);

	useEffect(() => {
		if (!triggerRef.current || !visible || !infoRef.current) {
			return;
		}

		const triggerBoundingClientRect =
			triggerRef.current.getBoundingClientRect();

		const triggerX = triggerBoundingClientRect.x;
		const triggerY = triggerBoundingClientRect.y;
		const triggerWidth = triggerBoundingClientRect.width;
		const triggerHeight = triggerBoundingClientRect.height;

		const infoBoundingClientRect = infoRef.current.getBoundingClientRect();
		const infoHeight = infoBoundingClientRect.height;
		const infoWidth = infoBoundingClientRect.width;

		switch (direction) {
			case DIRECTION_LEFT:
				setLeft((infoWidth + 15) * -1);
				break;
			case DIRECTION_RIGHT:
				setRight((infoWidth + 15) * -1);
				break;
			case DIRECTION_TOP:
				setBottom(Math.floor(triggerHeight + 15));
				break;
			case DIRECTION_BOTTOM:
			default:
				setTop(Math.floor(triggerHeight + 15));
				break;
		}

		if (direction === DIRECTION_LEFT || direction === DIRECTION_RIGHT) {
			const top = Math.floor(infoHeight / 2 - triggerHeight / 2);
			if (triggerY + top > document.body.clientHeight) {
				setTop((infoHeight - triggerHeight - 10) * -1);
				setTooltipPosition(TOOLTIP_POSITION_TOP);
			} else if (triggerY - top < 0) {
				setTop(-10);
				setTooltipPosition(TOOLTIP_POSITION_BOTTOM);
			} else {
				setTop(top * -1);
				setTooltipPosition(TOOLTIP_POSITION_CENTER);
			}
		} else {
			const left = Math.floor(infoWidth / 2 - triggerWidth / 2);

			if (triggerX + left > document.body.clientWidth) {
				setLeft((infoWidth - triggerWidth - 10) * -1);
				setTooltipPosition(TOOLTIP_POSITION_LEFT);
			} else if (triggerX - left < 0) {
				setLeft(-10);
				setTooltipPosition(TOOLTIP_POSITION_RIGHT);
			} else {
				setLeft(left * -1);
				setTooltipPosition(TOOLTIP_POSITION_CENTER);
			}
		}
		setPositioned(true);
	}, [visible, triggerRef, infoRef, direction]);

	useEffect(() => {
		if (!visible) {
			setLeft(null);
			setTop(null);
			setRight(null);
			setBottom(null);
			setPositioned(false);
		}
	}, [visible]);

	const getIconComponent = useCallback(() => {
		switch (icon) {
			case ICON_ERROR:
				return ErrorIcon;
			case ICON_EXCLAMATION:
				return ExclamationIcon;
			default:
				return InfoIcon;
		}
	}, [icon]);

	const Icon = getIconComponent();

	return (
		<div
			className={`tooltip tooltip--${direction || DIRECTION_BOTTOM}`}
			onClick={() => {
				setVisible(!visible);
			}}
			onMouseEnter={() => {
				if (!isMobile) {
					setVisible(true);
				}
			}}
			onMouseLeave={() => {
				if (!isMobile) {
					setVisible(false);
				}
			}}
		>
			<span
				ref={triggerRef}
				className={`tooltip__trigger tooltip__trigger--size-${
					iconSize || ICON_SIZE_DEFAULT
				}`}
			>
				<Icon />
			</span>

			{visible && (
				<div
					className={`tooltip__content tooltip__content--${
						positioned ? 'visible' : 'hidden'
					} tooltip__content--position-${tooltipPosition}`}
					style={{
						...(top ? { top: `${top}px` } : {}),
						...(left ? { left: `${left}px` } : {}),
						...(bottom ? { bottom: `${bottom}px` } : {}),
						...(right ? { right: `${right}px` } : {})
					}}
					ref={infoRef}
				>
					{children}
				</div>
			)}
		</div>
	);
};
