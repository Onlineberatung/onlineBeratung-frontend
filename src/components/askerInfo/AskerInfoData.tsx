import * as React from 'react';
import { useContext } from 'react';
import { handleNumericTranslation } from '../../utils/translate';
import { getContact, ActiveSessionContext } from '../../globalState';
import {
	convertUserDataObjectToArray,
	getUserDataTranslateBase
} from '../profile/profileHelpers';
import { useTranslation } from 'react-i18next';
import { Box, Stack, Typography } from '@mui/material';
import { TopicSessionInterface } from '../../globalState/interfaces';
import { Headline } from '../headline/Headline';

export const AskerInfoData = () => {
	const { t: translate } = useTranslation(['common']);
	const { activeSession } = useContext(ActiveSessionContext);

	const topicSession = activeSession.item?.topic as TopicSessionInterface;
	const userSessionData = getContact(activeSession).sessionData;
	const preparedUserSessionData =
		convertUserDataObjectToArray(userSessionData);

	return (
		<>
			<Headline
				text={translate('userProfile.data.title')}
				semanticLevel="5"
			/>
			<Stack spacing={2} sx={{ mt: 2 }}>
				{topicSession?.id !== undefined && topicSession?.name && (
					<Box>
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
			</Stack>
		</>
	);
};
