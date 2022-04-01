import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

export const SIZE_ACTIVE = 'active';
export const SIZE_FEEDBACK = 'feedback';
export const SIZE_BANNED = 'banned';

export type SIZES =
	| typeof SIZE_ACTIVE
	| typeof SIZE_FEEDBACK
	| typeof SIZE_BANNED;

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
	size?: SIZES;
	label?: string;
}

const StyledBadge = styled.span`
	${({ theme }) => `
		border: ${theme.badge.border.style};
		border-radius: ${theme.badge.border.radius};
		font-family: ${theme.font.primary};
		font-weight: ${theme.badge.fontWeight};
		font-size: ${theme.badge.fontSize};
		line-height: ${theme.badge.lineHeight};
		padding: ${theme.badge.padding};
		
		&.active {
			color: ${theme.colors.white};
			background-color: ${theme.colors.green};
		}

		&.feedback {
			color: ${theme.colors.black};
			background-color: ${theme.colors.yellow};
		}

		&.banned {
			color: ${theme.colors.white};
			background-color: ${theme.colors.red};
		}
	`}
`;

// We are passing a default theme for Buttons that arent wrapped in the ThemeProvider
StyledBadge.defaultProps = {
	theme: {
		colors: {
			white: '#FFFFFF',
			black: 'rgba(0, 0, 0, 0.8)',
			red: '#FF0000',
			yellow: '#FFDCA3',
			green: ' #4FCC5C'
		},
		font: {
			primary: 'Roboto, sans-serif'
		},
		badge: {
			border: {
				radius: '30px',
				style: 'none'
			},
			fontWeight: '400',
			fontSize: '12px',
			lineHeight: '16px',
			padding: '0px 8px'
		}
	}
};

/**
 * Primary UI component for user interaction
 */
export const Badge = ({
	size = SIZE_ACTIVE,
	label,
	className,
	...props
}: BadgeProps) => {
	return (
		<StyledBadge type="badge" className={`${className} ${size}`} {...props}>
			{label && label}
		</StyledBadge>
	);
};
