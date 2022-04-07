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

	svg {
		height: 16px;
		width: 16px;
		path {
			fill: ${theme.colors.primary};
		}
	}

	span {
		position: relative;
		top: 2px;
		margin: 0 4px 0 0;
	}

	&:hover {
		color: ${theme.colors.hover};

		svg {
			fill: ${theme.colors.hover}
		}
	}

	&.small {
		font-size: ${theme.link.fontSizeSmall};

		span {
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
			lineHeight: '24px',
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
			<span>{icon && icon}</span>
			{label && label}
		</StyledLink>
	);
};
