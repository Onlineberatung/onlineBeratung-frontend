import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

interface ButtonSmallProps extends HTMLAttributes<HTMLButtonElement> {
	label?: string;
	focusState?: boolean;
}

const StyledButtonSmall = styled.button`
	${({ theme }) => `
		font-size: ${theme.font.size_tertiary ?? '14px'};
		line-height: ${theme.font.line_height_primary ?? '21px'};
		font-weight: 600;

		display: flex;
		align-items: center;

		color: ${theme.color.interactive_secondary ?? '#000000E5'};
		border: ${theme.border.style_bold ?? '2px solid'} ${
		theme.color.interactive_secondary ?? '#000000E5'
	};
		border-radius: 24px;
		padding: 6px 16px 6px 16px;

		height: 32px;

		&:hover {
			color: ${theme.color.text_onDark ?? '#FFFFFF'};
			background-color: ${theme.color.interactive_hover ?? '#A31816'};
			border-color: ${theme.color.interactive_hover ?? '#A31816'};
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

export const ButtonSmall = ({
	label,
	className,
	focusState,
	onClick,
	...props
}: ButtonSmallProps) => {
	return (
		<StyledButtonSmall
			type="button"
			className={`${className} ${focusState && 'focus'}`}
			onClick={onClick}
			{...props}
		>
			{label && label}
		</StyledButtonSmall>
	);
};
