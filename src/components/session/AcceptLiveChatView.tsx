import * as React from 'react';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { getContact } from '../../globalState';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';
import './session.styles';
import { FETCH_ERRORS } from '../../api';
import { SessionHeaderComponent } from '../sessionHeader/SessionHeaderComponent';
import { Headline } from '../headline/Headline';
import { useWatcher } from '../../hooks/useWatcher';
import { apiGetSessionRoomBySessionId } from '../../api/apiGetSessionRooms';
import { AcceptAssign } from './AcceptAssign';
import { useTranslation } from 'react-i18next';

interface AcceptLiveChatViewProps {
	bannedUsers: string[];
}

export const AcceptLiveChatView = ({
	bannedUsers
}: AcceptLiveChatViewProps) => {
	const { t: translate } = useTranslation();
	const { activeSession } = useContext(ActiveSessionContext);

	const abortController = useRef<AbortController>(null);

	const [assigned, setAssigned] = useState(false);

	const updateActiveSession = useCallback(() => {
		if (abortController.current) {
			abortController.current.abort();
		}

		abortController.current = new AbortController();

		return apiGetSessionRoomBySessionId(
			activeSession.item.id,
			abortController.current.signal
		).catch((e) => {
			if (e.message === FETCH_ERRORS.ABORT) {
				return;
			} else if (e.message === FETCH_ERRORS.FORBIDDEN) {
				setAssigned(true);
			}
		});
	}, [activeSession.item.id]);

	const [startWatcher, stopWatcher, isWatcherRunning] = useWatcher(
		updateActiveSession,
		3000
	);

	useEffect(() => {
		if (!isWatcherRunning && !assigned) {
			startWatcher();
		}

		return () => {
			if (isWatcherRunning) {
				stopWatcher();
			}
			if (abortController.current) {
				abortController.current.abort();
				abortController.current = null;
			}
		};
	}, [assigned, isWatcherRunning, startWatcher, stopWatcher]);

	return (
		<div className="session__wrapper">
			<div className="session">
				<div>
					<SessionHeaderComponent bannedUsers={bannedUsers} />
				</div>

				<div className="session__content session__content--anonymousEnquiry">
					<Headline
						semanticLevel="3"
						text={`${translate(
							'enquiry.anonymous.infoLabel.start'
						)}${
							getContact(activeSession)?.username ||
							translate('sessionList.user.consultantUnknown')
						}${translate('enquiry.anonymous.infoLabel.end')}`}
					/>
				</div>

				<AcceptAssign
					assignable={false}
					assigned={assigned}
					isAnonymous={true}
					btnLabel={'enquiry.acceptButton.anonymous'}
				/>
			</div>
		</div>
	);
};
