import React, {
	HTMLAttributes,
	ReactElement,
	useEffect,
	useRef,
	useState
} from 'react';
import styled from 'styled-components';

export const STATUS_DEFAULT = 'default';
export const STATUS_DISABLED = 'disabled';
export const STATUS_ERROR = 'error';

export type STATUS =
	| typeof STATUS_DEFAULT
	| typeof STATUS_ERROR
	| typeof STATUS_DISABLED;

interface RadiobuttonProps extends HTMLAttributes<HTMLDivElement> {
	status?: STATUS;
	label?: string;
	icon?: ReactElement;
	helperText?: string;
	contained?: boolean;
}

const StyledRadiobutton = styled.div`
	${({ theme }) => `
	font-family: ${theme.font.family_sans_serif ?? 'Roboto, sans-serif'};
	font-weight: ${theme.font.weight_regular ?? '400'};
	font-size: ${theme.font.size_primary ?? '16px'};
	line-height: ${theme.font.line_height_senary ?? '24px'};

	position: relative;
	
	.radioButton {
		&--contentWrapper {
			display: flex;
			align-items: center;
		}
	
		&--input {
			appearance: none;
			border: ${theme.border.style ?? '1px solid'} ${
		theme.color.outline ?? '#00000033'
	};
			border-radius: 50%;
			flex: 0 0 auto;
			height: 24px;
			width: 24px;
			margin: 0 12px 0 0;
			
			&:checked {
				border: ${theme.border.style_bold ?? '2px solid'} ${
		theme.color.interactive_secondary ?? '#000000E5'
	};

				&:hover {
					border: ${theme.border.style_bold ?? '2px solid'} ${
		theme.color.interactive_secondary ?? '#000000E5'
	};
				}

				&:after {
					width: 14px;
					height: 14px;
					border-radius: 15px;
					top: 3px;
					left: 3px;
					position: relative;
					background-color: ${theme.color.interactive_secondary ?? '#000000E5'};
					content: '';
					display: inline-block;
				}
			}
	
			&:hover {
				border: ${theme.border.style ?? '1px solid'} ${
		theme.color.interactive_secondary ?? '#000000E5'
	};
			}
		}

		&--label {
			color: ${theme.color.interactive_secondary ?? '#000000E5'};
		}
	}

	.helperText {
		position: absolute;
		top: 25px;
		left: 36px;
		display: none;
		font-size: ${theme.font.size_secondary ?? '12px'};
		line-height: ${theme.font.line_height_secondary ?? '16px'};
		color: ${theme.color.status_error_foreground ?? '#FF0000'};

		&--position-contained {
			top: 55px;
			left: 53px;
		}
	}

	&.error {
		.radioButton {
			&--input {
				border: ${theme.border.style_bold ?? '2px solid'} ${
		theme.color.status_error_foreground ?? '#FF0000'
	};
				&:checked {		
					border: ${theme.border.style_bold ?? '2px solid'} ${
		theme.color.status_error_foreground ?? '#FF0000'
	};

					&:after {
						background-color: ${theme.color.status_error_foreground ?? '#FF0000'};
					}
				}
			}
		}
	}

	&.disabled {
		.radioButton {
			&--input {
				border-color: ${
					theme.color.interactive_disabled_background_black ??
					'#0000000D'
				};

				&:checked {
					border: ${theme.border.style ?? '1px solid'} ${
		theme.color.interactive_disabled_background_black ?? '#0000000D'
	};

					&:after {
						background-color: ${
							theme.color.interactive_disabled_background_black ??
							'#0000000D'
						};
					}
				}
			}
			&--label {
				color: ${theme.color.text_disabled ?? '#00000066'};
			}
		}
	}

	.contained {
		border: ${theme.border.style ?? '1px solid'} ${
		theme.color.outline ?? '#00000033'
	};
		border-radius: 24px;
		padding: 12px 16px;
		width: max-content;
	}
	`}
`;

export const Radiobutton = ({
	status = STATUS_DEFAULT,
	label,
	icon,
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
		radioButtonRef.current.checked = isChecked;
	}, [isChecked]);

	useEffect(() => {
		if (status == 'disabled') {
			radioButtonRef.current.checked = false;
			setIsChecked(false);
			helperTextRef.current.style.display = 'none';
		} else if (status == 'error') {
			helperTextRef.current.style.display = 'block';
		} else {
			helperTextRef.current.style.display = 'none';
		}
	}, [status]);

	return (
		<StyledRadiobutton
			type="radio"
			className={`${className} ${status && status} ${
				contained && 'contained'
			}`}
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
