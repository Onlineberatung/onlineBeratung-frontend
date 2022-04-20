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
    display: ${theme.notification.display};
    flex-direction: ${theme.notification.flexDirection};
    position: ${theme.notification.position};

    width: ${theme.notification.width};
    padding: ${theme.notification.padding};
    border-radius: ${theme.notification.border.radius};
    
    background: ${theme.colors.background};
    color: ${theme.colors.white};
   
    font-family: ${theme.notification.font.fontFamily};
    font-weight: ${theme.notification.font.fontWeight};
    font-size: ${theme.notification.font.fontSize};
    line-height: ${theme.notification.font.lineHeight};

    svg {
        path {
            fill: ${theme.colors.white};
        }
    }

    .notification--header {
        display: ${theme.notification.header.display};
        align-items: ${theme.notification.header.alignItems};
        font-weight: ${theme.notification.header.fontWeight};
        font-size: ${theme.notification.header.fontSize};
        line-height: ${theme.notification.header.lineHeight};
        margin: ${theme.notification.header.margin};

        svg {
            margin: ${theme.notification.header.svg.margin};
            width: ${theme.notification.header.svg.width};
            height: ${theme.notification.header.svg.height};
        }
    }

    .notification--closeIcon {
        position: ${theme.notification.closeIcon.position};
        top: ${theme.notification.closeIcon.top};
        right: ${theme.notification.closeIcon.right};

        svg {
            path: {
                width: ${theme.notification.closeIcon.svg.width};
                height: ${theme.notification.closeIcon.svg.height};

            }
        }
    }

    .notification--message {
        display: ${theme.notification.message.display};
        position: ${theme.notification.message.position};
        margin: ${theme.notification.message.margin};
        font-size: ${theme.notification.message.fontSize};

        &-textfield {
            display: ${theme.notification.message.textfield.display};
            background: ${theme.colors.white};
            color: ${theme.colors.lightGrey};
            width: ${theme.notification.message.textfield.width};
            border: ${theme.notification.message.textfield.border};
            border-radius: ${theme.notification.message.textfield.borderRadius};
            box-shadow: ${theme.notification.message.textfield.boxShadow};
            padding: ${theme.notification.message.textfield.padding};

            svg {
                height: ${theme.notification.message.textfield.svg.height};
                width: ${theme.notification.message.textfield.svg.width};
               
                path {
                    fill: ${theme.colors.lightGrey};
                }
            }

            &-text {
                margin-left: ${theme.notification.message.textfield.text.marginLeft};
                max-width: ${theme.notification.message.textfield.text.maxWidth};
                overflow-wrap: ${theme.notification.message.textfield.text.overflowWrap};
            }
        }

        &-sendIcon {
            display: ${theme.notification.message.sendIcon.display};
            justify-content: ${theme.notification.message.sendIcon.justifyContent};
            align-items: ${theme.notification.message.sendIcon.alignItems};
            height: ${theme.notification.message.sendIcon.height};
            width: ${theme.notification.message.sendIcon.width};
            background: ${theme.colors.primary};
            border-radius: ${theme.notification.message.sendIcon.borderRadius};
            margin: ${theme.notification.message.sendIcon.margin};
            box-shadow: ${theme.notification.message.sendIcon.boxShadow};

            svg {
                height: ${theme.notification.message.sendIcon.svg.height};
                width: ${theme.notification.message.sendIcon.svg.width};;
                path {

                }
            }
        }

        &-seperator {
            position: ${theme.notification.message.seperator.position};
            top: ${theme.notification.message.seperator.top};
            bottom: ${theme.notification.message.seperator.bottom};
            width: ${theme.notification.message.seperator.width};
            border-left: ${theme.notification.message.seperator.borderLeft};
            left: ${theme.notification.message.seperator.left};
            margin: ${theme.notification.message.seperator.margin};
        }
    }
	`}
`;

StyledNotificationMessage.defaultProps = {
	theme: {
		colors: {
			white: '#FFFFFF',
			background: '#00000099',
			primary: '#CC1E1C',
			lightGrey: '#00000066'
		},
		notification: {
			display: 'flex',
			flexDirection: 'column',
			position: 'relative',
			width: '400px',
			padding: '19px 16px 24px 16px',

			font: {
				fontFamily: 'Roboto, sans-serif',
				fontWeight: '400',
				fontSize: '14px',
				lineHeight: '20px'
			},

			border: {
				radius: '24px'
			},

			header: {
				display: 'flex',
				alignItems: 'center',
				fontWeight: '700px',
				fontSize: '16px',
				lineHeight: '21px',
				margin: '0 0 9.5px 0',

				svg: {
					margin: '0 9px 0 0',
					width: '24px',
					height: '24px'
				}
			},

			closeIcon: {
				position: 'absolute',
				top: '21px',
				right: '21px',

				svg: {
					width: '13.18px',
					height: '13.18px'
				}
			},

			message: {
				display: 'flex',
				position: 'relative',
				margin: '24px 0 0 0',
				fontSize: '16px',

				textfield: {
					display: 'flex',
					width: '308px',
					border: '1px solid #DCD9DC',
					borderRadius: '12px',
					boxShadow: 'inset 0px 2px 0px 1px rgba(0, 0, 0, 0.05)',
					padding: '13px 14px 13px 12px',

					svg: {
						height: '20px',
						width: '20px'
					},

					text: {
						marginLeft: '22px',
						maxWidth: '265px',
						overflowWrap: 'break-word'
					}
				},

				sendIcon: {
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '48px',
					width: '48px',
					borderRadius: '50%',
					margin: '0 0 0 12px',
					boxShadow: '0px 3px 0px rgba(0, 0, 0, 0.1)',

					svg: {
						height: '24px',
						width: '24px'
					}
				},

				seperator: {
					position: 'absolute',
					top: '0',
					bottom: '0',
					width: '0',
					borderLeft: '2px solid #00000033',
					left: '47px',
					margin: '0 7px 0 0'
				}
			}
		}
	}
};

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
				{userName && userName}
			</div>

			<div className="notification--closeIcon">
				{closeIcon && closeIcon}
			</div>

			{messageText && messageText}

			<div className="notification--message">
				<div className="notification--message-textfield">
					{smileyIcon && smileyIcon}
					<div className="notification--message-seperator"></div>
					<div className="notification--message-textfield-text">
						{label && label}
					</div>
				</div>
				<div className="notification--message-sendIcon">
					{sendIcon && sendIcon}
				</div>
			</div>
		</StyledNotificationMessage>
	);
};
