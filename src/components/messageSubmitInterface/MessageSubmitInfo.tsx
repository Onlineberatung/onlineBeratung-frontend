import * as React from 'react';
import { ReactComponent as InfoIcon } from '../../resources/img/icons/i.svg';
import { ReactComponent as ErrorIcon } from '../../resources/img/icons/exclamation-mark.svg';
import './messageSubmitInfo.styles';

export interface MessageSubmitInfoInterface {
	isInfo: boolean;
	infoHeadline?: string;
	infoMessage?: JSX.Element;
}

export const MessageSubmitInfo = (props: MessageSubmitInfoInterface) => {
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
						{props.isInfo ? <InfoIcon /> : <ErrorIcon />}
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
