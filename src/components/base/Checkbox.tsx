import React, { HTMLAttributes, ReactElement, useEffect, useRef } from 'react';
import styled from 'styled-components';

interface CheckboxProps extends HTMLAttributes<HTMLDivElement> {
	label?: string;
	icon?: ReactElement;
	disabled?: boolean;
	error?: boolean;
	helperText?: string;
}

const StyledCheckbox = styled.div`
	${({ theme }) => `
		font-family: ${theme.font.fontFamily};
		font-weight: ${theme.font.fontWeight};
		font-size: ${theme.font.fontSizeLarge};
		line-height: ${theme.font.lineHeightLarge};

		.container {
			display: flex;
			justify-content: flex-start;
			align-items: center;
		}

		.helperText {
			display: none;
			margin-left: 36px;
			font-size: ${theme.checkbox.helperText.fontSize};
			line-height: ${theme.checkbox.helperText.lineHeight};
			color: ${theme.colors.error};
		}

		.checkbox {
			&--container {
				position: relative;
				padding: 0;
				margin: 0;
				height: ${theme.checkbox.height};
				width: ${theme.checkbox.width};
				margin: ${theme.checkbox.spacer};

				&:hover {
					.checkbox--input{
						border-color: ${theme.colors.black};
					}
				}
			}

			&--input {
				appearance: none;
				height: ${theme.checkbox.height};
				width: ${theme.checkbox.width};
				margin: 0;
				border: ${theme.checkbox.border} ${theme.colors.default};
				border-radius: ${theme.checkbox.borderRadius};
				box-shadow: ${theme.checkbox.BoxShadow};
				background: ${theme.colors.white};
				box-sizing: ${theme.checkbox.boxSizing};
			}

			&--icon {
				display: none;
				position: absolute;
				top: 2px;
				left: 2px;
				width: ${theme.checkbox.icon.width};
				height: ${theme.checkbox.icon.height};
				svg {
					width: ${theme.checkbox.icon.width};
					height: ${theme.checkbox.icon.height};
					path {
						fill: ${theme.colors.black};
					}
				}
			}

			&--label {
				color: ${theme.colors.black};
			}
		}

		.isChecked  {
			border: ${theme.checkbox.borderBold} ${theme.colors.black} !important;
		}
	
		&.disabled {
			.checkbox {
				&--label {
					color: ${theme.colors.disabled};
				}

				&--input {
					border-color: ${theme.colors.disabled};
					box-shadow: none;
				}

				&--container {
					&:hover {
						.checkbox--input{
							border-color: ${theme.colors.disabled};
						}
					}
				}
			}
		}

		&.error {
			.isChecked  {
				border: none !important;
				background-color: ${theme.colors.error} !important;
			}

			.checkbox--icon {
				svg {
					path {
						fill: ${theme.colors.white};
					}
				}
			}
		}
	`}
`;

StyledCheckbox.defaultProps = {
	theme: {
		colors: {
			white: '#FFFFFF',
			black: '#000000DE',
			default: '#00000066',
			disabled: '#00000033',
			error: '#FF0000'
		},

		font: {
			fontFamily: 'Roboto, sans-serif',
			fontWeight: '400',
			fontSizeLarge: '16px',
			lineHeightLarge: '150%'
		},

		checkbox: {
			height: '24px',
			width: '24px',
			borderRadius: '4px',
			boxShadow: 'inset 0px 2px 0px 1px rgba(0, 0, 0, 0.1)',
			boxSizing: 'border-box',
			spacer: '0 12px 0 0',
			border: '1px solid',
			borderBold: '2px solid',

			helperText: {
				fontSize: '12px',
				lineHeight: '133%'
			},

			icon: {
				height: '20px',
				width: '20px'
			}
		}
	}
};

export const Checkbox = ({
	label,
	icon,
	disabled = false,
	error = false,
	helperText,
	className,
	...props
}: CheckboxProps) => {
	const checkboxInputRef = useRef(null);
	const checkboxIconRef = useRef(null);
	const helperTextRef = useRef(null);

	let isChecked = false;

	useEffect(() => {
		if (!disabled) {
			let visibility;
			error ? (visibility = 'block') : (visibility = 'none');
			helperTextRef.current.style.display = visibility;
		}
	}, [error]);

	useEffect(() => {
		if (disabled) {
			checkboxInputRef.current.classList.remove('isChecked');
			checkboxIconRef.current.style.display = 'none';
			helperTextRef.current.style.display = 'none';
		}
	}, [disabled]);

	let checkEffect = () => {
		isChecked = !isChecked;
		if (!disabled) {
			if (isChecked) {
				checkboxInputRef.current.classList.add('isChecked');
				checkboxIconRef.current.style.display = 'block';
			} else {
				checkboxInputRef.current.classList.remove('isChecked');
				checkboxIconRef.current.style.display = 'none';
			}
		}
	};

	return (
		<StyledCheckbox
			type="checkbox"
			className={`${className} ${disabled && 'disabled'} ${
				error && 'error'
			}`}
			{...props}
		>
			<div className="container">
				<div
					className="checkbox--container"
					onClick={() => checkEffect()}
				>
					<input
						className="checkbox--input"
						ref={checkboxInputRef}
						type="checkbox"
					/>
					<span className="checkbox--icon" ref={checkboxIconRef}>
						{icon && icon}
					</span>
				</div>
				<label className="checkbox--label">{label && label}</label>
			</div>
			<div ref={helperTextRef} className="helperText">
				{helperText && helperText}
			</div>
		</StyledCheckbox>
	);
};
