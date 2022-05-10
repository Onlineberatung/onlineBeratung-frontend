import React, { HTMLAttributes, useEffect, useRef } from 'react';
import styled from 'styled-components';

export const STATUS_DEFAULT = 'default';
export const STATUS_ACTIVE = 'active';
export const STATUS_ERROR = 'error';

export type STATUS =
	| typeof STATUS_DEFAULT
	| typeof STATUS_ACTIVE
	| typeof STATUS_ERROR;

interface ReadOnlyProps extends HTMLAttributes<HTMLDivElement> {
	status?: STATUS;
	title?: string;
	text?: string;
	helperText?: string;
}

const StyledReadOnly = styled.div`
	${({ theme }) => `
		font-family: ${theme.font.family};
		font-weight: ${theme.font.weight};

		position: relative;
		width: ${theme.readOnly.width};
		border-bottom: ${theme.border.style} ${theme.colors.underline};

		.readOnly {
			&--inputField {
				all: unset;
				font-size: ${theme.font.size};
				line-height: ${theme.font.lineHeight};
				margin: ${theme.readOnly.margin};
				width: ${theme.readOnly.width};
				color: ${theme.colors.black};

				&::placeholder {
					color: ${theme.colors.black};
				}
			}

			&--title {
				font-size: ${theme.font.sizeSmall};
				line-height: ${theme.font.lineHeightSmall};
				color: ${theme.colors.title};
			}

			&--helperText {
				display: none;
				position: ${theme.readOnly.helperText.position};
				top: ${theme.readOnly.helperText.top};
	
				font-size: ${theme.font.sizeSmall};
				line-height: ${theme.font.lineHeightSmall};
				color: ${theme.colors.error};
			}
		}

		&.default {
			.readOnly--inputField {
				color: ${theme.colors.default};
				
				&::placeholder {
					color: ${theme.colors.default};
				}
			}
		}

		&.active {
			:hover {
				border-bottom: ${theme.border.style} ${theme.colors.black};
			}

			&:focus-within {
				border-bottom: ${theme.border.styleBold} ${theme.colors.black};
			}
		}

		&.error {
			border-bottom: ${theme.border.styleBold} ${theme.colors.error};

			.readOnly--helperText {
				display: block;
			}
		}
	`}
`;

StyledReadOnly.defaultProps = {
	theme: {
		colors: {
			black: '#000000DE',
			default: '#00000066',
			underline: '#00000033',
			error: '#FF0000',
			title: '#00000099'
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
			styleBold: '2px solid'
		},

		readOnly: {
			width: '294px',
			margin: '4px 0 4px 0',

			helperText: {
				position: 'absolute',
				top: '53px'
			}
		}
	}
};

export const ReadOnly = ({
	status = STATUS_DEFAULT,
	title,
	text,
	helperText,
	className,
	...props
}: ReadOnlyProps) => {
	let inputRef = useRef(null);

	useEffect(() => {
		status == 'default'
			? (inputRef.current.disabled = true)
			: (inputRef.current.disabled = false);
	}, [status]);

	return (
		<StyledReadOnly
			type="readOnly"
			className={`${className} ${status && status}`}
			{...props}
		>
			<div className="readOnly--title">{title && title}</div>
			<input
				type="text"
				className="readOnly--inputField"
				ref={inputRef}
				placeholder={text && text}
			/>
			<div className="readOnly--helperText">
				{helperText && helperText}
			</div>
		</StyledReadOnly>
	);
};
