import * as React from 'react';
import { useContext } from 'react';
import { handleNumericTranslation } from '../../utils/translate';
import { getContact, ActiveSessionContext } from '../../globalState';
import {
	convertUserDataObjectToArray,
	getUserDataTranslateBase
} from '../profile/profileHelpers';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import { TopicSessionInterface } from '../../globalState/interfaces';

export const AskerInfoData = () => {
	const { t: translate } = useTranslation(['common']);
	const { activeSession } = useContext(ActiveSessionContext);

	const topicSession = activeSession.item?.topic as TopicSessionInterface;
	const userSessionData = getContact(activeSession).sessionData;
	const preparedUserSessionData =
		convertUserDataObjectToArray(userSessionData);

	return (
		<>
			<Typography variant="h5">
				{translate('userProfile.data.title')}
			</Typography>
			{topicSession?.id !== undefined && topicSession?.name && (
				<Box sx={{ mt: 1.5 }}>
					<Typography
						variant="caption"
						color="text.secondary"
						display="block"
					>
						{translate('userProfile.data.topic')}
					</Typography>
					<Typography variant="body1">
						{topicSession.name}
					</Typography>
				</Box>
			)}
			{activeSession.item.consultingType === 0 &&
				!activeSession.isLive && (
					<div className="askerInfo__data__item">
						<p className="askerInfo__data__label">
							{translate('userProfile.data.postcode')}
						</p>
						<p className="askerInfo__data__content">
							{activeSession.item.postcode}
						</p>
					</div>
				)}
			{preparedUserSessionData.map((item, index) =>
				item.type === 'age' && item.value === 'null' ? null : (
					<div className="askerInfo__data__item" key={index}>
						<p className="askerInfo__data__label">
							{translate('userProfile.data.' + item.type)}
						</p>
						<p
							className={
								item.value
									? `askerInfo__data__content`
									: `askerInfo__data__content askerInfo__data__content--empty`
							}
						>
							{item.value
								? translate(
										handleNumericTranslation(
											getUserDataTranslateBase(
												activeSession.item
													.consultingType
											),
											item.type,
											item.value
										)
									)
								: translate('profile.noContent')}
						</p>
					</div>
				)
			)}
		</>
	);
};
