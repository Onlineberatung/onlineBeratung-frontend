import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { translate } from '../../utils/translate';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import { OVERLAY_FUNCTIONS } from '../overlay/Overlay';
import {
	deleteKeyFromObject,
	unPathifyObject,
	hasMonitoringData
} from '../monitoring/MonitoringHelper';
import {
	typeIsEnquiry,
	getSessionListPathForLocation
} from '../session/sessionHelpers';
import {
	getActiveSession,
	SessionsDataContext,
	ActiveSessionGroupIdContext,
	UserDataContext,
	hasUserAuthority,
	AUTHORITIES,
	isAnonymousSession
} from '../../globalState';
import { Link, useLocation } from 'react-router-dom';
import { SessionAssign } from '../sessionAssign/SessionAssign';
import { apiGetMonitoring } from '../../api';
import { ReactComponent as EditIcon } from '../../resources/img/icons/pen.svg';
import { Text } from '../text/Text';

const buttonSet: ButtonItem = {
	label: translate('userProfile.monitoring.buttonLabel'),
	function: OVERLAY_FUNCTIONS.REDIRECT,
	type: BUTTON_TYPES.SECONDARY
};

export const AskerInfoMonitoring = () => {
	const { sessionsData } = useContext(SessionsDataContext);
	const { activeSessionGroupId } = useContext(ActiveSessionGroupIdContext);
	const activeSession = getActiveSession(activeSessionGroupId, sessionsData);
	const isLiveChat = isAnonymousSession(activeSession?.session);
	const { userData } = useContext(UserDataContext);
	const [monitoringData, setMonitoringData] = useState({});
	const [sessionListTab] = useState(
		new URLSearchParams(useLocation().search).get('sessionListTab')
	);

	useEffect(() => {
		apiGetMonitoring(activeSession.session.id)
			.then((monitoringData) => {
				setMonitoringData(monitoringData);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const monitoringDataAvailable = hasMonitoringData(monitoringData);
	let cleanMonitoringData = unPathifyObject(monitoringData);
	cleanMonitoringData = deleteKeyFromObject(cleanMonitoringData, 'meta');

	const resort =
		activeSession.session.consultingType === 0
			? 'monitoringAddiction'
			: 'monitoringU25';
	const monitoringLink = `${getSessionListPathForLocation()}/${
		activeSession.session.groupId
	}/${activeSession.session.id}/userProfile/monitoring${
		sessionListTab ? `?sessionListTab=${sessionListTab}` : ''
	}`;

	const renderAddiction = (obj: any, firstLevel: any = false): any => {
		if (!obj) return null;
		return Object.keys(obj).map((key) => {
			const val = obj[key];
			let hasChildVal = false;
			if (firstLevel) {
				hasChildVal = hasMonitoringData(val);
			}

			if (typeof val === 'object' && key.indexOf('meta') === -1) {
				if (firstLevel) {
					return (
						<Link key={key} to={monitoringLink}>
							<div className="profile__data__item" key={key}>
								<p className="profile__data__label">
									{val
										? translate(
												'monitoring.' +
													resort +
													'.' +
													key
										  )
										: translate('monitoring.empty')}
								</p>

								<div className="monitoring__data">
									{hasChildVal ? (
										<div className="profile__data__content">
											{renderAddiction(val)}
										</div>
									) : (
										<div className="profile__data__content profile__data__content--empty">
											{translate('monitoring.empty')}
										</div>
									)}
									<div className="profile__data__icon">
										<EditIcon />
									</div>
								</div>
							</div>
						</Link>
					);
				}
				return renderAddiction(val);
			}
			if (!val) {
				return null;
			}

			return (
				<p className="monitoringItem" key={key}>
					{translate('monitoring.' + resort + '.' + key)}
				</p>
			);
		});
	};

	const renderAssign = () => {
		return (
			!isLiveChat &&
			hasUserAuthority(AUTHORITIES.VIEW_ALL_PEER_SESSIONS, userData) && (
				<div className="profile__content__item__assign">
					<Text
						text={translate('userProfile.reassign.title')}
						type="divider"
					/>
					<SessionAssign value={activeSession.consultant.id} />
				</div>
			)
		);
	};

	if (monitoringDataAvailable) {
		return (
			<div className="profile__content__item">
				<Text
					text={translate('userProfile.monitoring.title')}
					type="divider"
				/>
				<div className="profile__data__content">
					{renderAddiction(cleanMonitoringData, true)}
				</div>
				{renderAssign()}
			</div>
		);
	}

	return (
		<div className="profile__content__item">
			<Text
				text={translate('userProfile.monitoring.title')}
				type="divider"
			/>
			{!typeIsEnquiry(activeSession.type) && (
				<Link to={monitoringLink}>
					<Button item={buttonSet} isLink={true} />
				</Link>
			)}
			{renderAssign()}
		</div>
	);
};
