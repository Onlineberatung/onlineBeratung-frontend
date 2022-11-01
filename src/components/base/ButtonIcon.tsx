import React, { HTMLAttributes, ReactElement } from 'react';
import styled from 'styled-components';

interface ButtonIconProps extends HTMLAttributes<HTMLButtonElement> {
	icon?: ReactElement;
	disabled?: boolean;
	focusState?: boolean;
}

const StyledButtonIcon = styled.button`
	${({ theme }) => `
		display: flex;
		align-items: center;
		justify-content: center;

		height: 48px;
		width: 48px;

		border: none;
		border-radius: 50%;
		
		background-color: ${theme.color.interactive_primary ?? '#CC1E1C'};
		
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

		&.disabled {
			background-color: ${
				theme.color.interactive_disabled_background_black ?? '#0000000D'
			};
			svg {
				path {
					fill: ${theme.color.text_disabled ?? '#00000066'};
				}
			}
		}
	`}
`;

export const ButtonIcon = ({
	icon,
	disabled = false,
	focusState,
	className,
	onClick,
	...props
}: ButtonIconProps) => {
	return (
		<StyledButtonIcon
			type="button"
			className={`${className} ${disabled && 'disabled'} ${
				focusState && 'focus'
			}`}
			onClick={onClick}
			{...props}
		>
			{icon && icon}
		</StyledButtonIcon>
	);
};
