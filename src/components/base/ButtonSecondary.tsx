import React, { HTMLAttributes, ReactElement } from 'react';
import styled from 'styled-components';

interface ButtonSecondaryProps extends HTMLAttributes<HTMLButtonElement> {
	label?: string;
	icon?: ReactElement;
	inverted?: boolean;
	focusState?: boolean;
}

const StyledButtonSecondary = styled.button`
	${({ theme }) => `
		font-size: ${theme.font.size_primary ?? '16px'};
		line-height: ${theme.font.line_height_primary ?? '21px'};
		font-weight: 600;

		display: flex;
		align-items: center;
		height: 48px;

		border: 3px solid ${theme.color.interactive_primary ?? '#CC1E1C'};
		border-radius: 24px;
		
		padding: ${theme.grid.base ?? '8px'} ${theme.grid.base_three ?? '24px'};

		background-color: ${theme.color.interactive_onDark ?? '#FFFFFF'};
		color: ${theme.color.interactive_primary ?? '#CC1E1C'};
		
		svg {
			margin: 0 10px 0 0;

			path {
				fill: ${theme.color.interactive_primary ?? '#CC1E1C'};
				width: 19.5px;
				height: 17px;
			}
		}

		&:disabled,
		&:disabled:hover {
			background-color: ${theme.color.interactive_onDark ?? '#FFFFFF'};
			border-color: ${theme.color.text_disabled ?? '#00000066'};
			color: ${theme.color.text_disabled ?? '#00000066'};

			svg {
				path {
					fill: ${theme.color.text_disabled ?? '#00000066'};
				}
			}
		}

		&:hover {
			background-color: ${theme.color.interactive_hover ?? '#A31816'};
			border-color: ${theme.color.interactive_hover ?? '#A31816'};
			color: ${theme.color.interactive_onDark ?? '#FFFFFF'};
		
			svg {
				path {
					fill: ${theme.color.interactive_onDark ?? '#FFFFFF'};
				}
			}
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

		&.inverted {
			color: ${theme.color.interactive_onDark ?? '#FFFFFF'};
			background-color: transparent;
			border-color: ${theme.color.interactive_onDark ?? '#FFFFFF'};
			svg {
				path {
					fill: ${theme.color.interactive_onDark ?? '#FFFFFF'};
				}
			}

			&:hover {
				color: ${theme.color.interactive_hover ?? '#A31816'};
				background-color: ${theme.color.background_red1 ?? '#F8DEDD'};
				border-color: ${theme.color.background_red1 ?? '#F8DEDD'};
				svg {
					path {
						fill: ${theme.color.interactive_hover ?? '#A31816'};
					}
				}
			}

			&:disabled {
				color: ${theme.color.interactive_disabled_background ?? '#FFFFFF66'};
				background-color: transparent;
				border-color: ${theme.color.interactive_disabled_background ?? '#FFFFFF66'};
				svg {
					path {
						fill: ${theme.color.interactive_disabled_background ?? '#FFFFFF66'};
					}
				}
			}
		}
	`}
`;

export const ButtonSecondary = ({
	label,
	icon,
	className,
	inverted,
	focusState,
	onClick,
	...props
}: ButtonSecondaryProps) => {
	return (
		<StyledButtonSecondary
			type="button"
			className={`${className} ${inverted && 'inverted'} ${
				focusState && 'focus'
			}`}
			onClick={onClick}
			{...props}
		>
			{icon && icon} {label && label}
		</StyledButtonSecondary>
	);
};
