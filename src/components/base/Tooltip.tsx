import React, { HTMLAttributes, ReactElement, useEffect, useRef } from 'react';
import styled from 'styled-components';

interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
	icon?: ReactElement;
	infoText?: string;
	focusState?: boolean;
}

const StyledTooltip = styled.div`
	${({ theme }) => `
	font-family: ${theme.font.family_sans_serif ?? 'Roboto, sans-serif'};
	font-size: ${theme.font.size_h5 ?? '16px'};
	font-weight: ${theme.font.weight_regular ?? '400'};
	line-height: ${theme.font.line_height_senary ?? '24px'};

	color: ${theme.color.text_emphasisHigh ?? '#000000E5'};

	position: relative;

	display: flex;
	flex-direction: column;
	align-items: center;

	.tooltip--infoText-container {
		display: none;
		flex-direction: column;
		align-items: center;
		width: 270px;
	}
	
	.tooltip--infoText {
		border: ${theme.border.style ?? '1px solid'} ${
		theme.color.background_neutral3 ?? '#E7E3E1'
	};
		border-radius: ${theme.border.radius ?? '4px'};
		box-shadow: 0px 0px 10px 0px ${theme.color.outline ?? '#00000033'};
		padding: 17px 24px;
	}

	.tooltip--infoText-container:before {
		z-index: 300;
		content: '';
		border: 8px solid;
		border-color: transparent transparent ${
			theme.color.background_neutral3 ?? '#E7E3E1'
		} transparent;
	}	

	.tooltip--triangle {
		z-index: 301;
		position: absolute;
		top: 21px;
		border: 9px solid;
		border-color: transparent transparent white transparent;
	}

	svg {
		height: 20px;
		width: 20px;
		path {
			fill: ${theme.color.interactive_secondary ?? '#000000E5'};
		}

		&:hover {
			cursor: pointer;
			path {
				fill: ${theme.color.interactive_hover ?? '#A31816'};
			}

			& + .tooltip--infoText-container  {
				display: flex !important;
			}
		}
	}

	&.focus {
		svg {
			path {
				fill: ${theme.color.interactive_hover ?? '#A31816'};
			}
		}
	}
	`}
`;

export const Tooltip = ({
	icon,
	infoText,
	focusState = false,
	className,
	...props
}: TooltipProps) => {
	const infoTextContainer = useRef(null);

	useEffect(() => {
		if (focusState) {
			infoTextContainer.current.style.display = 'flex';
		} else {
			infoTextContainer.current.style.display = 'none';
		}
	}, [focusState]);

	return (
		<StyledTooltip
			type="tooltip"
			className={`${className} ${focusState && 'focus'}`}
			{...props}
		>
			{icon && icon}
			<div
				className="tooltip--infoText-container"
				ref={infoTextContainer}
			>
				<span className="tooltip--triangle"></span>
				<div className="tooltip--infoText">{infoText && infoText}</div>
			</div>
		</StyledTooltip>
	);
};
