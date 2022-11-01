import React, { HTMLAttributes, ReactElement, useEffect, useRef } from 'react';
import styled from 'styled-components';

export const STATUS_DEFAULT = 'default';
export const STATUS_DISABLED = 'disabled';
export const STATUS_SUCCESS = 'success';
export const STATUS_ERROR = 'error';

export type STATUS =
	| typeof STATUS_DEFAULT
	| typeof STATUS_DISABLED
	| typeof STATUS_SUCCESS
	| typeof STATUS_ERROR;

interface TextinputProps extends HTMLAttributes<HTMLDivElement> {
	status?: STATUS;
	inputText?: string;
	label?: string;
	helperText?: string;
	type?: string;
	lockIcon?: ReactElement;
	eyeIcon?: ReactElement;
	withIcon?: boolean;
	focusState?: boolean;
}

const StyledTextinput = styled.div`
	${({ theme }) => `
		font-family: ${theme.font.family_sans_serif ?? 'Roboto, sans-serif'};
		font-weight: ${theme.font.weight_regular ?? '400'};
		font-size: ${theme.font.size_primary ?? '16px'};
		line-height: ${theme.font.line_height_senary ?? '24px'};

		.textInput {
			&--container {
				display: flex;
				align-items: center;
				justify-content: space-between;

				height: 48px;
				width: 229px;
				padding: 0px 12px 0px 16px;

				border: ${theme.border.style ?? '1px solid'} #00000033;
				border-radius: ${theme.border.radius ?? '4px'};
				box-sizing: border-box;

				&:hover {
					border-color: ${theme.color.interactive_secondary ?? '#000000E5'};
				}

				&:focus-within {
					border: ${theme.border.style_bold ?? '2px solid'} ${
		theme.color.interactive_secondary ?? '#000000E5'
	};
				}

				&.focus {
					border: ${theme.border.style_bold ?? '2px solid'} ${
		theme.color.interactive_secondary ?? '#000000E5'
	};
				}
			}

			&--label {
				font-size: ${theme.font.size_secondary ?? '12px'};;
				line-height: ${theme.font.line_height_secondary ?? '16px'};
				color: ${theme.color.text_emphasisLow ?? '#000000A6'};
			}

			&--text {
				all: unset;
				
				overflow: hidden;
				color: ${theme.color.text_emphasisHigh ?? '#000000E5'};
				width: 190px;

				&::placeholder {
					color: ${theme.color.text_emphasisLow ?? '#000000A6'};
				}
			}

			&--helperText {
				display: none;
				font-size: ${theme.font.size_secondary ?? '12px'};
				line-height: ${theme.font.line_height_secondary ?? '16px'};
				margin: 4px 0 0 0;
			}

			&--lockIcon {
				display: none;
				width: 32px;
				padding: 0 0 0 4px;

				svg {
					height: 21px;
					width: 16px;

					path: {
						fill: ${theme.color.interactive_secondary ?? '#000000E5'};
					}
				}
			}

			&--eyeIcon {
				display: none;
				width: 28px;

				svg {
					height: 12.5px;
					width: 18.33px;
					margin-left: 10px;

					path {
						fill: ${theme.color.interactive_tertiary ?? '#000000A6'};
					}
				}
			}
		}

		&.success {
			.textInput {
				&--container {
					border: ${theme.border.style_bold ?? '2px solid'} ${
		theme.color.status_success_foreground ?? '#4FCC5C'
	};
				}

				&--helperText {
					display: block;
					color: ${theme.color.status_success_foreground ?? '#4FCC5C'};
				}
			}
		}

		&.error {
			.textInput {
				&--container {
					border: ${theme.border.style_bold ?? '2px solid'} #FF0000;
				}
				&--helperText {
					display: block;
					color: #FF0000;
				}
			}
		}

		&.disabled {
			.textInput {
				background-color: ${
					theme.color.interactive_disabled_background_black ??
					'#0000000D'
				};

				&--container {
					border: none;
				}

				&--label {
					display: none;
				}

				&--text {
					&::placeholder {
						color: ${theme.color.text_placeholder ?? '#00000066'};
					}
				}

				&--lockIcon {
					svg {
						path {
							fill: ${theme.color.text_disabled ?? '#00000066'};
						}
					}
				}
	
				&--eyeIcon {
					svg {
						path {
							fill: ${theme.color.interactive_secondary ?? '#000000E5'};
						}
					}
				}

			}
		}

		&.withIcon {
			.textInput {
				&--eyeIcon {
					display: block;
				}

				&--text {
					width: 126px;
				}
				
				&--lockIcon {
					display: block;
				}
			}
		}
	`}
`;

export const Textinput = ({
	status = 'default',
	inputText,
	label,
	helperText,
	type = 'text',
	lockIcon,
	eyeIcon,
	withIcon = false,
	focusState,
	className,
	...props
}: TextinputProps) => {
	const textInputRef = useRef(null);

	useEffect(() => {
		if (status == 'disabled') {
			textInputRef.current.setAttribute('disabled', 'true');
			textInputRef.current.value = '';
		} else {
			textInputRef.current.removeAttribute('disabled');
		}
	}, [status]);

	let switchPasswordVisibility = () => {
		if (type == 'password' && status != 'disabled') {
			textInputRef.current.type == 'password'
				? (textInputRef.current.type = 'text')
				: (textInputRef.current.type = 'password');
		}
	};

	return (
		<StyledTextinput
			type="textinput"
			className={`${className} ${status} ${withIcon && 'withIcon'} `}
			{...props}
		>
			<div className={`textInput--container ${focusState && 'focus'}`}>
				<div className="textInput--lockIcon">
					{lockIcon && lockIcon}
				</div>

				<div>
					<div className="textInput--label">{label && label}</div>

					<input
						type={type && type}
						className="textInput--text"
						ref={textInputRef}
						placeholder={inputText && inputText}
					/>
				</div>

				<div
					className="textInput--eyeIcon"
					onClick={() => switchPasswordVisibility()}
				>
					{eyeIcon && eyeIcon}
				</div>
			</div>

			<span className="textInput--helperText">
				{helperText && helperText}
			</span>
		</StyledTextinput>
	);
};
