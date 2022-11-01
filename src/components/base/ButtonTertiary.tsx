import React, { HTMLAttributes, ReactElement } from 'react';
import styled from 'styled-components';

interface ButtonTertiaryProps extends HTMLAttributes<HTMLButtonElement> {
	label?: string;
	icon?: ReactElement;
	inverted?: boolean;
	focusState?: boolean;
}

const StyledButtonTertiary = styled.button`
	${({ theme }) => `
		font-size: ${theme.font.size_primary ?? '16px'};
		line-height: ${theme.font.line_height_primary ?? '21px'};
		font-weight: 600;

		display: flex;
		align-items: center;

		color: ${theme.color.interactive_primary ?? '#CC1E1C'};
		border: none;
		border-radius: 24px;

		padding: 4px 8px;
		
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
			color: ${theme.color.text_disabled ?? '#00000066'};
			svg {
				path {
					fill: ${theme.color.text_disabled ?? '#00000066'};
				}
			}
		}

		&:hover {
			color: ${theme.color.interactive_hover ?? '#A31816'};
			svg {
				path {
					fill: ${theme.color.interactive_hover ?? '#A31816'};
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
			svg {
				path {
					fill: ${theme.color.interactive_onDark ?? '#FFFFFF'};
				}
			}

			&:hover {
				color: ${theme.color.background_red1 ?? '#F8DEDD'};
				svg {
					path {
						fill: ${theme.color.background_red1 ?? '#F8DEDD'};
					}
				}
			}

			&:disabled {
				color: ${theme.color.interactive_disabled_background ?? '#FFFFFF66'};
				svg {
					path {
						fill: ${theme.color.interactive_disabled_background ?? '#FFFFFF66'};
					}
				}
			}
		}
	`}
`;

export const ButtonTertiary = ({
	label,
	icon,
	className,
	inverted,
	focusState,
	onClick,
	...props
}: ButtonTertiaryProps) => {
	return (
		<StyledButtonTertiary
			type="button"
			className={`${className} ${inverted && 'inverted'} ${
				focusState && 'focus'
			}`}
			onClick={onClick}
			{...props}
		>
			{icon && icon} {label && label}
		</StyledButtonTertiary>
	);
};
