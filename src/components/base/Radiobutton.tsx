import React, {
	HTMLAttributes,
	ReactElement,
	useEffect,
	useRef,
	useState
} from 'react';
import styled from 'styled-components';

interface RadiobuttonProps extends HTMLAttributes<HTMLDivElement> {
	label?: string;
	icon?: ReactElement;
	disabled?: boolean;
	error?: boolean;
	helperText?: string;
	contained?: boolean;
}

const StyledRadiobutton = styled.div`
	${({ theme }) => `
	font-family: ${theme.font.fontFamily};
	font-weight: ${theme.font.fontWeight};
	font-size: ${theme.font.fontSize};
	line-height: ${theme.font.lineHeight};

	position: relative;
	
	.radioButton {
		&--contentWrapper {
			display: flex;
			align-items: center;
			box-sizing: border-box;
		}
	
		&--input {
			appearance: none;
			border: ${theme.radioButton.border} ${theme.colors.default};
			border-radius: 50%;
			box-shadow: 0px 2px 0px 1px ${theme.colors.shadow} inset;
			flex: 0 0 auto;
			height: ${theme.radioButton.height};
			width: ${theme.radioButton.width};
			margin: ${theme.radioButton.spacer};
	
			&:checked {
				background-color: ${theme.colors.black};
				border: 2px solid ${theme.colors.black};
				box-shadow: inset 0 0 0 4px white;

				&:hover {
					border: 2px solid ${theme.colors.black};
				}
			}
	
			&:hover {
				border: ${theme.radioButton.border} ${theme.colors.black};
			}
		}

		&--label {
			color: ${theme.colors.black};
		}
	}

	.helperText {
		position: absolute;
		top: 25px;
		left: 36px;
		display: none;
		font-size: ${theme.radioButton.helperText.fontSize};
		line-height: ${theme.radioButton.helperText.lineHeight};
		color: ${theme.colors.error};

		&--position-contained {
			top: 55px;
			left: 53px;
		}
	}

	&.error {
		.radioButton {
			&--input {
				&:checked {
					border: 2px solid ${theme.colors.error};
					background-color: ${theme.colors.error};
				}
			}
		}
	}

	&.disabled {
		.radioButton {
			&--input {
				border-color: ${theme.colors.disabled};
			}
			&--label {
				color: ${theme.colors.disabled};
			}
		}
	}

	.contained {
		border: ${theme.radioButton.border} ${theme.colors.disabled};
		border-radius: ${theme.radioButton.contained.borderRadius};
		padding: ${theme.radioButton.contained.padding};
		width: max-content;
	}	
	`}
`;

StyledRadiobutton.defaultProps = {
	theme: {
		colors: {
			white: '#FFFFFF',
			black: '#000000DE',
			default: '#00000066',
			disabled: '#00000033',
			error: '#FF0000',
			shadow: '#0000001A'
		},

		font: {
			fontFamily: 'Roboto, sans-serif',
			fontWeight: '400',
			fontSize: '16px',
			lineHeight: '150%'
		},

		radioButton: {
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
			},

			contained: {
				borderRadius: '24px',
				padding: '12px 16px'
			}
		}
	}
};

export const Radiobutton = ({
	label,
	icon,
	disabled = false,
	error = false,
	contained = false,
	helperText,
	className,
	...props
}: RadiobuttonProps) => {
	const [isChecked, setIsChecked] = useState(false);
	let radioButtonRef = useRef(null);
	const helperTextRef = useRef(null);

	let handleRadioButton = () => {
		isChecked
			? (radioButtonRef.current.checked = false)
			: (radioButtonRef.current.checked = true);
		setIsChecked(!isChecked);
	};

	useEffect(() => {
		if (!disabled) {
			error
				? (helperTextRef.current.style.display = 'block')
				: (helperTextRef.current.style.display = 'none');
		}
	}, [error]);

	useEffect(() => {
		if (disabled) {
			radioButtonRef.current.disabled = true;
			helperTextRef.current.style.display = 'none';
			if (isChecked) radioButtonRef.current.checked = false;
		} else {
			radioButtonRef.current.disabled = false;
		}
	}, [disabled]);

	return (
		<StyledRadiobutton
			type="radio"
			className={`${className} ${disabled && 'disabled'} ${
				error && 'error'
			} ${contained && 'contained'}`}
			{...props}
		>
			<div
				className={`${
					contained && 'contained'
				} radioButton--contentWrapper`}
			>
				<input
					onClick={() => handleRadioButton()}
					id="radio"
					className="radioButton--input"
					type="radio"
					ref={radioButtonRef}
				/>
				<label className="radioButton--label">{label && label}</label>
			</div>
			<div
				ref={helperTextRef}
				className={`${
					contained && 'helperText--position-contained'
				} helperText`}
			>
				{helperText && helperText}
			</div>
		</StyledRadiobutton>
	);
};
