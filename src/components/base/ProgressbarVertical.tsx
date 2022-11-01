import React, { HTMLAttributes, ReactElement } from 'react';
import styled from 'styled-components';

export const STATUS_DEFAULT = 'default';
export const STATUS_ACTIVE = 'active';
export const STATUS_DONE = 'done';
export const STATUS_DISABLED = 'disabled';

export type STATUS =
	| typeof STATUS_DEFAULT
	| typeof STATUS_ACTIVE
	| typeof STATUS_DONE
	| typeof STATUS_DISABLED;

interface ProgressbarVerticalProps extends HTMLAttributes<HTMLDivElement> {
	status?: STATUS;
	label?: string;
	checkmarkIcon?: ReactElement;
	arrowIcon?: ReactElement;
	number?: number;
	buttonLabel?: string;
	placeholderLabel?: string;
}

const StyledProgressbarVertical = styled.div`
	${({ theme }) => `
	font-family: ${theme.font.family_sans_serif ?? 'Roboto, sans-serif'};
	font-weight: ${theme.font.weight_regular ?? '400'};
	font-size: ${theme.font.size_subheadline ?? '20px'};
	line-height: ${theme.font.line_height_quinary ?? '28px'};

	display: flex;
	flex-direction: column;
	
	width: 450px;

	.progressbarVertical--header {
		& div {
			display: inline flex;
			justify-content: center;
			align-items: center;

			position: relative;
	
			height: 32px;
			width: 32px;
			
			border: ${theme.border.style ?? '1px solid'} ${
		theme.color.text_emphasisHigh ?? '#000000E5'
	};
			border-radius: 50%;
			box-sizing: border-box;
	
			margin:  ${theme.grid.base_three ?? '24px'} 10px ${
		theme.grid.base_three ?? '24px'
	} 0;
			
			background-color: ${theme.color.interactive_onDark ?? '#FFFFFF'};
			color: ${theme.color.text_emphasisHigh ?? '#000000E5'};
			
			font-size: ${theme.font.size_primary ?? '16px'};
			font-weight: ${theme.font.weight_bold ?? '700'};
		}

		& svg {
			display: none;
		}

		&:hover {
			cursor:  pointer;

			& div {
				border-color: ${theme.color.interactive_hover ?? '#A31816'};
				color: ${theme.color.interactive_hover ?? '#A31816'};
			}
			& span {
				color: ${theme.color.interactive_hover ?? '#A31816'};
			}
		}
	}

	.progressbarVertical--placeholder {
		background-color: #C4C4C433;
		color: ${theme.color.text_placeholder ?? '#00000066'};
		font-size: ${theme.font.size_secondary ?? '12px'};
		margin: 0 0 30px 0;
		padding: 18.1px 0 18.1px 0;
		text-align: center;
		width: 450px;
	}

	.progressbarVertical--button {
		font-size: ${theme.font.size_primary ?? '16px'};
		font-weight: ${theme.font.weight_bold ?? '700'};
		line-height: ${theme.font.line_height_primary ?? '21px'};
		color: ${theme.color.interactive_primary ?? '#CC1E1C'};

		display: flex;
    	justify-content: center;
    	align-items: center;
		align-self: flex-end;

		border: 2px solid ${theme.color.interactive_primary ?? '#CC1E1C'};
		border-radius: 24px;
		box-sizing: border-box;

		height: 48px;
		width: 158px;

		& svg {
			margin-right: 10.5px;

			& path {
				fill: ${theme.color.interactive_primary ?? '#CC1E1C'};
			}
		}

		&:hover {
			cursor:  pointer;
			color: ${theme.color.text_onDark ?? '#FFFFFF'};
			background-color: ${theme.color.interactive_hover ?? '#A31816'};
			border-color: ${theme.color.interactive_hover ?? '#A31816'};

			& svg {
				& path {
					fill: ${theme.color.interactive_onDark ?? '#FFFFFF'};
				}
			}
		}
	}

	hr {
		border: none;
		border-bottom: ${theme.border.style ?? '1px solid'} ${
		theme.color.outline ?? '#00000033'
	};
		margin: 0;
		width: 450px;
	}

	&.active {
		.progressbarVertical--header {
			& div {
				background-color: ${theme.color.interactive_primary ?? '#CC1E1C'};
				border: none;
				color: ${theme.color.interactive_onDark ?? '#FFFFFF'};
			}

			& span {
				font-weight: ${theme.font.weight_medium ?? '500'};
				color: ${theme.color.interactive_primary ?? '#CC1E1C'};
			}
		}
	}

	&.done {
		.progressbarVertical--header {
			& svg {
				display: inline;

				position: absolute; 
				top: 45px;

				margin: 0 0 0 19px;
				
				& path {
					fill: ${theme.color.status_success_foreground ?? '#4FCC5C'};
				}
			}
		}
	}

	&.disabled {
		.progressbarVertical--header {
			& div {
				background-color: ${theme.color.interactive_onDark ?? '#FFFFFF'};
				border: ${theme.border.style ?? '1px solid'} ${
		theme.color.text_disabled ?? '#00000066'
	};
				color: ${theme.color.text_disabled ?? '#00000066'};
			}

			& span {
				font-weight: ${theme.font.weight_medium ?? '500'};
				color: ${theme.color.text_disabled ?? '#00000066'};
			}
		}
	}
	`}
`;

export const ProgressbarVertical = ({
	status = STATUS_DEFAULT,
	label,
	checkmarkIcon,
	arrowIcon,
	number,
	buttonLabel,
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
				{checkmarkIcon && checkmarkIcon}
			</div>

			<div className="progressbarVertical--placeholder">
				{placeholderLabel && placeholderLabel}
			</div>

			<div className="progressbarVertical--button">
				{arrowIcon && arrowIcon}
				{buttonLabel && buttonLabel}
			</div>
		</StyledProgressbarVertical>
	);
};
