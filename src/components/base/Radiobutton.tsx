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
	font-family: ${theme.font.family};
	font-weight: ${theme.font.weight};
	font-size: ${theme.font.size};
	line-height: ${theme.font.lineHeight};

	position: relative;
	
	.radioButton {
		&--contentWrapper {
			display: flex;
			align-items: center;
			box-sizing: ${theme.border.boxSizing};
		}
	
		&--input {
			appearance: none;
			border: ${theme.border.style} ${theme.colors.default};
			border-radius: 50%;
			box-shadow: 0px 2px 0px 1px ${theme.colors.shadow} inset;
			flex: 0 0 auto;
			height: ${theme.radioButton.height};
			width: ${theme.radioButton.width};
			margin: ${theme.radioButton.spacer};
	
			&:checked {
				background-color: ${theme.colors.black};
				border: ${theme.border.styleBold} ${theme.colors.black};
				box-shadow: inset 0 0 0 4px white;

				&:hover {
					border: ${theme.border.styleBold} ${theme.colors.black};
				}
			}
	
			&:hover {
				border: ${theme.border.style} ${theme.colors.black};
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
		font-size: ${theme.font.sizeSmall};
		line-height: ${theme.font.lineHeightSmall};
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
		border: ${theme.border.style} ${theme.colors.disabled};
		border-radius: ${theme.border.radius};
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
			family: 'Roboto, sans-serif',
			weight: '400',
			size: '16px',
			sizeSmall: '12px',
			lineHeight: '150%',
			lineHeightSmall: '133%'
		},

		border: {
			style: '1px solid',
			styleBold: '2px solid',
			radius: '24px',
			boxSizing: 'border-box'
		},

		radioButton: {
			height: '24px',
			width: '24px',
			spacer: '0 12px 0 0',

			helperText: {
				fontSize: '12px',
				lineHeight: '133%'
			},

			icon: {
				height: '20px',
				width: '20px'
			},

			contained: {
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
	const radioButtonRef = useRef(null);
	const helperTextRef = useRef(null);

	let [isChecked, setIsChecked] = useState(false);

	let handleRadioButton = () => {
		setIsChecked(!isChecked);
	};

	useEffect(() => {
		if (disabled == false) {
			isChecked
				? (radioButtonRef.current.checked = true)
				: (radioButtonRef.current.checked = false);
		}
	}, [isChecked]);

	useEffect(() => {
		if (!disabled) {
			error
				? (helperTextRef.current.style.display = 'block')
				: (helperTextRef.current.style.display = 'none');
		}
	}, [error]);

	useEffect(() => {
		if (disabled == false && error == true) {
			radioButtonRef.current.removeAttribute('disabled');
			helperTextRef.current.style.display = 'block';
		} else if (disabled == false) {
			radioButtonRef.current.removeAttribute('disabled');
		} else {
			radioButtonRef.current.setAttribute('disabled', true);
			setIsChecked(false);
			helperTextRef.current.style.display = 'none';
			radioButtonRef.current.checked = false;
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
