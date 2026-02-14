import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import CallOffIcon from '../../resources/img/icons/call-off.svg?react';
import InfoIcon from '../../resources/img/icons/i.svg?react';

export const ICON_CALL_OFF = 'call_off';
export const ICON_INFO = 'info';

interface SystemMessageProps {
	subject: JSX.Element;
	icon?: typeof ICON_CALL_OFF | typeof ICON_INFO;
	children?: JSX.Element;
}

export const SystemMessage: React.FC<SystemMessageProps> = ({
	subject,
	icon,
	children
}) => {
	const { t: translate } = useTranslation();
	const getIcon = useCallback(() => {
		switch (icon) {
			case ICON_CALL_OFF:
				return CallOffIcon;
			case ICON_INFO:
				return InfoIcon;
		}
		return null;
	}, [icon]);

	const Icon = getIcon();

	return (
		<div className="systemMessage__subjectWrapper">
			{Icon && (
				<div>
					<Icon
						className="systemMessage__icon"
						title={
							icon === 'call_off'
								? translate('videoCall.info')
								: translate('notifications.info')
						}
						aria-label={
							icon === 'call_off'
								? translate('videoCall.info')
								: translate('notifications.info')
						}
					/>
				</div>
			)}
			<div>
				<p className="systemMessage__subject">{subject}</p>
				{children}
			</div>
		</div>
	);
};
