import * as React from 'react';
import { useState } from 'react';
import { ajaxForwardMessage } from '../../../apiWrapper/ts/ajaxCallMessageForward';
import { translate } from '../../../../resources/ts/i18n/translate';

interface ForwardIconProps {
	right: Boolean;
	message: string;
	messageTime: string;
	username: string;
	askerRcId: string;
	groupId: string;
}

export const ForwardIcon = (props: ForwardIconProps) => {
	const [messageForwarded, setMessageForwarded] = useState(false);
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);

	const forwardMessage = () => {
		if (isRequestInProgress) {
			return null;
		}
		setIsRequestInProgress(true);

		ajaxForwardMessage(
			props.message,
			props.messageTime,
			props.username,
			props.askerRcId,
			props.groupId
		).then(() => {
			setMessageForwarded(true);
			setTimeout(() => {
				setMessageForwarded(false);
				setIsRequestInProgress(false);
			}, 3000);
		});
	};

	return (
		<div
			className={
				props.right
					? `messageItem__action messageItem__action--right`
					: `messageItem__action`
			}
		>
			<a
				title={translate('message.forward.title')}
				href="#"
				onClick={(e) => {
					e.preventDefault();
					forwardMessage();
				}}
			>
				<svg
					className={
						!messageForwarded
							? `forward`
							: `forward forward--active`
					}
					width="24"
					height="19"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M15.723 14.07C9.099 13.403 2.815 15.552.24 20.667c.787-6.973 6.376-12.64 15.579-13.307l-1.964-1.964a.61.61 0 0 1-.188-.447.61.61 0 0 1 .188-.446l1.638-1.648a.616.616 0 0 1 .451-.188c.176 0 .327.062.452.188l7.355 7.365a.61.61 0 0 1 .188.447.61.61 0 0 1-.188.447l-7.355 7.364a.616.616 0 0 1-.452.189.616.616 0 0 1-.451-.189l-1.638-1.647a.61.61 0 0 1-.188-.447.61.61 0 0 1 .188-.447l1.868-1.867z"
						id="a"
					/>
				</svg>
				<svg
					className={
						!messageForwarded
							? `success`
							: `success success--active`
					}
					xmlns="http://www.w3.org/2000/svg"
					width="72"
					height="72"
					viewBox="0 0 72 72"
				>
					<path
						id="checkmark-a"
						d="M7.25269842,33.2086244 L7.25269842,33.2086244 C8.79968309,31.139936 11.7307652,30.7170117 13.7994536,32.2639963 C13.9758883,32.3959359 14.1427805,32.5401766 14.2988833,32.6956411 L29.2722338,47.6077543 L57.1900353,8.91834707 C58.6841829,6.84770824 61.5740132,6.38036974 63.6446521,7.87451731 C63.8009903,7.98732906 63.9501193,8.10980903 64.0911656,8.24123988 L64.0911656,8.24123988 C66.2871831,10.2875493 66.6320903,13.642246 64.8983875,16.0925826 L31.9438937,62.6689641 C31.3059119,63.5706586 30.0577576,63.7844399 29.1560631,63.1464581 C29.0579244,63.0770214 28.9662462,62.9988775 28.8821421,62.9129755 L7.79547562,41.3755491 C5.62571417,39.1594056 5.39529652,35.6924148 7.25269842,33.2086244 Z"
					/>
				</svg>
			</a>
		</div>
	);
};
