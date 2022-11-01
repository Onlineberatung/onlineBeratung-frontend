import React, { HTMLAttributes, ReactElement } from 'react';
import styled from 'styled-components';

interface ButtonBottomProps extends HTMLAttributes<HTMLButtonElement> {
	icon?: ReactElement;
	focusState?: boolean;
}

const StyledButtonBottom = styled.button`
	${({ theme }) => `
		display: flex;
		align-items: center;
		justify-content: center;

		height: 32px;
		width: 32px;

		border: none;
		border-radius: 50%;
		
		background-color: #000000E6;
		
		svg {
			path {
				fill: ${theme.color.interactive_onDark ?? '#FFFFFF'};
			}
		}

		&:hover {
			background-color: ${theme.color.interactive_hover ?? '#A31816'};
		}

		&:focus {
			outline: 2px solid ${theme.color.focus ?? '#199FFF'};
			outline-offset: 4px;
		}

		&:focus:not(:focus-visible) {
			outline: none;
		}

		&.focus {
			outline: 2px solid ${theme.color.focus ?? '#199FFF'};
			outline-offset: 4px;
		}
	`}
`;

export const ButtonBottom = ({
	icon,
	focusState,
	className,
	onClick,
	...props
}: ButtonBottomProps) => {
	return (
		<StyledButtonBottom
			type="button"
			className={`${className} ${focusState && 'focus'}`}
			onClick={onClick}
			{...props}
		>
			{icon && icon}
		</StyledButtonBottom>
	);
};
