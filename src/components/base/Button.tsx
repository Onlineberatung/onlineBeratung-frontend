import React, { HTMLAttributes, ReactElement, useEffect, useRef } from 'react';
import styled from 'styled-components';

export const SIZE_PRIMARY = 'primary';
export const SIZE_SECONDARY = 'secondary';
export const SIZE_TERTIARY = 'tertiary';
export const SIZE_SMALL = 'small';
export const SIZE_FEEDBACK = 'feedback';

export const LOADING_TIMEOUT = 10000;

export type SIZES =
	| typeof SIZE_PRIMARY
	| typeof SIZE_SECONDARY
	| typeof SIZE_TERTIARY
	| typeof SIZE_SMALL
	| typeof SIZE_FEEDBACK;

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
	size?: SIZES;
	label?: string;
	icon?: ReactElement;
	inverted?: boolean;
	loading?: boolean;
}

const StyledButton = styled.button`
	${({ theme }) => `
		box-shadow: ${theme.button.boxShadow.default};
		color: ${theme.colors.primary};
		background-color: ${theme.colors.white};
		border: ${theme.button.border.style} ${theme.colors.primary};
		border-radius: ${theme.button.border.radius};
		font-size: ${theme.button.fontSize};
		line-height: ${theme.button.lineHeight};
		font-weight: ${theme.button.fontWeight};
		padding: ${theme.button.padding};
		
		&:hover {
			color: ${theme.colors.white};
			background-color: ${theme.colors.hoverPrimary};
		}
		
		&:disabled,
	 	&:disabled:hover {
			border-color: ${theme.button.disabled};
			color: ${theme.button.disabled};
		}
		
		&.primary {
			color: ${theme.colors.white};
			background-color: ${theme.colors.primary};
			
			&:disabled,
	 		&:disabled:hover {
				border-color: transparent;
				color: ${theme.button.primary.disabled};
				background-color: ${theme.button.primary.disabled};
			}
		}
		
		&.loading {
			color: ${theme.colors.white};
			background: linear-gradient(to right,
				${theme.button.loading.color} 50%,
				${theme.colors.primary} 50%
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
				border-color: ${theme.colors.hoverPrimary};
				background: linear-gradient(
					to right,
					${theme.button.loading.color} 50%,
					${theme.colors.hoverPrimary} 50%
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
	`}
`;

// We are passing a default theme for Buttons that arent wrapped in the ThemeProvider
StyledButton.defaultProps = {
	theme: {
		colors: {
			primary: '#CC1E1C',
			hoverPrimary: '#A31816',
			hoverSelect: '#F4D2D1',
			secondary: '#CC1E1C',
			white: '#FFFFFF'
		},
		button: {
			boxShadow: {
				default: '0px 6px 0px rgba(0, 0, 0, 0.1)'
			},
			border: {
				radius: '24px',
				style: '2px solid'
			},
			fontSize: '16px',
			fontWeight: '700',
			lineHeight: '21px',
			padding: '8px 24px',
			disabled: 'rgba(0, 0, 0, 0.2)',
			primary: {
				disabled: 'rgba(0, 0, 0, 0.12)'
			},
			secondary: {},
			loading: {
				color: '#E07876'
			}
		}
	}
};

/**
 * Primary UI component for user interaction
 */
export const Button = ({
	size = SIZE_SECONDARY,
	label,
	icon,
	className,
	loading,
	onClick,
	...props
}: ButtonProps) => {
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
		<StyledButton
			type="button"
			className={`${className} ${size} ${loading && 'loading'}`}
			onClick={onClick}
			{...props}
		>
			{icon && icon} {label && label}
		</StyledButton>
	);
};
