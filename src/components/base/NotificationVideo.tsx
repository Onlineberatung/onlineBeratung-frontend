import React, { HTMLAttributes, ReactElement } from 'react';
import styled from 'styled-components';

export const TYPE_DEFAULT = 'default';
export const TYPE_EXTENDED = 'extended';

export type TYPE = typeof TYPE_DEFAULT | typeof TYPE_EXTENDED;

interface NotificationVideoProps extends HTMLAttributes<HTMLDivElement> {
	type?: TYPE;
	initialLetters?: string;
	userName?: string;
	text?: string;
	label?: string;
	infoText?: string;
	iconAccept?: ReactElement;
	iconVideo?: ReactElement;
	iconReject?: ReactElement;
	iconClose?: ReactElement;
}

const StyledNotificationVideo = styled.div`
	${({ theme }) => `
    font-family: ${theme.font.family_sans_serif ?? 'Roboto, sans-serif'};
    font-weight: ${theme.font.weight_regular ?? '400'};
    font-size: ${theme.font.size_tertiary ?? '14px'};
    line-height: ${theme.font.line_height_primary ?? '21px'};

    display: flex;
    flex-direction: column;
    align-items: center;

    position: relative;
    width: 320px;

    border-radius: ${theme.border.radius ?? '4px'};

    color: ${theme.color.interactive_onDark ?? '#FFFFFF'};
    background: #00000099;


    &.default {
        .notification--optionBar {
            height: 96px;
        }

        .notification--title {
            margin: 0 0 20px 0;
        }
    }

    &.extended {
        .notification--optionBar {
            height: 125px;
        }

        .notification--infoText {
            margin: ${theme.grid.base_two ?? '16px'} ${
		theme.grid.base_two ?? '16px'
	} ${theme.grid.base_two ?? '16px'} ${theme.grid.base_two ?? '16px'};
        }

        .notification--adviceLabel {
            margin: 0 0 ${theme.grid.base_two ?? '16px'} 0;
        }
    }

    .icon--close {
        position: absolute;
        top: 21px;
        right: 14px;
        align: right;

        svg {
            height: 16px;
            width: 16px;

            path {
                fill: ${theme.color.interactive_onDark ?? '#FFFFFF'};
            }
        }
    }

    .notification--userInitials {
        display: flex;
        justify-content: center;
        align-items: center;
        border: 10px solid ${
			theme.color.interactive_disabled_background ?? '#FFFFFF66'
		};
        border-radius: 50%;

        font-size: ${theme.font.size_subheadline ?? '20px'};
        line-height: ${theme.font.line_height_primary ?? '21px'};

        background-color: #3F373F;
        color: ${theme.color.interactive_onDark_hover ?? '#FFFFFF99'};;
        
        margin: 17px 0 20px 0 ;
        height: 56px;
        width: 56px;
    }

    .notification--title {
        font-weight: ${theme.font.weight_regular ?? '400'};
        font-size: ${theme.font.size_primary ?? '16px'};
        line-height: ${theme.font.line_height_primary ?? '21px'};

        &-userName {
            font-weight: ${theme.font.weight_bold ?? '700'};
        }
    }

    .notification--optionBar {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        background-color: ${theme.color.text_placeholder ?? '#00000066'};
        border-bottom-left-radius: ${theme.border.radius ?? '4px'};
        border-bottom-right-radius: ${theme.border.radius ?? '4px'};
    }

    .notification--adviceLabel {
        align-self: center;
        font-weight: ${theme.font.weight_bold ?? '700'};
    }

    .notification--phoneIcons {
        display: flex;
        justify-content: center;
        align-items: center;

        .icon {
            display:flex;
            justify-content: center;
            border-radius: 50%;
            background-color: ${
				theme.color.status_success_foreground ?? '#4FCC5C'
			};
            height: 48px;
            width: 48px;

            svg {
                height: 24px;
                width: 24px;
                align-self: center;
    
                path {
                    fill: ${theme.color.interactive_onDark ?? '#FFFFFF'};
                }
            }
        }
        
        .icon--reject {
            background-color: ${
				theme.color.status_error_foreground ?? '#FF0000'
			};
            svg {
                width: 32px;
            }
            }

        .icon--video {
            margin: 0 ${theme.grid.base_two ?? '16px'} 0 ${
		theme.grid.base_two ?? '16px'
	};
        }
    }
	`}
`;

export const NotificationVideo = ({
	type = TYPE_DEFAULT,
	initialLetters,
	userName,
	text,
	label,
	infoText,
	iconAccept,
	iconVideo,
	iconReject,
	iconClose,
	className,
	...props
}: NotificationVideoProps) => {
	return (
		<StyledNotificationVideo
			type="notification"
			className={`${className} ${type}`}
			{...props}
		>
			<div className="notification--icon icon--close">
				{iconClose && iconClose}
			</div>

			<div className="notification--userInitials">
				{initialLetters && initialLetters}
			</div>

			<div className="notification--title">
				<span className="notification--title-userName">
					{userName && userName} &nbsp;
				</span>
				{text && text}
			</div>

			<div className="notification--infoText">{infoText && infoText}</div>

			<div className="notification--optionBar">
				<div className="notification--adviceLabel">
					{label && label}
				</div>

				<div className="notification--phoneIcons">
					<div className="icon icon--accept">
						{iconAccept && iconAccept}
					</div>
					<div className="icon icon--video">
						{iconVideo && iconVideo}
					</div>
					<div className="icon icon--reject">
						{iconReject && iconReject}
					</div>
				</div>
			</div>
		</StyledNotificationVideo>
	);
};
