import React, { HTMLAttributes, ReactElement } from 'react';
import styled from 'styled-components';

export const SIZE_LARGE = 'large';
export const SIZE_SMALL = 'small';
export const SIZE_INLINE = 'inline';

export type SIZE = typeof SIZE_LARGE | typeof SIZE_SMALL | typeof SIZE_INLINE;

interface LinkProps extends HTMLAttributes<HTMLAnchorElement> {
	size?: SIZE;
	label?: string;
	reference?: string;
	icon?: ReactElement;
}

const StyledLink = styled.a`
	${({ theme }) => `
	font-family: ${theme.font.family};
    font-size: ${theme.font.size};
    font-weight: ${theme.font.weight};
    line-height: ${theme.font.lineHeight};
	text-decoration-line: ${theme.font.textDecoration};

	color: ${theme.colors.primary};
	

	&:hover {
		color: ${theme.colors.hover};
		.icon {
			svg {
				path {
					fill: ${theme.colors.hover}
				}
			}
		}
	}

	.icon {
		position: relative;
		top: 2px;
		margin: 0 4px 0 0;

		svg {
			height: 13.5px;
			width: 13.5px;
			path {
				fill: ${theme.colors.primary};
			}
		}
	}

	&.small {
		font-size: ${theme.font.sizeSmall};

		.icon {
			top:3px;
		}
	}
	`}
`;

StyledLink.defaultProps = {
	theme: {
		colors: {
			primary: '#CC1E1C',
			hover: '#A31816'
		},

		font: {
			family: 'Roboto, sans-serif',
			size: '16px',
			sizeSmall: '14px',
			weight: '400',
			lineHeight: '150%',
			textDecoration: 'underline'
		}
	}
};

export const Link = ({
	size = SIZE_LARGE,
	label,
	className,
	reference,
	icon,
	...props
}: LinkProps) => {
	return (
		<StyledLink
			type="link"
			href={reference}
			className={`${className} ${size}`}
			{...props}
		>
			<span className="icon">{icon && icon}</span>
			{label && label}
		</StyledLink>
	);
};
