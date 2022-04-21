import React, { HTMLAttributes, ReactElement } from 'react';
import styled from 'styled-components';

export const STATUS_DEFAULT = 'default';
export const STATUS_ACTIVE = 'active';
export const STATUS_DONE = 'done';

export type STATUS =
	| typeof STATUS_DEFAULT
	| typeof STATUS_ACTIVE
	| typeof STATUS_DONE;

interface ProgressbarVerticalProps extends HTMLAttributes<HTMLDivElement> {
	status?: STATUS;
	label?: string;
	number?: number;
	button?: string;
	placeholderLabel?: string;
}

const StyledProgressbarVertical = styled.div`
	${({ theme }) => `
	font-family: ${theme.font.fontFamily};
	font-weight: ${theme.font.fontWeightLight};
	font-size: ${theme.font.fontSizeLarge};
	line-height: ${theme.font.fontHeight};
	
	.progressbarVertical--header {
		& div {
			display: inline flex;
			justify-content: center;
			align-items: center;
	
			height: ${theme.progressbarVertical.number.size};
			width: ${theme.progressbarVertical.number.size};
	
			border: ${theme.progressbarVertical.border} ${theme.colors.grey};
			border-radius: ${theme.progressbarVertical.number.borderRadius};
			box-sizing: ${theme.progressbarVertical.boxSizing};
	
			margin:  ${theme.progressbarVertical.number.margin};
			
			background-color: ${theme.colors.white};
			color: ${theme.colors.grey};

			font-weight: ${theme.font.fontWeightBold};;
		}
	}

	.progressbarVertical--placeholder {
		background-color: ${theme.colors.lightGrey};
		color: ${theme.colors.grey};
		font-size: ${theme.font.fontSizeSmall};
		margin: ${theme.progressbarVertical.placeholder.margin};
		padding: ${theme.progressbarVertical.placeholder.padding};
		text-align: center;
		width: ${theme.progressbarVertical.width};
	}

	.progressbarVertical--button {
		color: ${theme.colors.primary};
		font-weight: ${theme.font.fontWeightBold};
		line-height: 21px;
		text-transform: ${theme.font.textTransform};

		&:hover {
			color: ${theme.colors.hover};
		}
	}

	hr {
		border: ${theme.progressbarVertical.verticalStepper.border};
		border-bottom: ${theme.progressbarVertical.border} ${theme.colors.verticalStepper};
		margin: ${theme.progressbarVertical.verticalStepper.margin};
		width: ${theme.progressbarVertical.width};
	}

	&.default {
		.progressbarVertical--header {
			&:hover {
				cursor:  ${theme.progressbarVertical.hoverCursor};
				font-weight: ${theme.font.fontWeightBold};
				& div {
					border-color: ${theme.colors.hover};
					color: ${theme.colors.hover};
				}
			}
		}
	}

	&.active {
		.progressbarVertical--header {
			& div {
				background-color: ${theme.colors.primary};
				border: none;
				color: ${theme.colors.white};
			}

			& span {
				font-weight: ${theme.font.fontWeightBold};
			}
		}
	}

	&.done {
		.progressbarVertical--header {
			& div {
				border-color: ${theme.colors.primary};
				color: ${theme.colors.primary};
			}
	}
	`}
`;

StyledProgressbarVertical.defaultProps = {
	theme: {
		colors: {
			grey: '#00000066',
			lightGrey: '#C4C4C433',
			primary: '#CC1E1C',
			hover: '#A31816',
			white: '#FFFFFF',
			verticalStepper: '#00000033'
		},
		font: {
			fontFamily: 'Roboto, sans-serif',
			fontWeightLight: '400',
			fontWeightBold: '700',
			fontSizeLarge: '16px',
			fontSizeSmall: '12px',
			lineHeight: '24px',
			textTransform: 'uppercase'
		},
		progressbarVertical: {
			width: '450px',
			hoverCursor: 'pointer',
			border: '1px solid',
			boxSizing: 'border-box',

			number: {
				size: '32px',
				borderRadius: '50%',
				margin: '24px 10px 24px 0'
			},

			placeholder: {
				padding: '18.1px 0 18.1px 0',
				margin: '0 0 30px 0'
			},

			verticalStepper: {
				border: 'none',
				margin: '0'
			}
		}
	}
};

export const ProgressbarVertical = ({
	status = STATUS_DEFAULT,
	label,
	number,
	button,
	placeholderLabel,
	className,
	...props
}: ProgressbarVerticalProps) => {
	return (
		<StyledProgressbarVertical
			type="progressbarVertical"
			className={`${className} ${status}`}
			{...props}
		>
			<hr></hr>

			<div className="progressbarVertical--header">
				<div>{number && number}</div>
				<span>{label && label}</span>
			</div>

			<div className="progressbarVertical--placeholder">
				{placeholderLabel && placeholderLabel}
			</div>

			<div className="progressbarVertical--button">
				{button && button}
			</div>
		</StyledProgressbarVertical>
	);
};
