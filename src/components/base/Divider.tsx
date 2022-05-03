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
        display: flex;
        align-items: center;
        
        font-family: ${theme.font.fontFamily};
        font-style: ${theme.font.fontStyle};
        font-size: ${theme.font.fontSize};
        font-weight: ${theme.font.fontWeight};
        line-height: ${theme.font.lineHeight};
        letter-spacing: ${theme.font.letterSpacing};
        text-transform: ${theme.font.textTransform};

		color: ${theme.colors.darkGrey};
        
        &:before,
        &:after {
            content: '';
		    text-align: center;
            border-top: ${theme.divider.border};
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
			margin: 0 ${theme.divider.margin} 0 ${theme.divider.margin}
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
			fontFamily: 'Roboto Slab, serif',
			fontStyle: 'normal',
			fontSize: '12px',
			fontWeight: '500',
			lineHeight: '16px',
			letterSpacing: '1.5px',
			textTransform: 'uppercase'
		},
		divider: {
			border: '1px solid',
			width: '220px',
			height: '0px',
			margin: '12px'
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
