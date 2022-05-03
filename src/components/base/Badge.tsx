import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

export const VARIANT_ACTIVE = 'active';
export const VARIANT_FEEDBACK = 'feedback';
export const VARIANT_BANNED = 'banned';

export type VARIANTS =
	| typeof VARIANT_ACTIVE
	| typeof VARIANT_FEEDBACK
	| typeof VARIANT_BANNED;

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
	variant?: VARIANTS;
	label?: string;
}

const StyledBadge = styled.span`
	${({ theme }) => `
		font-family: ${theme.badge.fontFamily};
		font-weight: ${theme.badge.fontWeight};
		font-size: ${theme.badge.fontSize};
		line-height: ${theme.badge.lineHeight};
		padding: ${theme.badge.padding};
		border: ${theme.badge.border.style};
		border-radius: ${theme.badge.border.radius};
		
		&.active {
			color: ${theme.colors.white};
			background-color: ${theme.colors.backgroundActive};
		}

		&.feedback {
			color: ${theme.colors.feedback};
			background-color: ${theme.colors.backgroundFeedback};
		}

		&.banned {
			color: ${theme.colors.white};
			background-color: ${theme.colors.backgroundBanned};
		}
	`}
`;

StyledBadge.defaultProps = {
	theme: {
		colors: {
			white: '#FFFFFF',
			feedback: '#000000DE',
			backgroundBanned: '#FF0000',
			backgroundFeedback: '#FFDCA3',
			backgroundActive: ' #4FCC5C'
		},
		badge: {
			fontFamily: 'Roboto, sans-serif',
			fontWeight: '400',
			fontSize: '12px',
			lineHeight: '16px',
			padding: '0px 8px',

			border: {
				radius: '30px',
				style: 'none'
			}
		}
	}
};

export const Badge = ({
	variant = VARIANT_ACTIVE,
	label,
	className,
	...props
}: BadgeProps) => {
	return (
		<StyledBadge
			type="badge"
			className={`${className} ${variant}`}
			{...props}
		>
			{label && label}
		</StyledBadge>
	);
};
