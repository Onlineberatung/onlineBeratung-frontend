import React, {
	HTMLAttributes,
	ReactElement,
	useEffect,
	useRef,
	useState
} from 'react';
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
		font-family: ${theme.font.family};
		font-weight: ${theme.font.weight};
		font-size: ${theme.font.size};
		line-height: ${theme.font.lineHeight};

		.container {
			display: flex;
			justify-content: flex-start;
			align-items: center;
		}

		.helperText {
			display: none;
			margin-left: 36px;
			font-size: ${theme.font.sizeSmall};
			line-height: ${theme.font.lineHeightSmall};
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
				border: ${theme.border.style} ${theme.colors.default};
				border-radius: ${theme.border.radius};
				box-shadow: ${theme.checkbox.boxShadow};
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
			border: ${theme.border.styleBold} ${theme.colors.black} !important;
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
			family: 'Roboto, sans-serif',
			weight: '400',
			size: '16px',
			sizeSmall: '12px',
			lineHeight: '150%',
			lineHeightSmall: '133%'
		},

		border: {
			radius: '4px',
			style: '1px solid',
			styleBold: '2px solid'
		},

		checkbox: {
			height: '24px',
			width: '24px',

			boxShadow: 'inset 0px 2px 0px 1px rgba(0, 0, 0, 0.1)',
			boxSizing: 'border-box',
			spacer: '0 12px 0 0',

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

	const [isChecked, setIsChecked] = useState(false);

	useEffect(() => {
		if (!disabled) {
			error
				? (helperTextRef.current.style.display = 'block')
				: (helperTextRef.current.style.display = 'none');
		}
	}, [error]);

	useEffect(() => {
		if (disabled == false && error == true) {
			helperTextRef.current.style.display = 'block';
		} else {
			checkboxInputRef.current.classList.remove('isChecked');
			setIsChecked(false);
			checkboxIconRef.current.style.display = 'none';
			helperTextRef.current.style.display = 'none';
		}
	}, [disabled]);

	let checkEffect = () => {
		setIsChecked(!isChecked);
	};

	useEffect(() => {
		if (!disabled) {
			if (isChecked) {
				checkboxInputRef.current.classList.add('isChecked');
				checkboxIconRef.current.style.display = 'block';
			} else {
				checkboxInputRef.current.classList.remove('isChecked');
				checkboxIconRef.current.style.display = 'none';
			}
		}
	}, [isChecked]);

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
