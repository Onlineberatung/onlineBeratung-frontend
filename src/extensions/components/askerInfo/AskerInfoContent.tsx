import * as React from 'react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { SESSION_LIST_TYPES } from '../../../components/session/sessionHelpers';
import {
	AUTHORITIES,
	ConsultingSessionDataInterface,
	hasUserAuthority,
	SessionTypeContext,
	TenantContext,
	TopicSessionInterface,
	UserDataContext
} from '../../../globalState';
import { AskerInfoAssign } from '../../../components/askerInfo/AskerInfoAssign';
import '../../../components/askerInfo/askerInfo.styles';
import { ActiveSessionContext } from '../../../globalState/provider/ActiveSessionProvider';
import { AskerInfoTools } from '../../../components/askerInfo/AskerInfoTools';
import { ProfileBox } from './ProfileBox';
import { ProfileDataItem } from './ProfileDataItem';
import { AskerInfoDocumentation } from './AskerInfoDocumentation';
import { apiGetUserDataBySessionId } from '../../../api/apiGetUserDataBySessionId';
import { useTranslation } from 'react-i18next';
import { Box, BoxTypes } from '../../../components/box/Box';

export const AskerInfoContent = () => {
	const { t: translate } = useTranslation();
	const { tenant } = useContext(TenantContext);
	const { activeSession } = useContext(ActiveSessionContext);
	const { userData } = useContext(UserDataContext);
	const [sessionData, setSessionData] =
		useState<ConsultingSessionDataInterface>(null);

	const { type } = useContext(SessionTypeContext);

	useEffect(() => {
		if (activeSession?.item?.id) {
			apiGetUserDataBySessionId(activeSession.item.id)
				.then(setSessionData)
				.catch(console.log);
		}
	}, [activeSession?.item?.id]);

	const isSessionAssignAvailable = useCallback(() => {
		const isPeerChat = activeSession.item.isPeerChat;
		return (
			!hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) &&
			!activeSession.isLive &&
			!activeSession.isGroup &&
			((type === SESSION_LIST_TYPES.ENQUIRY &&
				hasUserAuthority(
					AUTHORITIES.ASSIGN_CONSULTANT_TO_ENQUIRY,
					userData
				) &&
				isPeerChat) ||
				(type !== SESSION_LIST_TYPES.ENQUIRY &&
					((isPeerChat &&
						hasUserAuthority(
							AUTHORITIES.ASSIGN_CONSULTANT_TO_PEER_SESSION,
							userData
						)) ||
						(!isPeerChat &&
							hasUserAuthority(
								AUTHORITIES.ASSIGN_CONSULTANT_TO_SESSION,
								userData
							)))))
		);
	}, [activeSession, type, userData]);

	const translateKeys = {
		gender: `profile.gender.options.${sessionData?.gender?.toLowerCase()}`,
		counselling: `profile.counsellingRelation.${sessionData?.counsellingRelation?.toLowerCase()}`
	};

	return (
		<>
			{!sessionData && (
				<Box type={BoxTypes.INFO}>
					{translate('profile.enquiry.notice')}
				</Box>
			)}
			<div className="askerInfo__content__container">
				{sessionData && (
					<ProfileBox title="profile.profilInformation">
						<ProfileDataItem
							title="profile.age"
							content={`${sessionData?.age}`}
						/>
						<ProfileDataItem
							title="profile.gender.title"
							content={translate(translateKeys.gender)}
						/>
						<ProfileDataItem
							title="profile.status"
							content={translate(translateKeys.counselling)}
						/>
						<ProfileDataItem
							title="profile.postalCode"
							content={sessionData?.postcode}
						/>
					</ProfileBox>
				)}

				{tenant?.settings?.featureToolsEnabled && sessionData?.id && (
					<ProfileBox title="profile.tools.tools">
						<AskerInfoTools />
					</ProfileBox>
				)}

				<ProfileBox title="profile.topic">
					{(sessionData?.mainTopic || activeSession?.item?.topic) && (
						<ProfileDataItem
							title="profile.mainTopic"
							content={
								sessionData?.mainTopic?.name ||
								(
									activeSession?.item
										?.topic as TopicSessionInterface
								)?.name
							}
						/>
					)}

					{sessionData?.topics?.length > 0 && (
						<ProfileDataItem
							title="profile.selectedTopics"
							content={sessionData?.topics
								.map(({ name }) => name)
								.join(', ')}
						/>
					)}
				</ProfileBox>

				{tenant?.settings?.featureToolsEnabled && sessionData?.id && (
					<ProfileBox title="profile.tools.documentation">
						<AskerInfoDocumentation />
					</ProfileBox>
				)}

				{isSessionAssignAvailable() && (
					<ProfileBox title="userProfile.reassign.title">
						<AskerInfoAssign title={null} />
					</ProfileBox>
				)}
			</div>
		</>
	);
};
