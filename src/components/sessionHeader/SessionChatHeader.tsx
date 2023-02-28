import clsx from 'clsx';
import * as React from 'react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ReactComponent as BackIcon } from '../../resources/img/icons/arrow-left.svg';
import {
	AUTHORITIES,
	getContact,
	hasUserAuthority,
	SessionTypeContext,
	useConsultingType,
	UserDataContext
} from '../../globalState';
import { SessionMenu } from '../sessionMenu/SessionMenu';
import {
	getAddictiveDrugsString,
	handleNumericTranslation
} from '../../utils/translate';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';
import {
	getViewPathForType,
	SESSION_LIST_TAB,
	SESSION_LIST_TYPES
} from '../session/sessionHelpers';
import { mobileListView } from '../app/navigationHandler';
import {
	convertUserDataObjectToArray,
	getAddictiveDrugsTranslatable
} from '../profile/profileHelpers';
import { useSearchParam } from '../../hooks/useSearchParams';

export const SessionChatHeader = ({
	hasUserInitiatedStopOrLeaveRequest
}: {
	hasUserInitiatedStopOrLeaveRequest?: React.MutableRefObject<boolean>;
}) => {
	const { t: translate } = useTranslation([
		'common',
		'consultingTypes',
		'agencies'
	]);
	const sessionListTab = useSearchParam<SESSION_LIST_TAB>('sessionListTab');

	const { activeSession } = useContext(ActiveSessionContext);
	const consultingType = useConsultingType(activeSession.item.consultingType);
	const { userData } = useContext(UserDataContext);
	const { type, path: listPath } = useContext(SessionTypeContext);

	const getSessionListTab = () =>
		`${sessionListTab ? `?sessionListTab=${sessionListTab}` : ''}`;

	const sessionView = getViewPathForType(type);
	const username = getContact(
		activeSession,
		translate('sessionList.user.consultantUnknown')
	).username;
	const displayName = getContact(
		activeSession,
		translate('sessionList.user.consultantUnknown')
	).displayName;
	const userSessionData = getContact(
		activeSession,
		translate('sessionList.user.consultantUnknown')
	).sessionData;
	const preparedUserSessionData =
		hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) &&
		userSessionData &&
		!activeSession.isLive
			? convertUserDataObjectToArray(userSessionData)
			: null;
	const addictiveDrugs =
		hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) &&
		userSessionData
			? getAddictiveDrugsTranslatable(userSessionData.addictiveDrugs)
			: null;
	const translateBase =
		activeSession.item.consultingType === 0
			? 'user.userAddiction'
			: 'user.userU25';

	const userProfileLink = `/sessions/consultant/${sessionView}/${
		activeSession.item.groupId
	}/${activeSession.item.id}/userProfile${getSessionListTab()}`;

	const isAskerInfoAvailable = () =>
		!hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) &&
		consultingType?.showAskerProfile &&
		activeSession.isSession &&
		!activeSession.isLive &&
		((type === SESSION_LIST_TYPES.ENQUIRY &&
			Object.entries(userSessionData).length !== 0) ||
			SESSION_LIST_TYPES.ENQUIRY !== type);

	const handleBackButton = () => {
		mobileListView();
	};

	return (
		<>
			<div className="sessionInfo__headerWrapper">
				<Link
					to={listPath + getSessionListTab()}
					onClick={handleBackButton}
					className="sessionInfo__backButton"
				>
					<BackIcon />
				</Link>
				<div
					className={clsx('sessionInfo__username', {
						'sessionInfo__username--deactivate':
							!isAskerInfoAvailable()
					})}
				>
					{hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) && (
						<h3>{displayName || username}</h3>
					)}
					{hasUserAuthority(
						AUTHORITIES.CONSULTANT_DEFAULT,
						userData
					) ? (
						isAskerInfoAvailable() ? (
							<Link to={userProfileLink}>
								<h3>{username}</h3>
							</Link>
						) : (
							<h3>{username}</h3>
						)
					) : null}
					{hasUserAuthority(
						AUTHORITIES.ANONYMOUS_DEFAULT,
						userData
					) && <h3>{displayName || username}</h3>}
				</div>
				<SessionMenu
					hasUserInitiatedStopOrLeaveRequest={
						hasUserInitiatedStopOrLeaveRequest
					}
					isAskerInfoAvailable={isAskerInfoAvailable()}
				/>
			</div>

			{(hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) ||
				hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData)) && (
				<div className="sessionInfo__metaInfo">
					{!activeSession.agency ? (
						<div className="sessionInfo__metaInfo__content">
							{consultingType
								? translate(
										[
											`consultingType.${consultingType.id}.titles.short`,
											consultingType.titles.short
										],
										{ ns: 'consultingTypes' }
								  )
								: ''}
						</div>
					) : null}
					{preparedUserSessionData
						? preparedUserSessionData.map((item, index) =>
								item.value ? (
									<div
										className="sessionInfo__metaInfo__content"
										key={index}
									>
										{item.type === 'addictiveDrugs'
											? translate(
													getAddictiveDrugsString(
														addictiveDrugs
													)
											  )
											: translate(
													handleNumericTranslation(
														translateBase,
														item.type,
														item.value
													)
											  )}
									</div>
								) : null
						  )
						: null}
					{activeSession.agency?.name && (
						<div className="sessionInfo__metaInfo__content">
							{' '}
							{translate(
								[
									`agency.${activeSession.agency.id}.name`,
									activeSession.agency.name
								],
								{ ns: 'agencies' }
							)}{' '}
						</div>
					)}
					{activeSession.agency && (
						<div className="sessionInfo__metaInfo__content">
							{translate('consultant.jobTitle')}
						</div>
					)}
				</div>
			)}
		</>
	);
};
