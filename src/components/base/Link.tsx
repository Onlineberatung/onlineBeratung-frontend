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
	focusState?: boolean;
}

const StyledLink = styled.a`
	${({ theme }) => `
	font-family: ${theme.font.family_sans_serif ?? 'Roboto, sans-serif'};
    font-size: ${theme.font.size_primary ?? '16px'};
    font-weight: ${theme.font.weight_regular ?? '400'};
    line-height: ${theme.font.line_height_primary ?? '21px'};
	text-decoration-line: 'underline';

	color: ${theme.color.interactive_primary ?? '#CC1E1C'};
	
	&:hover {
		color: ${theme.color.interactive_hover ?? '#A31816'};
		.icon {
			svg {
				path {
					fill: ${theme.color.interactive_hover ?? '#A31816'};
				}
			}
		}
	}

	&:focus {
		padding: 2px;
		outline: 2px solid #199FFF;
		outline-offset: 4px;
	}

	&:focus:not(:focus-visible) {
		outline: none;
	}

	&.focus {
		padding: 2px;
		outline: 2px solid #199FFF;
		outline-offset: 4px;
	}

	.icon {
		position: relative;
		top: 2px;
		margin: 0 4px 0 0;

		svg {
			height: 13.5px;
			width: 13.5px;
			path {
				fill: ${theme.color.interactive_primary ?? '#CC1E1C'};
			}
		}
	}

	&.small {
		font-size: ${theme.font.size_tertiary ?? '14px'};

		.icon {
			top: 3px;
		}
	}
	`}
`;

export const Link = ({
	size = SIZE_LARGE,
	label,
	focusState,
	className,
	reference,
	icon,
	...props
}: LinkProps) => {
	return (
		<StyledLink
			type="link"
			href={reference}
			className={`${className} ${size} ${focusState && 'focus'}`}
			{...props}
		>
			<span className="icon">{icon && icon}</span>
			{label && label}
		</StyledLink>
	);
};
