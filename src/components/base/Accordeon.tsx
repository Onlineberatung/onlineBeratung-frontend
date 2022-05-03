import React, { HTMLAttributes, ReactElement } from 'react';
import styled from 'styled-components';

interface AccordeonProps extends HTMLAttributes<HTMLDivElement> {
	label?: string;
	icon?: ReactElement;
}

const StyledAccordeon = styled.div`
	${({ theme }) => `
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        font-family: ${theme.accordeon.fontFamily};
        font-weight: ${theme.accordeon.fontWeight};
        font-size: ${theme.accordeon.fontSize};
        line-height: ${theme.accordeon.lineHeight};
        color: ${theme.colors.darkGrey};
        border-bottom: ${theme.accordeon.borderBottom} ${theme.colors.lightGrey};
        width: ${theme.accordeon.width};

        &:hover {
            color: ${theme.colors.hover};
    
            .arrow path {
                fill: ${theme.colors.hover};
            }
        }

        .label {
            padding-bottom: ${theme.accordeon.paddingBottom};
        }

        .icon--container {
            display: flex;
            justify-content: flex-end;
        }

        .checkmark--circle {
            height: 20px;
            width: 20px;
            margin: 0 16px 0 0;
            path { 
                fill: ${theme.colors.green}; 
            }
        }

        .arrow {
            height: 20px;
            width: 20px;
            path {
                fill: ${theme.colors.darkGrey};
            }
        }

        .accordeon--content {
            background: ${theme.colors.backgroundGrey};
            width: 100%;
            height: 81px;
            margin: -6px 0 16px 0;
        }

        .inactive {
            display: none;
        }

        .active {
            display: block;
        }
	`}
`;

StyledAccordeon.defaultProps = {
	theme: {
		colors: {
			darkGrey: '#000000DE',
			lightGrey: '#00000033',
			backgroundGrey: '#C4C4C433',
			hover: '#A31816',
			green: '#4FCC5C'
		},
		accordeon: {
			fontFamily: 'Roboto, sans-serif',
			fontWeight: '700',
			fontSize: '16px',
			lineHeight: '131%',
			borderBottom: '1px solid',
			width: '500px',
			paddingBottom: '16px'
		}
	}
};

export const Accordeon = ({
	label,
	icon,
	className,
	...props
}: AccordeonProps) => {
	const expandAccordeon = () => {
		let accordeonContent =
			document.getElementsByClassName('accordeon--content')[0];
		let arrowUp = document.getElementById('arrow-up');
		let arrowDown = document.getElementById('arrow-down');

		if (accordeonContent.classList.contains('inactive')) {
			arrowDown.style.display = 'none';
			arrowUp.style.display = 'inline';
			accordeonContent.classList.remove('inactive');
			accordeonContent.classList.add('active');
		} else {
			arrowDown.style.display = 'inline';
			arrowUp.style.display = 'none';
			accordeonContent.classList.remove('active');
			accordeonContent.classList.add('inactive');
		}
	};

	return (
		<StyledAccordeon
			type="accordeon"
			className={`${className}`}
			onClick={expandAccordeon}
			{...props}
		>
			<span className="label">{label && label}</span>

			<div className="icon--container">
				{icon && icon}
				<svg
					id="arrow-down"
					className="arrow"
					width="20"
					height="12"
					viewBox="0 0 20 12"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M16.9351 0.52349L9.99105 7.46756L3.04698 0.52349C2.34899 -0.174497 1.22148 -0.174497 0.52349 0.52349C-0.174497 1.22148 -0.174497 2.34899 0.52349 3.04698L8.73826 11.2617C9.43624 11.9597 10.5638 11.9597 11.2617 11.2617L19.4765 3.04698C20.1745 2.34899 20.1745 1.22148 19.4765 0.52349C18.7785 -0.1566 17.6331 -0.174497 16.9351 0.52349Z"
						fill="black"
						fill-opacity="0.87"
					/>
				</svg>
				<svg
					id="arrow-up"
					className="arrow inactive"
					width="20"
					height="12"
					viewBox="0 0 20 12"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M8.73825 0.52349L0.52349 8.73825C-0.174497 9.43624 -0.174497 10.5638 0.52349 11.2617C1.22148 11.9597 2.34899 11.9597 3.04698 11.2617L10.0089 4.31767L16.953 11.2617C17.651 11.9597 18.7785 11.9597 19.4765 11.2617C20.1745 10.5638 20.1745 9.43624 19.4765 8.73825L11.2617 0.52349C10.5817 -0.174497 9.43624 -0.174497 8.73825 0.52349Z"
						fill="black"
						fill-opacity="0.87"
					/>
				</svg>
			</div>

			<div className="accordeon--content inactive"></div>
		</StyledAccordeon>
	);
};
