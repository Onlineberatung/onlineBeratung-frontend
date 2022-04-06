import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

export const SIZE_DEFAULT = 'default';
export const SIZE_SELECTED = 'selected';
export const SIZE_REMOVEABLE = 'removeable';
export const SIZE_READONLY = 'readOnly';

export type SIZE =
	| typeof SIZE_DEFAULT
	| typeof SIZE_SELECTED
	| typeof SIZE_REMOVEABLE
	| typeof SIZE_READONLY;

interface FiltertagProps extends HTMLAttributes<HTMLDivElement> {
	size?: SIZE;
	label?: string;
	icon?: any; //TODO
}

const StyledFiltertag = styled.div`
	${({ theme }) => `
    display: flex;
    justify-content: ${theme.filtertag.justifyContent};
    align-items: ${theme.filtertag.alignItems};
    width: max-content;
    height: max-content;
    border-radius: ${theme.filtertag.border.radius};
    padding: ${theme.filtertag.padding};
    font-family: ${theme.filtertag.fontFamily};
    font-size: ${theme.filtertag.fontSize};
    font-weight: ${theme.filtertag.fontWeight};
    line-height: ${theme.filtertag.lineHeight};

    &.default {
        color: ${theme.colors.default};
        background-color: ${theme.colors.backgroundDefault};

        &:hover {
            color: ${theme.colors.defaultHover};
            background-color: ${theme.colors.backgroundDefaultHover};
            cursor: pointer;
        }
    }

    &.selected {
        color: ${theme.colors.removeable};
        background-color: ${theme.colors.backgroundRemoveable};
        border: 1px solid ${theme.colors.borderRemoveable}
    }

    &.removeable {
        color: ${theme.colors.removeable};
        background-color: ${theme.colors.backgroundRemoveable};
        border: 1px solid ${theme.colors.borderRemoveable};

        &:hover {
            color: ${theme.colors.removeableHover};
            background-color: ${theme.colors.backgroundRemoveable};
            border-color: ${theme.colors.borderRemoveableHover};
            cursor: pointer;

            svg {
                fill: ${theme.colors.removeableHover};
            }
        }
    }

    &.readOnly {
        color: ${theme.colors.readOnly};
        background-color: ${theme.colors.backgroundReadOnly};
        border: 1px solid ${theme.colors.borderReadOnly}
    }

    svg {
        fill: ${theme.colors.removeable};
        margin: 0px 0px 0px 8px;
    }
	`}
`;

StyledFiltertag.defaultProps = {
	theme: {
		colors: {
			primary: '#CC1E1C',
			backgroundDefault: '#00000014',
			backgroundRemoveable: '#CC1E1C33',
			backgroundReadOnly: '#FFFFFF',
			borderRemoveable: '#CC1E1C',
			borderReadOnly: '#00000033',
			default: '#00000099',
			removeable: '#CC1E1C',
			readOnly: '#000000DE',
			backgroundDefaultHover: '#00000033',
			borderRemoveableHover: '#A31816',
			removeableHover: '#A31816',
			defaultHover: '#000000DE'
		},
		filtertag: {
			fontFamily: 'Roboto, sans-serif',
			fontSize: '14px',
			fontWeight: '400',
			lineHeight: '20px',
			width: '106px',
			height: '32px',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			padding: '6px 12px',
			border: {
				radius: '24px'
			}
		}
	}
};

/**
 * Primary UI component for user interaction
 */
export const Filtertag = ({
	size = SIZE_DEFAULT,
	label,
	icon,
	className,
	...props
}: FiltertagProps) => {
	return (
		<StyledFiltertag
			type="filtertag"
			className={`${className} ${size}`}
			{...props}
		>
			{label && label} {icon && icon}
		</StyledFiltertag>
	);
};
