import React, { HTMLAttributes, ReactElement, useEffect } from 'react';
import styled from 'styled-components';

interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
	icon?: ReactElement;
	infoText?: string;
}

const StyledTooltip = styled.div`
	${({ theme }) => `
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;

	font-family: ${theme.tooltip.font.fontFamily};
	font-size: ${theme.tooltip.font.fontSize};
	font-weight: ${theme.tooltip.font.fontWeight};
	line-height: ${theme.tooltip.font.lineHeight};

	.tooltip--infoText-container {
		display: none;
		flex-direction: column;
		align-items: center;
		width: ${theme.tooltip.width};
	}
	
	.tooltip--infoText {
		border: ${theme.tooltip.border} ${theme.colors.border};
		border-radius: ${theme.tooltip.borderRadius};
		box-shadow: ${theme.tooltip.boxShadow} ${theme.colors.shadow};
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
		border: 8px solid;
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
		tooltip: {
			width: '270px',
			border: '1px solid',
			borderRadius: '4px',
			boxShadow: '0px 3px 0px 0px',
			padding: '17px 24px',
			margin: '8px 0 0 0',

			font: {
				fontFamily: 'Roboto, sans-serif',
				fontSize: '16px',
				fontWeight: '400',
				lineHeight: '24px'
			},

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
