import {
	AUTHORITIES,
	hasUserAuthority,
	SessionTypeContext,
	UserDataContext
} from '../../globalState';
import {
	getViewPathForType,
	SESSION_LIST_TAB,
	SESSION_LIST_TYPES
} from './sessionHelpers';
import { Link } from 'react-router-dom';
import { Button, ButtonItem } from '../button/Button';
import * as React from 'react';
import { useContext, useMemo } from 'react';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';
import { useSearchParam } from '../../hooks/useSearchParams';

export const SessionMonitoring = ({
	visible,
	className
}: {
	visible: boolean;
	className?: string;
}) => {
	const { activeSession } = useContext(ActiveSessionContext);
	const { userData } = useContext(UserDataContext);
	const { type } = useContext(SessionTypeContext);

	const sessionListTab = useSearchParam<SESSION_LIST_TAB>('sessionListTab');
	const getSessionListTab = () =>
		`${sessionListTab ? `?sessionListTab=${sessionListTab}` : ''}`;

	const monitoringButtonItem: ButtonItem = useMemo(
		() => ({
			label: 'session.monitoring.buttonLabel',
			type: 'PRIMARY',
			function: ''
		}),
		[]
	);

	if (
		activeSession.item.monitoring &&
		!hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) &&
		(activeSession.isGroup || !activeSession.isFeedback) &&
		type !== SESSION_LIST_TYPES.ENQUIRY &&
		visible &&
		!activeSession.isLive
	) {
		return (
			<Link
				className={className}
				to={`/sessions/consultant/${getViewPathForType(type)}/${
					activeSession.item.groupId
				}/${
					activeSession.item.id
				}/userProfile/monitoring${getSessionListTab()}`}
			>
				<div className="monitoringButton">
					<Button item={monitoringButtonItem} isLink={true} />
				</div>
			</Link>
		);
	}

	return null;
};
