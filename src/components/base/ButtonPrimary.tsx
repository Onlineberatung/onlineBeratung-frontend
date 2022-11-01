import React, { HTMLAttributes, ReactElement, useEffect, useRef } from 'react';
import styled from 'styled-components';

export const LOADING_TIMEOUT = 10000;

interface ButtonPrimaryProps extends HTMLAttributes<HTMLButtonElement> {
	label?: string;
	icon?: ReactElement;
	inverted?: boolean;
	loading?: boolean;
	focusState?: boolean;
}

const StyledButtonPrimary = styled.button`
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

		background-color: ${theme.color.interactive_primary ?? '#CC1E1C'};
		color: ${theme.color.interactive_onDark ?? '#FFFFFF'};
		
		svg {
			margin: 0 10px 0 0;

			path {
				fill: ${theme.color.interactive_onDark ?? '#FFFFFF'};
				width: 19.5px;
				height: 17px;
			}
		}

		&:disabled,
		&:disabled:hover {
			border-color: transparent;
			color: ${theme.color.text_disabled ?? '#00000066'};
			background-color: ${
				theme.color.interactive_disabled_background_black ?? '#0000000D'
			};

			svg {
				path {
					fill: ${theme.color.text_disabled ?? '#00000066'};
				}
			}
		}

		&:hover {
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

		&.loading {
			background: linear-gradient(to right,
				${theme.color.background_red4 ?? '#E07876'} 50%,
				${theme.color.interactive_primary ?? '#CC1E1C'} 50%
			);
			background-size: 200% 100%;
			animation: loadAnimation ${LOADING_TIMEOUT / 1000}s linear;
			@keyframes loadAnimation {
				from {
					background-position: right bottom;
				}
				to {
					background-position: left bottom;
				}
			}

			&:hover {
				border-color: ${theme.color.interactive_hover ?? '#A31816'};
				background: linear-gradient(
					to right,
					${theme.color.background_red4 ?? '#E07876'} 50%,
					${theme.color.interactive_hover ?? '#A31816'} 50%
				);
				background-size: 200% 100%;
				animation: loadAnimation ${LOADING_TIMEOUT / 1000}s linear;
				@keyframes loadAnimation {
					from {
						background-position: right bottom;
					}
					to {
						background-position: left bottom;
					}
				}
			}
		}

		&.inverted {
			color: ${theme.color.interactive_primary ?? '#CC1E1C'};
			background-color: ${theme.color.interactive_onDark ?? '#FFFFFF'};
			border-color: ${theme.color.interactive_onDark ?? '#FFFFFF'};
			svg {
				path {
					fill: ${theme.color.interactive_primary ?? '#CC1E1C'};
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
				color: ${theme.color.interactive_disabled_background_white ?? '#FFFFFF99'};
				background-color: ${theme.color.interactive_disabled_background ?? '#FFFFFF66'};
				border-color: transparent;
				svg {
					path {
						fill: ${theme.color.interactive_disabled_background_white ?? '#FFFFFF99'};
					}
				}
			}

			&.loading {
				box-shadow: 0px 6px 0px #0000001A;
				background: linear-gradient(to right,
					${theme.color.background_red2 ?? '#F4D2D1'} 50%,
					${theme.color.interactive_onDark ?? '#FFFFFF'} 50%
				);
				background-size: 200% 100%;
				animation: loadAnimation ${LOADING_TIMEOUT / 1000}s linear;
				@keyframes loadAnimation {
					from {
						background-position: right bottom;
					}
					to {
						background-position: left bottom;
					}
				}
	
				&:hover {
					border-color: ${theme.color.background_red1 ?? '#F8DEDD'};
					background: linear-gradient(
						to right,
						${theme.color.background_red3 ?? '#EAA5A4'} 50%,
						${theme.color.background_red1 ?? '#F8DEDD'} 50%
					);
					background-size: 200% 100%;
					animation: loadAnimation ${LOADING_TIMEOUT / 1000}s linear;
					@keyframes loadAnimation {
						from {
							background-position: right bottom;
						}
						to {
							background-position: left bottom;
						}
					}
				}
			}
		}
	`}
`;

export const ButtonPrimary = ({
	label,
	icon,
	className,
	loading,
	inverted,
	focusState,
	onClick,
	...props
}: ButtonPrimaryProps) => {
	const timer = useRef(null);

	useEffect(() => {
		if (loading) {
			timer.current = window.setTimeout(() => {
				onClick(undefined);
			}, LOADING_TIMEOUT);
		}

		return (): void => {
			if (timer.current) window.clearTimeout(timer.current);
		};
	});

	return (
		<StyledButtonPrimary
			type="button"
			className={`${className} ${loading && 'loading'} ${
				focusState && 'focus'
			} ${inverted && 'inverted'}`}
			onClick={onClick}
			{...props}
			tabIndex={1}
		>
			{icon && icon} {label && label}
		</StyledButtonPrimary>
	);
};
