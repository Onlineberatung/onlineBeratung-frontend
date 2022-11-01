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
	focusState?: boolean;
}

const StyledCheckbox = styled.div`
	${({ theme }) => `
		font-family: ${theme.font.family_sans_serif ?? 'Roboto, sans-serif'};
		font-weight: ${theme.font.weight_regular ?? '400'};
		font-size: ${theme.font.size_primary ?? '16px'};
		line-height: ${theme.font.line_height_senary ?? '24px'};

		.container {
			display: flex;
			justify-content: flex-start;
			align-items: center;
		}

		.helperText {
			display: none;
			margin-left: 36px;
			font-size: ${theme.font.size_secondary ?? '12px'};
			line-height: ${theme.font.line_height_secondary ?? '24px'};
			color: ${theme.color.status_error_foreground ?? '#FF0000'};
		}

		.checkbox {
			&--container {
				position: relative;
				padding: 0;
				margin: 0;
				height: 24px;
				width: 24px;
				margin: 0 12px 0 0;
				border-radius: ${theme.border.radius ?? '4px'};

				&:hover {
					.checkbox--input{
						border-color: ${theme.color.interactive_secondary ?? '#000000E5'};
					}
				}

				&.focus {
					outline: 2px solid #199FFF;
					outline-offset: 4px;
				}

				&:focus {
					outline: 2px solid #199FFF;
					outline-offset: 4px;
				}
		
				&:focus:not(:focus-visible) {
					outline: none;
				}
			}

			&--input {
				appearance: none;
				height: 24px;
				width: 24px;
				margin: 0;
				border: ${theme.border.style ?? '1px solid'} ${
		theme.color.interactive_secondary ?? '#000000E5'
	};
				border-radius: ${theme.border.radius ?? '4px'};
				background: ${theme.color.interactive_onDark ?? '#FFFFFF'};
				box-sizing: border-box;
			}

			&--icon {
				display: none;
				position: absolute;
				top: 2px;
				left: 2px;
				width: 20px;
				height: 20px;
				svg {
					width: 20px;
					height: 20px;
					path {
						fill: ${theme.color.interactive_secondary ?? '#000000E5'};
					}
				}
			}

			&--label {
				color: ${theme.color.interactive_secondary ?? '#000000E5'};
			}
		}

		.isChecked  {
			border: ${theme.border.style_bold ?? '2px solid'} ${
		theme.color.interactive_secondary ?? '#000000E5'
	} !important;
		}
	
		&.disabled {
			.checkbox {
				&--label {
					color: ${theme.color.outline ?? '#00000033'};
				}

				&--input {
					border-color: ${theme.color.outline ?? '#00000033'};
					box-shadow: none;
				}

				&--container {
					&:hover {
						.checkbox--input{
							border-color: ${theme.color.outline ?? '#00000033'} !important;
						}
					}
				}
			}
		}

		&.error {
			.checkbox {
				&--input {
					border: ${theme.border.style_bold ?? '2px solid'} ${
		theme.color.status_error_foreground ?? '#FF0000'
	} !important;
					background-color: ${theme.color.interactive_onDark ?? '#FFFFFF'} !important;
				}
			}

			.checkbox--icon {
				svg {
					path {
						fill: ${theme.color.status_error_foreground ?? '#FF0000'};
					}
				}
			}
		}
	`}
`;

export const Checkbox = ({
	label,
	icon,
	disabled = false,
	error = false,
	helperText,
	focusState,
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
					className={`checkbox--container ${focusState && 'focus'}`}
					onClick={() => checkEffect()}
					tabIndex={0}
				>
					<input
						className="checkbox--input"
						ref={checkboxInputRef}
						type="checkbox"
						tabIndex={-1}
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
