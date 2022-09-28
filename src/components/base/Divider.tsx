import React, { HTMLAttributes, useEffect, useRef } from 'react';
import styled from 'styled-components';

export const SIZE_PRIMARY = 'primary';
export const SIZE_SECONDARY = 'secondary';
export const SIZE_TERTIARY = 'tertiary';

export type SIZE =
	| typeof SIZE_PRIMARY
	| typeof SIZE_SECONDARY
	| typeof SIZE_TERTIARY;

interface DividerProps extends HTMLAttributes<HTMLDivElement> {
	size?: SIZE;
	label?: string;
}

const StyledDivider = styled.div`
	${({ theme }) => `
		font-family: ${theme.font.family_divider ?? 'Roboto Slab, serif'};
		font-style: normal;
		font-size: ${theme.font.size_secondary ?? '12px'};
		font-weight: ${theme.font.weight_medium ?? '500'};
		line-height: ${theme.font.line_height_secondary ?? '16px'};
		letter-spacing: 1.5px;
		text-transform: uppercase;
	
		display: flex;
		align-items: center;
		
		color: ${theme.color.text_emphasisLow && '#000000A6'}; 
        
        &:before,
        &:after {
            content: '';
		    text-align: center;
            border-top: ${theme.border.style && '1px solid'};
            height: 0px;
            width: 220px;
			border-color: ${theme.color.outline && '#00000033'};
        }

        &.tertiary {
            color: ${theme.color.interactive_primary && '#CC1E1C'};
        	&:before,
            &:after {
                border-color: ${theme.color.interactive_primary && '#CC1E1C'};
            }
        }

		.spacer {
			margin: 0 12px 0 12px
		}
	`}
`;

export const Divider = ({
	size = SIZE_PRIMARY,
	label,
	className,
	...props
}: DividerProps) => {
	const labelRef = useRef(null);

	useEffect(() => {
		labelRef.current.innerHTML.length > 0
			? labelRef.current.classList.add('spacer')
			: labelRef.current.classList.remove('spacer');
	}, [label]);

	useEffect(() => {
		if (size != SIZE_PRIMARY) {
			labelRef.current.innerHTML = 'Label';
			labelRef.current.classList.add('spacer');
		} else {
			labelRef.current.innerHTML = '';
			labelRef.current.classList.remove('spacer');
		}
	}, [size]);

	return (
		<StyledDivider
			type="divider"
			className={`${className} ${size}`}
			{...props}
		>
			<link rel="preconnect" href="https://fonts.googleapis.com"></link>
			<link rel="preconnect" href="https://fonts.gstatic.com"></link>
			<link
				href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@500&display=swap"
				rel="stylesheet"
			></link>

			<span className="label" ref={labelRef}>
				{label && label}
			</span>
		</StyledDivider>
	);
};
