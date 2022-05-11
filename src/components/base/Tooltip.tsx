import React, { HTMLAttributes, ReactElement, useEffect } from 'react';
import styled from 'styled-components';

interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
	icon?: ReactElement;
	infoText?: string;
}

const StyledTooltip = styled.div`
	${({ theme }) => `
	font-family: ${theme.font.family};
	font-size: ${theme.font.size};
	font-weight: ${theme.font.weight};
	line-height: ${theme.font.lineHeight};

	position: relative;

	display: flex;
	flex-direction: column;
	align-items: center;

	.tooltip--infoText-container {
		display: none;
		flex-direction: column;
		align-items: center;
		width: ${theme.tooltip.width};
	}
	
	.tooltip--infoText {
		border: ${theme.border.style} ${theme.colors.border};
		border-radius: ${theme.border.radius};
		box-shadow: ${theme.border.boxShadow} ${theme.colors.shadow};
		padding: ${theme.tooltip.padding};
	}

	.tooltip--infoText-container:before {
		z-index: 300;
		content: '';
		border: 8px solid;
		border-color: transparent transparent ${theme.colors.border} transparent;
	}	

	.tooltip--triangle {
		z-index: 301;
		position: absolute;
		top:21px;
		border: 9px solid;
		border-color: transparent transparent white transparent;
	}

	svg {
		height: ${theme.tooltip.svg.height};
		width: ${theme.tooltip.svg.width};
		path {
			fill: ${theme.colors.darkGrey};
		}

		&:hover {
			cursor: pointer;
			path {
				fill: ${theme.colors.hover};
			}

			& + .tooltip--infoText-container  {
				display: flex;
			}
		}
	}
	`}
`;

StyledTooltip.defaultProps = {
	theme: {
		colors: {
			darkGrey: '##000000DE',
			hover: '#A31816',
			border: '#E7E3E1',
			shadow: '#0000001A'
		},

		font: {
			family: 'Roboto, sans-serif',
			size: '16px',
			weight: '400',
			lineHeight: '24px'
		},

		border: {
			style: '1px solid',
			radius: '4px',
			boxShadow: '0px 3px 0px 0px'
		},

		tooltip: {
			width: '270px',
			padding: '17px 24px',
			margin: '8px 0 0 0',

			svg: {
				height: '20px',
				width: '20px'
			}
		}
	}
};

export const Tooltip = ({
	icon,
	infoText,
	className,
	...props
}: TooltipProps) => {
	return (
		<StyledTooltip type="tooltip" className={`${className}`} {...props}>
			{icon && icon}
			<div className="tooltip--infoText-container">
				<span className="tooltip--triangle"></span>
				<div className="tooltip--infoText">{infoText && infoText}</div>
			</div>
		</StyledTooltip>
	);
};
