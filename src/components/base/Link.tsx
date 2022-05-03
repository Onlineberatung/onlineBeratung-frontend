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
	color: ${theme.colors.primary};
	text-decoration-line: ${theme.link.textDecoration};
	font-family: ${theme.link.fontFamily};
    font-size: ${theme.link.fontSize};
    font-weight: ${theme.link.fontWeight};
    line-height: ${theme.link.lineHeight};

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
		font-size: ${theme.link.fontSizeSmall};

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
		link: {
			fontFamily: 'Roboto, sans-serif',
			fontSize: '16px',
			fontSizeSmall: '14px',
			fontWeight: '400',
			lineHeight: '150%x',
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
