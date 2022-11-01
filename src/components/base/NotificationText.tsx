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
	invert?: boolean;
}

const StyledNotificationText = styled.div`
	${({ theme }) => `
		font-family: ${theme.font.family_sans_serif ?? 'Roboto, sans-serif'};
		font-weight: ${theme.font.weight_regular ?? '400'};
		font-size: ${theme.font.size_tertiary ?? '14px'};
		line-height: ${theme.font.line_height_primary ?? '21px'};

		height: max-content;
		width: 320px;

		border-radius: ${theme.border.radius ?? '4px'};
		padding: 18px;

		color: ${theme.color.text_onDark ?? '#FFFFFF'};
		background: #00000099;

		box-sizing: border-box;

		.notification--headline { 
			font-weight: 700;
			font-size: ${theme.font.size_primary ?? '16px'};
			line-height: ${theme.font.line_height_primary ?? '21px'};
			position: relative;
			bottom: 5px;
		}

		.notification--text {
			margin: ${theme.grid.base ?? '8px'} 0 0 30px;
		}

		svg {
			width: 20px;
			height: 20px;
			margin: 0 10px 0 0;
		}

		&.info path {
			fill: ${theme.color.interactive_onDark ?? '#FFFFFF'};
		}

		&.success path {
			fill: ${theme.color.status_success_foreground ?? '#4FCC5C'};
		}

		&.warning path {
			fill: ${theme.color.status_attention_foreground ?? '#FF9F00'};
		}

		&.error path {
			fill: ${theme.color.status_error_foreground ?? '#FF0000'};
		}

		&.invert {
			color: ${theme.color.text_emphasisLow ?? '#000000A6'};
			background: ${theme.color.interactive_disabled_background_black ?? '#0000000D'};

			&.notification--headline { 
				color: ${theme.color.text_emphasisHigh ?? '#000000E5'};
			}

			&.info path {
				fill: ${theme.color.text_emphasisHigh ?? '#000000E5'};
			}
		}
	`}
`;

export const NotificationText = ({
	type = TYPE_INFO,
	headline,
	text,
	icon,
	invert = false,
	className,
	...props
}: NotificationTextProps) => {
	return (
		<StyledNotificationText
			type="notification"
			className={`${className} ${type} ${invert && 'invert'}`}
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
