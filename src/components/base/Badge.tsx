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
		font-family: ${theme.font.family};
		font-weight: ${theme.font.weight};
		font-size: ${theme.font.size};
		line-height: ${theme.font.lineHeight};

		border: ${theme.border.style};
		border-radius: ${theme.border.radius};

		padding: ${theme.badge.padding};
		
		&.active {
			color: ${theme.colors.white};
			background-color: ${theme.colors.active};
		}

		&.feedback {
			color: ${theme.colors.black};
			background-color: ${theme.colors.feedback};
		}

		&.banned {
			color: ${theme.colors.white};
			background-color: ${theme.colors.banned};
		}
	`}
`;

StyledBadge.defaultProps = {
	theme: {
		colors: {
			white: '#FFFFFF',
			black: '#000000DE',
			banned: '#FF0000',
			feedback: '#FFDCA3',
			active: ' #4FCC5C'
		},

		font: {
			family: 'Roboto, sans-serif',
			weight: '400',
			size: '12px',
			lineHeight: '16px'
		},

		border: {
			radius: '30px',
			style: 'none'
		},

		badge: {
			padding: '0px 8px'
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
