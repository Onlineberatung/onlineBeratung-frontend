import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { translate } from '../../resources/scripts/i18n/translate';
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
	AUTHORITIES
} from '../../globalState';
import { Link } from 'react-router-dom';
import { SessionAssign } from '../sessionAssign/SessionAssign';
import { ajaxCallGetMonitoring } from '../apiWrapper/ajaxCallGetMonitoring';
import { ReactComponent as EditIcon } from '../../resources/img/icons/pen.svg';
import './profile.styles';

const buttonSet: ButtonItem = {
	label: translate('userProfile.monitoring.buttonLabel'),
	function: OVERLAY_FUNCTIONS.REDIRECT,
	type: BUTTON_TYPES.SECONDARY
};

export const UserMonitoring = () => {
	const { sessionsData } = useContext(SessionsDataContext);
	const { activeSessionGroupId } = useContext(ActiveSessionGroupIdContext);
	const activeSession = getActiveSession(activeSessionGroupId, sessionsData);
	const { userData } = useContext(UserDataContext);
	const [monitoringData, setMonitoringData] = useState({});

	useEffect(() => {
		ajaxCallGetMonitoring(activeSession.session.id)
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
	}/${activeSession.session.id}/userProfile/monitoring`;

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
		return hasUserAuthority(
			AUTHORITIES.VIEW_ALL_PEER_SESSIONS,
			userData
		) ? (
			<div className="profile__content__item__assign">
				<p className="profile__content__title">
					{translate('userProfile.reassign.title')}
				</p>
				<SessionAssign value={activeSession.consultant.id} />
			</div>
		) : null;
	};

	if (monitoringDataAvailable) {
		return (
			<div className="profile__content__item profile__functions">
				<p className="profile__content__title">
					{translate('userProfile.monitoring.title')}
				</p>
				<div className="profile__data__content">
					{renderAddiction(cleanMonitoringData, true)}
				</div>
				{renderAssign()}
			</div>
		);
	}

	return (
		<div className="profile__content__item profile__functions">
			<p className="profile__content__title">
				{translate('userProfile.monitoring.title')}
			</p>
			{!typeIsEnquiry(activeSession.type) ? (
				<Link to={monitoringLink}>
					<Button
						item={buttonSet}
						isLink={true}
						buttonHandle={() => null}
					/>
				</Link>
			) : null}
			{renderAssign()}
		</div>
	);
};
