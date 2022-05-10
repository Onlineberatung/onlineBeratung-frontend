import React, {
	HTMLAttributes,
	ReactElement,
	useEffect,
	useRef,
	useState
} from 'react';
import styled from 'styled-components';

interface AccordeonProps extends HTMLAttributes<HTMLDivElement> {
	label?: string;
	iconCheckmark?: ReactElement;
	iconDown?: ReactElement;
	iconUp?: ReactElement;
	withIcon?: boolean;
}

const StyledAccordeon = styled.div`
	${({ theme }) => `
		font-family: ${theme.font.family};
		font-weight: ${theme.font.weight};
		font-size: ${theme.font.size};
		line-height: ${theme.font.lineHeight};
		
        color: ${theme.colors.darkGrey};

        border-bottom: ${theme.border.style} ${theme.colors.lightGrey};
		
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
		
        width: ${theme.accordeon.width};

        &:hover {
            color: ${theme.colors.hover};
    
            .arrow path {
                fill: ${theme.colors.hover};
            }
        }

        .label {
            padding: ${theme.accordeon.padding};
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

			&--up {
				display: none;
			}
        }

        .accordeon--content {
			display: none;
            background: ${theme.colors.backgroundGrey};
            width: 100%;
            height: 81px;
            margin: -6px 0 16px 0;
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

		font: {
			family: 'Roboto, sans-serif',
			weight: '700',
			size: '16px',
			lineHeight: '131%'
		},

		border: {
			style: '1px solid'
		},

		accordeon: {
			width: '500px',
			padding: '0 0 16px 0'
		}
	}
};

export const Accordeon = ({
	label,
	iconCheckmark,
	iconDown,
	iconUp,
	withIcon = false,
	className,
	...props
}: AccordeonProps) => {
	const arrowUpRef = useRef(null);
	const arrowDownRef = useRef(null);
	const accordeonContentRef = useRef(null);
	const iconRef = useRef(null);

	const [isExpanded, setIsExpanded] = useState(false);

	const expandAccordeon = () => {
		if (isExpanded == false) {
			arrowDownRef.current.style.display = 'none';
			arrowUpRef.current.style.display = 'block';
			accordeonContentRef.current.style.display = 'block';
		} else {
			arrowDownRef.current.style.display = 'inline';
			arrowUpRef.current.style.display = 'none';
			accordeonContentRef.current.style.display = 'none';
		}
		setIsExpanded(!isExpanded);
	};

	useEffect(() => {
		let visibility;
		withIcon ? (visibility = 'block') : (visibility = 'none');
		iconRef.current.style.display = visibility;
	}, [withIcon]);

	return (
		<StyledAccordeon
			type="accordeon"
			className={`${className} ${withIcon && 'withIcon'}`}
			onClick={expandAccordeon}
			{...props}
		>
			<span className="label">{label && label}</span>

			<div className="icon--container">
				<span ref={iconRef}>{iconCheckmark && iconCheckmark}</span>
				<span className="arrow arrow--down" ref={arrowDownRef}>
					{iconDown && iconDown}
				</span>
				<span className="arrow arrow--up" ref={arrowUpRef}>
					{iconUp && iconUp}
				</span>
			</div>

			<div className="accordeon--content" ref={accordeonContentRef}></div>
		</StyledAccordeon>
	);
};
