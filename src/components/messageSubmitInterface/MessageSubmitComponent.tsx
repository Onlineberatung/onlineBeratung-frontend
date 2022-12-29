import * as React from 'react';
import { lazy, Suspense, useCallback, useContext } from 'react';
import clsx from 'clsx';
import { MessageSubmitInterfaceSkeleton } from './MessageSubmitInterfaceSkeleton';
import {
	AUTHORITIES,
	hasUserAuthority,
	UserDataContext
} from '../../globalState';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';

const MessageSubmitInterfaceComponent = lazy(() =>
	import('./MessageSubmitInterfaceComponent').then((m) => ({
		default: m.MessageSubmitInterfaceComponent
	}))
);

export const MessageSubmitComponent = ({
	onShowMonitoringButton,
	isScrolledToBottom,
	className,
	onSendButton,
	language
}: {
	onShowMonitoringButton?: any;
	isScrolledToBottom?: boolean;
	className?: string;
	onSendButton?: Function;
	language?: string;
}) => {
	const { userData } = useContext(UserDataContext);
	const { activeSession } = useContext(ActiveSessionContext);

	const getPlaceholder = useCallback(() => {
		if (activeSession.isGroup) {
			return 'enquiry.write.input.placeholder.groupChat';
		} else if (hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData)) {
			return 'enquiry.write.input.placeholder.asker';
		} else if (
			hasUserAuthority(AUTHORITIES.VIEW_ALL_PEER_SESSIONS, userData) &&
			activeSession.isFeedback
		) {
			return 'enquiry.write.input.placeholder.feedback.main';
		} else if (
			hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) &&
			activeSession.isFeedback
		) {
			return 'enquiry.write.input.placeholder.feedback.peer';
		} else if (hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData)) {
			return 'enquiry.write.input.placeholder.consultant';
		}
		return 'enquiry.write.input.placeholder.asker';
	}, [activeSession.isFeedback, activeSession.isGroup, userData]);

	return (
		<>
			<Suspense
				fallback={
					<MessageSubmitInterfaceSkeleton
						placeholder={getPlaceholder()}
						className={clsx('session__submit-interface', className)}
					/>
				}
			>
				<MessageSubmitInterfaceComponent
					className={clsx(
						className,
						'session__submit-interface',
						isScrolledToBottom === false &&
							'session__submit-interface--scrolled-up'
					)}
					placeholder={getPlaceholder()}
					showMonitoringButton={onShowMonitoringButton}
					onSendButton={onSendButton}
					language={language}
				/>
			</Suspense>
		</>
	);
};
