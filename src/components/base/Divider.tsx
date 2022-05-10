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
		font-family: ${theme.font.family};
		font-style: ${theme.font.style};
		font-size: ${theme.font.size};
		font-weight: ${theme.font.weight};
		line-height: ${theme.font.lineHeight};
		letter-spacing: ${theme.font.letterSpacing};
		text-transform: ${theme.font.textTransform};
	
		display: flex;
		align-items: center;
		
		color: ${theme.colors.darkGrey};
        
        &:before,
        &:after {
            content: '';
		    text-align: center;
            border-top: ${theme.border.style};
            height: ${theme.divider.height};
            width: ${theme.divider.width};
			border-color: ${theme.colors.lightGrey};
        }

        &.tertiary {
            color: ${theme.colors.primary};
        	&:before,
            &:after {
                border-color: ${theme.colors.primary};
            }
        }

		.spacer {
			margin: ${theme.divider.margin};
		}
	`}
`;

StyledDivider.defaultProps = {
	theme: {
		colors: {
			primary: '#CC1E1C',
			lightGrey: '#00000033',
			darkGrey: '#00000099'
		},

		font: {
			family: 'Roboto Slab, serif',
			style: 'normal',
			size: '12px',
			weight: '500',
			lineHeight: '16px',
			letterSpacing: '1.5px',
			textTransform: 'uppercase'
		},

		border: {
			style: '1px solid'
		},

		divider: {
			width: '220px',
			height: '0px',
			margin: '0 12px 0 12px'
		}
	}
};

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
