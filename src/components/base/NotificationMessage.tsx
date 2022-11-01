import React, { HTMLAttributes, ReactElement } from 'react';
import styled from 'styled-components';

interface NotificationMessageProps extends HTMLAttributes<HTMLDivElement> {
	letterIcon?: ReactElement;
	userName?: string;
	closeIcon?: ReactElement;
	messageText?: string;
	sendIcon?: ReactElement;
	smileyIcon?: ReactElement;
	label?: string;
}

const StyledNotificationMessage = styled.div`
	${({ theme }) => `
    display: flex;
    flex-direction: column;
    position: relative;

    width: 400px;
    padding: 19px 16px 24px 16px;
    border-radius: ${theme.border.radius ?? '4px'};
    
    background: #00000099;
    color: ${theme.color.text_onDark ?? '#FFFFFF'};
   
    font-family: ${theme.font.family_sans_serif ?? 'Roboto, sans-serif'};
    font-weight: ${theme.font.weight_regular ?? '400'};
    font-size: ${theme.font.size_primary ?? '16px'};
    line-height: ${theme.font.line_height_primary ?? '21px'};

    svg {
        path {
            fill: ${theme.color.interactive_onDark ?? '#FFFFFF'};
        }
    }

    .notification--header {
        display: flex;
        align-items: center;
        font-weight: 600;
        line-height: ${theme.font.line_height_primary ?? '21px'};
        margin: 0 0 17.5px 0;

        svg {
            margin: 0 9px 0 0;
            width: 24px;
            height: 24px;
        }
    }

    .notification--closeIcon {
        position: absolute;
        top: 21px;
        right: 21px;

        svg {
            path: {
                width: 13.18px;
                height: 13.18px;

            }
        }
    }

    .notification--message {
        display: flex;
        position: relative;
        margin: 24px 0 0 0;
        font-size: ${theme.font.line_height_primary ?? '21px'};

        &-textfield {
            display: flex;
			font-size: ${theme.font.size_primary ?? '16px'};
            background: ${theme.color.interactive_onDark ?? '#FFFFFF'};
            color: ${theme.color.text_placeholder ?? '#00000066'};
            width: 308px;
            border: ${theme.border.style ?? '1px solid'} #DCD9DC;
            border-radius: ${theme.border.radius ?? '4px'};
            padding: 13px 14px 13px 12px;

            svg {
                height: 20px;
                width: 20px;
               
                path {
                    fill: ${theme.color.interactive_tertiary ?? '#000000A6'};
                }
            }
			
            &-text {
				all: unset;
				position: absolute;
				left: 56px;
				overflow: hidden;
				color: ${theme.color.text_emphasisHigh ?? '#000000E5'};
                max-width: 265px;
				width: 265px;
				&::placeholder {
					color: ${theme.color.text_placeholder ?? '#00000066'};
				}
            }
        }

        &-sendIcon {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 48px;
            width: 48px;
            background: ${theme.color.interactive_primary ?? '#CC1E1C'};
            border-radius: 50%;
            margin: 0 0 0 12px;

            svg {
                height: 24px;
                width: 24px;
                path {

                }
            }
        }

        &-seperator {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 0;
            border-left: ${theme.border.style_bold ?? '2px solid'} ${
		theme.color.outline ?? '#00000033'
	};
            left: 45px;
            margin: 0 7px 0 0;
        }
    }
	`}
`;

export const NotificationMessage = ({
	letterIcon,
	userName,
	closeIcon,
	messageText,
	sendIcon,
	smileyIcon,
	label,
	className,
	...props
}: NotificationMessageProps) => {
	return (
		<StyledNotificationMessage
			type="notification"
			className={`${className} `}
			{...props}
		>
			<div className="notification--header">
				{letterIcon && letterIcon}
				Neue Nachricht von Nutzer {userName && userName}
			</div>

			<div className="notification--closeIcon">
				{closeIcon && closeIcon}
			</div>

			{messageText && messageText}

			<div className="notification--message">
				<div className="notification--message-textfield">
					{smileyIcon && smileyIcon}
					<div className="notification--message-seperator"></div>
					<input
						className="notification--message-textfield-text"
						placeholder={label && label}
					/>
				</div>
				<div className="notification--message-sendIcon">
					{sendIcon && sendIcon}
				</div>
			</div>
		</StyledNotificationMessage>
	);
};
