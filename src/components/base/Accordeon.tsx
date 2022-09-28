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
		font-family: ${theme.font.family_sans_serif ?? 'Roboto, sans-serif'};
		font-weight: ${theme.font.weight_bold ?? '700'};
		font-size: ${theme.font.size_primary ?? '16px'};
		line-height: ${theme.font.line_height_quinary ?? '28px'};
		
        color: ${theme.color.interactive_secondary ?? '#000000E5'};
		
        border-bottom: 1px solid ${theme.color.outline ?? '#00000033'};

		display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
		
        width: 500px;

        &:hover {
            color: ${theme.color.interactive_hover ?? '#A31816'};
    
            .arrow path {
                fill: ${theme.color.interactive_hover ?? '#A31816'};
            }
        }

        .label {
            padding: 0 0 ${theme.grid.base_two ?? '16px'} 0;
        }

        .icon--container {
            display: flex;
            justify-content: flex-end;
        }

        .checkmark--circle {
            height: 20px;
            width: 20px;
            margin: 0 ${theme.grid.base_two ?? '16px'} 0 0;
            path { 
                fill: ${theme.color.status_success_foreground ?? '#4FCC5C'}; 
            }
        }

        .arrow {
            height: 20px;
            width: 20px;
            path {
                fill: ${theme.color.interactive_secondary ?? '#000000E5'};
            }

			&--up {
				display: none;
			}
        }

        .accordeon--content {
			display: none;
            background: ${theme.color.status_success_background ?? '#4FCC5C4D'};
            width: 100%;
            height: 81px;
            margin: -6px 0 ${theme.grid.base_two ?? '16px'} 0;
        }
	`}
`;

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
