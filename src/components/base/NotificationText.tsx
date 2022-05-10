import React, { HTMLAttributes, ReactElement } from 'react';
import styled from 'styled-components';

export const TYPE_INFO = 'info';
export const TYPE_SUCCESS = 'success';
export const TYPE_WARNING = 'warning';
export const TYPE_ERROR = 'error';

export type TYPE =
	| typeof TYPE_INFO
	| typeof TYPE_SUCCESS
	| typeof TYPE_WARNING
	| typeof TYPE_ERROR;

interface NotificationTextProps extends HTMLAttributes<HTMLDivElement> {
	type?: TYPE;
	headline?: string;
	text?: string;
	icon?: ReactElement;
}

const StyledNotificationText = styled.div`
	${({ theme }) => `
		font-family: ${theme.font.family};
		font-weight: ${theme.font.weight};
		font-size: ${theme.font.sizeSmall};
		line-height: ${theme.font.lineHeightSmall};

		height: ${theme.notification.height};
		width: ${theme.notification.width};

		border-radius: ${theme.border.radius};
		padding: ${theme.notification.padding};

		color: ${theme.colors.white};
		background: ${theme.colors.background};


		.notification--headline { 
			font-weight: ${theme.font.weightBold};
			font-size: ${theme.font.size};
			line-height: ${theme.font.lineHeight};
			position: relative;
			bottom: 5px;
		}

		.notification--text {
			margin: ${theme.notification.spacer} 0 0 0;
		}

		svg {
			width: ${theme.notification.svg.width};
			height: ${theme.notification.svg.height};
			margin: 0 ${theme.notification.spacer} 0 0;
		}

		&.info path {
			fill: ${theme.colors.white};
		}

		&.success path {
			fill: ${theme.colors.success};
		}

		&.warning path {
			fill: ${theme.colors.warning};
		}

		&.error path {
			fill: ${theme.colors.error};
		}
	`}
`;

StyledNotificationText.defaultProps = {
	theme: {
		colors: {
			white: '#FFFFFF',
			background: '#00000099',
			success: '#4FCC5C',
			warning: '#FF9F00',
			error: '#FF0000'
		},

		font: {
			family: 'Roboto, sans-serif',
			weight: '400',
			weightBold: '700',
			size: '16px',
			sizeSmall: '14px',
			lineHeight: '143%',
			lineHeightSmall: '131%'
		},

		border: {
			radius: '4px'
		},

		notification: {
			padding: '16px',
			spacer: '8px',
			width: '320px',
			height: 'max-content',

			svg: {
				height: '24px',
				width: '24px'
			}
		}
	}
};

export const NotificationText = ({
	type = TYPE_INFO,
	headline,
	text,
	icon,
	className,
	...props
}: NotificationTextProps) => {
	return (
		<StyledNotificationText
			type="notification"
			className={`${className} ${type}`}
			{...props}
		>
			<div>
				{icon && icon}
				<span className="notification--headline">
					{headline && headline}
				</span>
			</div>
			<div className="notification--text">{text && text}</div>
		</StyledNotificationText>
	);
};
