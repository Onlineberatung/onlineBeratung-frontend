import React, {
	HTMLAttributes,
	ReactElement,
	useEffect,
	useRef,
	useState
} from 'react';
import styled from 'styled-components';

export const VARIANT_DEFAULT = 'default';
export const VARIANT_ICON = 'icon';
export const VARIANT_REMOVEABLE = 'removeable';
export const VARIANT_READONLY = 'readOnly';

export type VARIANT =
	| typeof VARIANT_DEFAULT
	| typeof VARIANT_ICON
	| typeof VARIANT_REMOVEABLE
	| typeof VARIANT_READONLY;

interface FiltertagProps extends HTMLAttributes<HTMLDivElement> {
	variant?: VARIANT;
	label?: string;
	iconRemove?: ReactElement;
	iconPerson;
	withIcon?: boolean;
}

const StyledFiltertag = styled.div`
	${({ theme }) => `
    font-family: ${theme.font.family_sans_serif ?? 'Roboto, sans-serif'};
    font-size: ${theme.font.size_tertiary ?? '14px'};
    font-weight: ${theme.font.weight_regular ?? '400'};
    line-height: ${theme.font.line_height_primary ?? '21px'};

    display: flex;
    justify-content: center;
    align-items: center;

    width: max-content;
    height: 24px;

    border-radius: 4px;
    padding: 3px ${theme.grid.base ?? '8px'} 3px ${theme.grid.base ?? '8px'};

	.icon--person {
		height: 24px;
		width: 24px;
		margin-right: 4px;
		svg {
			margin-left: 0;
			height: 24px;
			width: 24px;
		}
	}

    &.default {
        color: ${theme.color.text_emphasisHigh ?? '#000000E5'}
        background-color: ${theme.color.text_onDark ?? '#FFFFFF'};
		border: 1px solid ${theme.color.outline ?? '#00000033'};

		.icon--person {
			svg {
				path {
					fill: ${theme.color.text_placeholder ?? '#00000066'};
				}
			}
		}

        &:hover {
            color: ${theme.color.interactive_secondary ?? '#000000E5'};
            background-color: ${theme.color.text_onDark ?? '#FFFFFF'};
            cursor: pointer;
			border: 1px solid ${theme.color.interactive_secondary ?? '#000000E5'};

			svg {				
				path {
					fill: ${theme.color.interactive_secondary ?? '#000000E5'};
				}
			}
        }
    }

    &.selected {
        color: ${theme.color.interactive_primary ?? '#CC1E1C'};
        background-color: ${theme.color.background_neutral1 ?? '#FAF6F3'};
        border: 1px solid ${theme.color.interactive_primary ?? '#CC1E1C'};

		.icon--person {
			svg {				
				path {
					fill: ${theme.color.interactive_primary ?? '#CC1E1C'};
				}
			}			
		}

        &:hover {
            color: ${theme.color.interactive_primary ?? '#CC1E1C'};
       	 	background-color: ${theme.color.background_neutral1 ?? '#FAF6F3'};
        	border: 1px solid ${theme.color.interactive_primary ?? '#CC1E1C'};
            cursor: pointer;
        }
    }

    &.removeable {
        color: ${theme.color.interactive_primary ?? '#CC1E1C'};
        background-color: ${theme.color.background_neutral1 ?? '#FAF6F3'};
        border: 1px solid ${theme.color.interactive_primary ?? '#CC1E1C'};

		.icon--person {
			height: 0px;
			width: 0px;
			margin-right: 0px;
		}

        &:hover {
            color: ${theme.color.interactive_hover ?? '#A31816'};
            background-color: ${theme.color.background_neutral1 ?? '#FAF6F3'};
            border-color: ${theme.color.interactive_hover ?? '#A31816'};
            cursor: pointer;

            svg {
				path {
					fill: ${theme.color.interactive_hover ?? '#A31816'};
				}
            }
        }
    }

    &.readOnly {
        color: ${theme.color.text_emphasisLow ?? '#000000A6'};
        background-color: #0000000D;  
        border: 1px solid ${theme.color.outline ?? '#00000033'};

		.icon--person {
			height: 0px;
			width: 0px;
			margin-right: 0px;
		}
    }

    svg {
		height: 16px;
		width: 16px;
		margin: 0px 0px 0px ${theme.grid.base ?? '8px'};
		path {
        	fill: ${theme.color.interactive_primary ?? '#CC1E1C'};
		}
    }
	`}
`;

export const Filtertag = ({
	variant = VARIANT_DEFAULT,
	label,
	iconRemove,
	iconPerson,
	withIcon = false,
	className,
	...props
}: FiltertagProps) => {
	const iconRef = useRef(null);
	const selectContainerRef = useRef(null);
	const [isSelected, setIsSelected] = useState(false);

	useEffect(() => {
		isSelected
			? selectContainerRef.current.classList.add('selected')
			: selectContainerRef.current.classList.remove('selected');
	}, [isSelected]);

	let handleClick = () => {
		if (selectContainerRef.current.classList.contains('default')) {
			setIsSelected(!isSelected);
		}
	};

	useEffect(() => {
		let visibility;
		withIcon ? (visibility = 'block') : (visibility = 'none');
		iconRef.current.style.display = visibility;

		setIsSelected(false);
	}, [withIcon]);

	return (
		<StyledFiltertag
			type="filtertag"
			className={`${className} ${variant} ${withIcon && 'withIcon'}`}
			{...props}
			ref={selectContainerRef}
			onClick={() => handleClick()}
		>
			<span ref={iconRef} className="icon--person">
				{iconPerson && iconPerson}
			</span>
			{label && label} {iconRemove && iconRemove}
		</StyledFiltertag>
	);
};
