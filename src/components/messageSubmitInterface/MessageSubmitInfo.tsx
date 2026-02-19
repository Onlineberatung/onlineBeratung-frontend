import * as React from 'react';
import InfoIcon from '@mui/icons-material/Info';
import ErrorIcon from '@mui/icons-material/Warning';
import './messageSubmitInfo.styles.scss';
import { useTranslation } from 'react-i18next';

export interface MessageSubmitInfoInterface {
	isInfo: boolean;
	infoHeadline?: string;
	infoMessage?: JSX.Element;
}

export const MessageSubmitInfo = (props: MessageSubmitInfoInterface) => {
	const { t: translate } = useTranslation();

	return (
		<div className="messageSubmitInfoWrapper">
			{props.infoHeadline && (
				<div
					className={
						props.isInfo
							? 'messageSubmitInfoWrapper__headlineWrapper'
							: 'messageSubmitInfoWrapper__headlineWrapper messageSubmitInfoWrapper__headlineWrapper--red'
					}
				>
					<span className="messageSubmitInfoWrapper__icon">
						{props.isInfo ? (
							<InfoIcon
								titleAccess={translate('notifications.info')}
								aria-label={translate('notifications.info')}
							/>
						) : (
							<ErrorIcon
								titleAccess={translate('notifications.error')}
								aria-label={translate('notifications.error')}
							/>
						)}
					</span>
					<span
						className={
							props.isInfo
								? 'messageSubmitInfoWrapper__headline'
								: 'messageSubmitInfoWrapper__headline messageSubmitInfoWrapper__headline--red'
						}
					>
						{props.infoHeadline}
					</span>
				</div>
			)}

			{props.infoMessage && (
				<div
					className={
						props.isInfo
							? 'messageSubmitInfoWrapper__message'
							: 'messageSubmitInfoWrapper__message messageSubmitInfoWrapper__message--red'
					}
				>
					{props.infoMessage}
				</div>
			)}
		</div>
	);
};
