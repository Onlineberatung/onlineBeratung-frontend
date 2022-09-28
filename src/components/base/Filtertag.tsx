import React, { HTMLAttributes, ReactElement, useEffect, useRef } from 'react';
import styled from 'styled-components';

export const VARIANT_DEFAULT = 'default';
export const VARIANT_SELECTED = 'selected';
export const VARIANT_ICON = 'icon';
export const VARIANT_REMOVEABLE = 'removeable';
export const VARIANT_READONLY = 'readOnly';

export type VARIANT =
	| typeof VARIANT_DEFAULT
	| typeof VARIANT_SELECTED
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
    font-family: Roboto, sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;

    display: flex;
    justify-content: center;
    align-items: center;

    width: max-content;
    height: max-content;

    border-radius: 4px;
    padding: 6px 8px 6px 8px;

	.icon--person {
		width: 0px;
		height: 0px;
	}

    &.default {
        color: #000000E5;
        background-color: #FFFFF;
		border: 1px solid #00000033;

		.icon--person {
			height: 16px;
			width: 16px;
			margin-right: 4px;
			

			svg {
				margin-left: 0;
				
				path {
					fill: #00000066;
					height: 110%;
					width: 100%;
				}
			}
		}

        &:hover {
            color: #000000E5;
            background-color: #FFFFF;
            cursor: pointer;
			border: 1px solid #000000E5;
        }


    }

    &.selected {
        color: #CC1E1C;
        background-color: #FAF6F3;
        border: 1px solid #CC1E1C;
    }

    &.removeable {
        color: #CC1E1C;
        background-color: #FAF6F3;
        border: 1px solid #CC1E1C;

        &:hover {
            color: #A31816;
            background-color: #FAF6F3;
            border-color: #A31816;
            cursor: pointer;

            svg {
				path {
					fill: #A31816;;
				}
            }
        }
    }

    &.readOnly {
        color: #000000A6;
        background-color: #0000000D;
        border: 1px solid #00000033;
    }

    svg {
		height: 16px;
		width: 16px;
		margin: 0px 0px 0px 8px;
		path {
        	fill: #CC1E1C;
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

	useEffect(() => {
		let visibility;
		withIcon ? (visibility = 'block') : (visibility = 'none');
		iconRef.current.style.display = visibility;
	}, [withIcon]);

	return (
		<StyledFiltertag
			type="filtertag"
			className={`${className} ${variant} ${withIcon && 'withIcon'}`}
			{...props}
		>
			<span ref={iconRef} className="icon--person">
				{iconPerson && iconPerson}
			</span>
			{label && label} {iconRemove && iconRemove}
		</StyledFiltertag>
	);
};
