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
		font-family: ${theme.font.family_sans_serif ?? 'Roboto, sans-serif'};
		font-weight: ${theme.font.weight_regular ?? '400'} ;
		font-size: ${theme.font.size_secondary ?? '12px'};
		line-height: ${theme.font.line_height_secondary ?? '16px'};

		border: none;
		border-radius: 30px;

		padding: 2px ${theme.grid.base ?? '8px'};
		
		&.active {
			color: ${theme.color.interactive_secondary ?? '#000000E5'};
			background-color: ${theme.color.status_success_foreground ?? '#4FCC5C'};
		}

		&.feedback {
			color: ${theme.color.interactive_secondary ?? '#000000E5'};
			background-color: ${theme.color.background_feedback4 ?? '#FFDCA3'};

		}

		&.banned {
			color: ${theme.color.interactive_onDark ?? '#FFFFFF'};
			background-color: ${theme.color.status_error_foreground ?? '#FF0000'};
		}
	`}
`;

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
