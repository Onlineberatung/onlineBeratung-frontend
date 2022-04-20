import { NONAME } from 'dns';
import React, { HTMLAttributes, ReactElement, useEffect, useRef } from 'react';
import styled from 'styled-components';

export const SIZE_PRIMARY = 'primary';
export const SIZE_SECONDARY = 'secondary';
export const SIZE_TERTIARY = 'tertiary';
export const SIZE_SMALL = 'small';
export const SIZE_FEEDBACK = 'feedback';
export const SIZE_ICON = 'icon';
export const SIZE_SCROLLTOP = 'scrollTop';

export const LOADING_TIMEOUT = 10000;

export type SIZES =
	| typeof SIZE_PRIMARY
	| typeof SIZE_SECONDARY
	| typeof SIZE_TERTIARY
	| typeof SIZE_SMALL
	| typeof SIZE_FEEDBACK
	| typeof SIZE_ICON
	| typeof SIZE_SCROLLTOP;

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
		
		&.primary {
			display: flex;
			align-items: center;
			height: 48px;
			line-height: 21px;

			padding: 12px 24px;
			color: ${theme.colors.white};
			background-color: ${theme.colors.primary};
			text-transform: uppercase;
			
			svg {
				margin: 0 8px 0 0;

				path {
					fill: ${theme.colors.white};
					width: 19.5px;
					height: 17px;
				}
			}

			

			&:disabled,
	 		&:disabled:hover {
				border-color: transparent;
				color: ${theme.button.primary.disabled};
				background-color: ${theme.button.primary.disabled};
				box-shadow: none;

				svg {
					path {
						fill: ${theme.button.primary.disabled};
					}
				}
			}

			&:hover {
				background-color: ${theme.colors.hoverPrimary};
				border-color: ${theme.colors.hoverPrimary};
			}

			&.inverted {
				color: ${theme.colors.primary};
				background-color: ${theme.colors.white};
				border-color: ${theme.colors.white};
				svg {
					path {
						fill: ${theme.colors.primary};
					}
				}

				&:hover {
					color: ${theme.colors.hoverPrimary};
					background-color: #F8DEDD;
					border-color: #F8DEDD;
					svg {
						path {
							fill: ${theme.colors.hoverPrimary};
						}
					}
				}

				&:disabled {
					color: #FFFFFF99;
					background-color: #FFFFFF66;
					border-color: transparent;
					svg {
						path {
							fill: #FFFFFF99;
						}
					}
				}
			}
		}

		&.secondary {
			display: flex;
			align-items: center;
			height: 48px;
			line-height: 21px;

			padding: 12px 24px;
			color: ${theme.colors.primary};
			background-color: ${theme.colors.white};
			text-transform: uppercase;
			line-height: 20px;

			svg {
				margin: 0 8px 0 0;

				path {
					fill: ${theme.colors.primary};
					width: 19.5px;
					height: 17px;
				}
			}

			&.inverted {
				color: ${theme.colors.white};
				background-color: transparent;
				border-color: ${theme.colors.white};
				box-shadow: none;
				svg {
					path {
						fill: ${theme.colors.white};
					}
				}

				&:hover {
					background: #F8DEDD;
					border-color: #F8DEDD;
					color: ${theme.colors.hoverPrimary};
					svg {
						path {
							fill: ${theme.colors.hoverPrimary};
						}
					}
				}

				&:disabled {
					border-color: #FFFFFF66;
					color: #FFFFFF66;
					background: transparent;
					box-shadow: none;
					svg {
						path {
							fill: #FFFFFF66;
						}
					}
				}
			}

			&:hover {
				background: ${theme.colors.hoverPrimary};
				border-color: ${theme.colors.hoverPrimary};
				color: ${theme.colors.white};
				svg {
					path {
						fill: ${theme.colors.white};
					}
				}
			}

			&:disabled {
				border-color: #00000033;
				color: #00000033;
				background: ${theme.colors.white};
				box-shadow: none;

				svg {
					path {
						fill: #00000033;
					}
				}
			}
		}

		&.tertiary {
			display: flex;
			align-items: center;
			height: 51px;
			line-height: 21px;
			border: none;
			box-shadow: none;
			background: none;

			padding: 15.5px 0px 2px 14.5;
			color: ${theme.colors.primary};
			text-transform: uppercase;
			line-height: 20px;

			svg {
				margin: 0 8px 0 0;

				path {
					fill: ${theme.colors.primary};
					width: 19.5px;
					height: 17px;
				}
			}

			&.inverted {
				color: ${theme.colors.white};
				svg {
					path {
						fill: ${theme.colors.white};
					}
				}

				&:hover {
					color: #F8DEDD;
					svg {
						path {
							fill: #F8DEDD;
						}
					}
				}

				&:disabled {
					color: #FFFFFF66;
					svg {
						path {
							fill: #FFFFFF66;
						}
					}
				}
			}

			&:hover {
				color: ${theme.colors.hoverPrimary};
				svg {
					path {
						fill: ${theme.colors.hoverPrimary};
					}
				}
			}

			&:disabled {
				color: #00000033;
				svg {
					path {
						fill: #00000033;
					}
				}
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

		&.icon {
			display: flex;
			justify-content: center;
			align-items: center;
			
			width: ${theme.button.icon.width};
			height: ${theme.button.icon.height};
			border-radius: ${theme.button.icon.borderRadius};
			border: ${theme.button.icon.border};
			padding: ${theme.button.icon.padding};
			background: ${theme.colors.secondary};
			box-shadow: ${theme.button.boxShadow.icon};

			svg {
				width: ${theme.button.icon.svg.width};
				height: ${theme.button.icon.svg.height};

				path {
					fill: ${theme.colors.white};
				}
			}

			&:hover {
				background: ${theme.colors.hoverPrimary};
			}

			&:disabled {
				background: ${theme.button.icon.disabled.color};
				box-shadow: ${theme.button.icon.disabled.boxShadow};
				path {
					fill:${theme.button.icon.disabled.color};
				}
			}
		}

		&.scrollTop {
			display: flex;
			justify-content: center;
			align-items: center;
			
			width: ${theme.button.scrollTop.width};
			height: ${theme.button.scrollTop.height};
			border-radius: ${theme.button.scrollTop.borderRadius};
			border: ${theme.button.scrollTop.border};
			padding: ${theme.button.scrollTop.padding};
			background: ${theme.colors.hoverPrimary};
			box-shadow: none;
			
			svg {
				width: ${theme.button.scrollTop.svg.width};
				height: ${theme.button.scrollTop.svg.height};

				path {
					fill: ${theme.colors.white};
				}
			}

			&:disabled {
				background: ${theme.colors.black};
			}
		}

		&.feedback {
			display: flex;
			align-items: center;
			width: ${theme.button.feedback.width};
			height: ${theme.button.feedback.height};
			padding: ${theme.button.feedback.padding};
			font-weight: ${theme.button.fontWeight};
			font-size: ${theme.button.feedback.fontSize};
			line-height: ${theme.button.feedback.lineHeight};
			border-radius: ${theme.button.border.radius};
			border: ${theme.button.feedback.border};
			background: ${theme.colors.feedback};
			color: ${theme.colors.black};
			box-shadow: ${theme.button.feedback.boxShadow};
			svg {
				width: ${theme.button.feedback.svg.width};
				height: ${theme.button.feedback.svg.height};
				margin: ${theme.button.feedback.svg.margin};
				path {
					fill: ${theme.colors.black};
				}
			}
			&:hover {
				background: ${theme.colors.hoverFeedback};
			}
		}

		&.small {
			border-color: ${theme.colors.black};
			color: ${theme.colors.black};
			padding: ${theme.button.small.padding};
			font-size: ${theme.button.small.fontSize};
			line-height: ${theme.button.small.lineHeight};

			&:hover {
				border-color: ${theme.colors.hoverPrimary};
				background-color: ${theme.colors.hoverPrimary};
				color: ${theme.colors.white};
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
			white: '#FFFFFF',
			feedback: '#FFDCA3',
			hoverFeedback: '#FEBD50',
			black: '#000000DE'
		},
		button: {
			boxShadow: {
				default: '0px 6px 0px rgba(0, 0, 0, 0.1)',
				icon: '0px 3px 0px rgba(0, 0, 0, 0.1)'
			},
			border: {
				radius: '24px',
				style: '3px solid'
			},
			fontSize: '16px',
			fontWeight: '700',
			lineHeight: '20px',
			padding: '8px 24px',
			disabled: 'rgba(0, 0, 0, 0.2)',
			primary: {
				disabled: 'rgba(0, 0, 0, 0.12)'
			},
			secondary: {},
			loading: {
				color: '#E07876'
			},
			icon: {
				height: '48px',
				width: '48px',
				borderRadius: '50%',
				border: 'none',
				padding: '0',
				svg: {
					height: '19.5px',
					width: '17px'
				},
				disabled: {
					color: '#0000001F',
					boxShadow: 'none'
				}
			},
			scrollTop: {
				height: '32px',
				width: '32px',
				borderRadius: '50%',
				border: 'none',
				padding: '0',
				boxShadow: 'none',
				svg: {
					height: '16px',
					width: '16px'
				}
			},
			feedback: {
				padding: '6px 12px 6px 12px',
				fontSize: '14px',
				lineHeight: '20px',
				height: '32px',
				width: 'max-content',
				boxShadow: 'none',
				border: 'none',
				svg: {
					height: '24px',
					width: '24px',
					margin: '0 6px 0 0'
				}
			},
			small: {
				padding: '6px 16px',
				fontSize: '14px',
				lineHeight: '20px'
			}
		}
	}
};

/**
 * Primary UI component for user interaction
 */
export const Button = ({
	size,
	label,
	icon,
	className,
	loading,
	inverted,
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
			className={`${className} ${size} ${loading && 'loading'} ${
				inverted && 'inverted'
			}`}
			onClick={onClick}
			{...props}
		>
			{icon && icon} {label && label}
		</StyledButton>
	);
};
