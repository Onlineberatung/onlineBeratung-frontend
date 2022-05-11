import React, { HTMLAttributes, ReactElement, useEffect, useRef } from 'react';
import styled from 'styled-components';

interface TextinputProps extends HTMLAttributes<HTMLDivElement> {
	inputText?: string;
	label?: string;
	helperText?: string;
	type?: string;
	lockIcon?: ReactElement;
	eyeIcon?: ReactElement;
	variant?: string;
	withIcon?: boolean;
}

const StyledTextinput = styled.div`
	${({ theme }) => `
		font-family: ${theme.font.family};
		font-weight: ${theme.font.weight};
		font-size: ${theme.font.size};
		line-height: ${theme.font.lineHeight};

		.textInput {
			&--container {
				display: flex;
				align-items: center;
			}

			&--lockIcon {
				display: none;
				margin: ${theme.textinput.lockIcon.margin};

				svg {
					height: ${theme.textinput.lockIcon.height};
					width: ${theme.textinput.lockIcon.width};
				}
			}

			&--helperText {
				display: none;
				font-size: ${theme.font.sizeSmall};
				margin: ${theme.textinput.helperText.marginWithoutIcon};
			}

			&--input {
			
				&-container {
					display: inline flex;
					align-items: center;
					position: relative;

					height:  ${theme.textinput.height};
					width: ${theme.textinput.width};
					padding: ${theme.textinput.padding};

					border: ${theme.border.style};
					border-radius: ${theme.border.radius};
					box-shadow: ${theme.border.boxShadow} ${theme.colors.shadow};
					box-sizing: ${theme.border.boxSizing};
				}

				&-label {
					font-size: ${theme.font.sizeSmall};
					line-height: ${theme.font.lineHeightSmall};
					color: ${theme.colors.label};
				}

				&-text {
					all: ${theme.textinput.inputText.styleReset};
					width: ${theme.textinput.inputText.widthWithoutIcon};
					overflow: ${theme.textinput.inputText.overflow};
					&::placeholder {
						color: ${theme.colors.black};
					}
				}

				&-eyeIcon {
					display: none;
					position: ${theme.textinput.eyeIcon.position};
					right: ${theme.textinput.eyeIcon.right};

					svg {
						height: ${theme.textinput.eyeIcon.height};
						width: ${theme.textinput.eyeIcon.width};

						path {
							fill: ${theme.colors.default}
						}
					}
				}
			}
		}

		&.default {
			.textInput--input {
				&-label {
					display: none;
				}

				&-container {
					border-color: ${theme.colors.default};
				}

				&-text::placeholder {
					color: ${theme.colors.default};
				}
			}
		}

		&.selected {
			.textInput--input-container {
				border: ${theme.border.styleBold} ${theme.colors.black};
			}
		}

		&.activated {
			.textInput--input-container {
				border: ${theme.border.style} ${theme.colors.black};
			}
		}

		&.success {
			.textInput {
				&--helperText {
					display: block;
					color: ${theme.colors.success};
				}

				&--input-container {
					border: ${theme.border.styleBold} ${theme.colors.success};
				}
			}
		}

		&.warning {
			.textInput {
				&--helperText {
					display: block;
					color: ${theme.colors.warning};
				}

				&--input-container {
					border: ${theme.border.styleBold} ${theme.colors.warning};
				}
			}
		}

		&.error {
			.textInput {
				&--helperText {
					display: block;
					color: ${theme.colors.error};
				}

				&--input-container {
					border: ${theme.border.styleBold} ${theme.colors.error};
				}
			}
		}

		&.disabled {
			.textInput--input {
				&-eyeIcon {
					svg {
						path {
							fill: ${theme.colors.black}
						}
					}
				}

				&-container {
					border-color: ${theme.colors.disabled};
					box-shadow: none;

					input::placeholder {
						color: ${theme.colors.disabled};
					}
				}

				&-label {
					display: none;
				}
			}
		}

		&.withIcon {
			.textInput {
				&--input-eyeIcon {
					display: block;
				}

				&--input-text {
					width: ${theme.textinput.inputText.widthWithIcon};
				}
				
				&--lockIcon {
					display: inline;
				}
			
				&--helperText {
					margin: ${theme.textinput.helperText.marginWithIcon};
				}
			}
		}
	`}
`;

StyledTextinput.defaultProps = {
	theme: {
		colors: {
			default: '#00000066',
			success: '#4FCC5C',
			warning: '#FF9F00',
			error: '#FF0000',
			disabled: '#00000033',
			black: '#000000DE',
			shadow: '#0000001A',
			label: '#00000099'
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
			styleBold: '2px solid',
			boxShadow: 'inset 0px 2px 0px 1px',
			boxSizing: 'border-box'
		},

		textinput: {
			height: '48px',
			width: '197px',
			padding: '0px 12px 0px 16px',

			lockIcon: {
				margin: '0 12px 0 0',
				height: '21px',
				width: '16px'
			},

			eyeIcon: {
				position: 'absolute',
				right: '12.83px',
				height: '12.5px',
				width: '18.33px'
			},

			helperText: {
				marginWithoutIcon: '0 0 0 19px',
				marginWithIcon: '0 0 0 45px'
			},

			inputText: {
				styleReset: 'unset',
				widthWithoutIcon: '165px',
				widthWithIcon: '140px',
				overflow: 'hidden'
			}
		}
	}
};

export const Textinput = ({
	inputText,
	label,
	helperText,
	type = 'text',
	lockIcon,
	eyeIcon,
	variant = 'default',
	withIcon = true,
	className,
	...props
}: TextinputProps) => {
	const textInputRef = useRef(null);

	useEffect(() => {
		if (variant == 'disabled') {
			textInputRef.current.setAttribute('disabled', 'true');
			textInputRef.current.value = '';
		} else {
			textInputRef.current.removeAttribute('disabled');
		}
	}, [variant]);

	let switchPasswordVisibility = () => {
		if (type == 'password' && variant != 'disabled') {
			textInputRef.current.type == 'password'
				? (textInputRef.current.type = 'text')
				: (textInputRef.current.type = 'password');
		}
	};

	return (
		<StyledTextinput
			type="textinput"
			className={`${className} ${variant} ${withIcon && 'withIcon'} `}
			{...props}
		>
			<div className="textInput--container">
				<div className="textInput--lockIcon">
					{lockIcon && lockIcon}
				</div>

				<div className="textInput--input-container">
					<div>
						<div className="textInput--input-label">
							{label && label}
						</div>
						<input
							type={type && type}
							className="textInput--input-text"
							ref={textInputRef}
							placeholder={inputText && inputText}
						/>
					</div>
					<div
						className="textInput--input-eyeIcon"
						onClick={() => switchPasswordVisibility()}
					>
						{eyeIcon && eyeIcon}
					</div>
				</div>
			</div>

			<span className="textInput--helperText">
				{helperText && helperText}
			</span>
		</StyledTextinput>
	);
};
