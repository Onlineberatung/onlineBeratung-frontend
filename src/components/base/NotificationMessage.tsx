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
    border-radius: ${theme.border.radius};
    
    background: ${theme.colors.background};
    color: ${theme.colors.white};
   
    font-family: ${theme.font.family};
    font-weight: ${theme.font.weight};
    font-size: ${theme.font.sizeSmall};
    line-height: ${theme.font.lineHeightSmall};

    svg {
        path {
            fill: ${theme.colors.white};
        }
    }

    .notification--header {
        display: ${theme.notification.header.display};
        align-items: ${theme.notification.header.alignItems};
        font-weight: ${theme.font.weightBold};
        font-size: ${theme.font.size};
        line-height: ${theme.font.lineHeight};
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
        font-size: ${theme.font.size};

        &-textfield {
            display: ${theme.notification.message.textfield.display};
            background: ${theme.colors.white};
            color: ${theme.colors.lightGrey};
            width: ${theme.notification.message.textfield.width};
            border: ${theme.border.style} #DCD9DC;
            border-radius: ${theme.border.radiusSmall};
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
				all: ${theme.notification.message.textfield.text.all};
				position: ${theme.notification.message.textfield.text.position};
				left: ${theme.notification.message.textfield.text.left};
				overflow: ${theme.notification.message.textfield.text.overflow};
				color: ${theme.colors.black};
                max-width: ${theme.notification.message.textfield.text.maxWidth};
				width: ${theme.notification.message.textfield.text.maxWidth};
				&::placeholder {
					color: ${theme.colors.lightGrey};
				}
            }
        }

        &-sendIcon {
            display: ${theme.notification.message.sendIcon.display};
            justify-content: ${theme.notification.message.sendIcon.justifyContent};
            align-items: ${theme.notification.message.sendIcon.alignItems};
            height: ${theme.notification.message.sendIcon.height};
            width: ${theme.notification.message.sendIcon.width};
            background: ${theme.colors.primary};
            border-radius: ${theme.border.radiusCircle};
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
            border-left: ${theme.border.styleBold} #00000033;
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
			black: '#000000DE',
			background: '#00000099',
			primary: '#CC1E1C',
			lightGrey: '#00000066'
		},

		font: {
			family: 'Roboto, sans-serif',
			weight: '400',
			size: '16px',
			sizeSmall: '14px',
			lineHeight: '21px',
			lineHeightSmall: '20px',
			weightBold: '700'
		},

		border: {
			style: '1px solid',
			styleBold: '2px solid',
			radius: '24px',
			radiusSmall: '12px',
			radiusCircle: '50%'
		},

		notification: {
			display: 'flex',
			flexDirection: 'column',
			position: 'relative',
			width: '400px',
			padding: '19px 16px 24px 16px',

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

				textfield: {
					display: 'flex',
					width: '308px',
					boxShadow: 'inset 0px 2px 0px 1px rgba(0, 0, 0, 0.05)',
					padding: '13px 14px 13px 12px',

					svg: {
						height: '20px',
						width: '20px'
					},

					text: {
						marginLeft: '22px',
						maxWidth: '265px',
						all: 'unset',
						position: 'absolute',
						left: '56px',
						overflow: 'hidden'
					}
				},

				sendIcon: {
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '48px',
					width: '48px',
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
					left: '45px',
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