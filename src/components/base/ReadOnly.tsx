import React, { HTMLAttributes, useEffect, useRef } from 'react';
import styled from 'styled-components';

export const STATUS_DEFAULT = 'default';
export const STATUS_DISABLED = 'disabled';
export const STATUS_ERROR = 'error';

export type STATUS =
	| typeof STATUS_DEFAULT
	| typeof STATUS_DISABLED
	| typeof STATUS_ERROR;

interface ReadOnlyProps extends HTMLAttributes<HTMLDivElement> {
	status?: STATUS;
	label?: string;
	text?: string;
	helperText?: string;
}

const StyledReadOnly = styled.div`
	${({ theme }) => `
		font-family: ${theme.font.family_sans_serif ?? 'Roboto, sans-serif'};
		font-weight: ${theme.font.weight_regular ?? '400'};

		position: relative;
		width: 294px;

		.readOnly {
			&--inputField {
				all: unset;
				font-size: ${theme.font.size_primary ?? '16px'};
				line-height: ${theme.font.line_height_senary ?? '24px'};
				padding: 4px 0 4px 0;
				width: 294px;
				color: ${theme.color.text_emphasisHigh ?? '#000000E5'};
				border-bottom: ${theme.border.style ?? '1px solid'} ${
		theme.color.outline ?? '#00000033'
	};

				&::placeholder {
					color: ${theme.color.text_emphasisHigh ?? '#000000E5'};
				}

				&:focus {
					border-bottom: ${theme.border.style_bold ?? '2px solid'} ${
		theme.color.interactive_secondary ?? '#000000E5'
	};

					:hover {
						border-bottom: ${theme.border.style_bold ?? '2px solid'} ${
		theme.color.interactive_secondary ?? '#000000E5'
	};
					}
				}

				:hover {
					border-bottom: ${theme.border.style ?? '1px solid'} ${
		theme.color.interactive_secondary ?? '#000000E5'
	};
				}
			}

			&--label {
				font-size: ${theme.font.size_secondary ?? '12px'};
				line-height: ${theme.font.line_height_secondary ?? '16px'};
				color: ${theme.color.text_emphasisLow ?? '#000000A6'};
			}

			&--helperText {
				display: none;
				position: absolute;
				top: 53px;
	
				font-size: ${theme.font.size_secondary ?? '12px'};
				line-height: ${theme.font.line_height_secondary ?? '16px'};
				color: ${theme.color.status_error_foreground ?? '#FF0000'};
			}
		}

		&.disabled {
			.readOnly {
				&--inputField {	
					&::placeholder {
						color: ${theme.color.text_placeholder ?? '#00000066'};
					}
	
					:hover {
						border-bottom: ${theme.border.style ?? '1px solid'} ${
		theme.color.outline ?? '#00000033'
	};
					}
				}

				&--label {
					color: ${theme.color.text_disabled ?? '#00000066'};
				}
			}
		}

		&.error {
			.readOnly {
				&--inputField {	
					&::placeholder {
						color: ${theme.color.text_emphasisHigh ?? '#000000E5'};
					}

					&:focus {
						border-bottom: ${theme.border.style_bold ?? '2px solid'} ${
		theme.color.status_error_foreground ?? '#FF0000'
	};
	
						:hover {
							border-bottom: ${theme.border.style_bold ?? '2px solid'} ${
		theme.color.status_error_foreground ?? '#FF0000'
	};
						}
					}
				}
			}

			.readOnly--helperText {
				display: block;
			}
		}
	`}
`;

export const ReadOnly = ({
	status = STATUS_DEFAULT,
	label,
	text,
	helperText,
	className,
	...props
}: ReadOnlyProps) => {
	const readOnlyRef = useRef(null);

	useEffect(() => {
		status == 'disabled'
			? readOnlyRef.current.setAttribute('disabled', true)
			: readOnlyRef.current.removeAttribute('disabled');
	}, [status]);

	return (
		<StyledReadOnly
			type="readOnly"
			className={`${className} ${status && status}`}
			{...props}
		>
			<div className="readOnly--label">{label && label}</div>
			<input
				type="text"
				className="readOnly--inputField"
				placeholder={text && text}
				ref={readOnlyRef}
			/>
			<div className="readOnly--helperText">
				{helperText && helperText}
			</div>
		</StyledReadOnly>
	);
};
