import React, { HTMLAttributes, ReactElement } from 'react';
import styled from 'styled-components';

interface ButtonFeedbackProps extends HTMLAttributes<HTMLButtonElement> {
	label?: string;
	icon?: ReactElement;
	focusState?: boolean;
}

const StyledButtonFeedback = styled.button`
	${({ theme }) => `
		font-size: ${theme.font.size_tertiary ?? '14px'};
		line-height: ${theme.font.line_height_primary ?? '21px'};
		font-weight: 600;

		display: flex;
		align-items: center;

		color: #000000E6;
		background-color: ${theme.color.background_feedback4 ?? '#FFDCA3'};

		border: none;
		border-radius: 24px;
		
		padding: 6px 12px;
		height: 32px;

		svg {
			margin: 0 8px 0 0;

			path {
				fill: #000000E6;
				width: 18.13px;
				height: 15px;
			}
		}

		&:hover {
			background-color: ${theme.color.background_feedback3 ?? '#FEBD50'};
		}

		&:focus {
			outline: 2px solid #199FFF;
			outline-offset: 4px;
		}

		&:focus:not(:focus-visible) {
			outline: none;
		}

		&.focus {
			outline: 2px solid #199FFF;
			outline-offset: 4px;
		}
	`}
`;

export const ButtonFeedback = ({
	label,
	icon,
	focusState,
	className,
	onClick,
	...props
}: ButtonFeedbackProps) => {
	return (
		<StyledButtonFeedback
			type="button"
			className={`${className} ${focusState && 'focus'}`}
			onClick={onClick}
			{...props}
		>
			{icon && icon} {label && label}
		</StyledButtonFeedback>
	);
};
