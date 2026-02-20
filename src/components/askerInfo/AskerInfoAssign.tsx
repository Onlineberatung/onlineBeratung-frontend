import * as React from 'react';
import { useContext } from 'react';
import {
	ActiveSessionContext,
	UserDataContext,
	hasUserAuthority,
	AUTHORITIES
} from '../../globalState';
import { RequestSessionAssign } from '../sessionAssign/RequestSessionAssign';
import { Text } from '../text/Text';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';

export const AskerInfoAssign = ({
	title = 'userProfile.reassign.title'
}: {
	title?: string | null;
}) => {
	const { t: translate } = useTranslation();
	const { activeSession } = useContext(ActiveSessionContext);
	const { userData } = useContext(UserDataContext);

	return (
		!activeSession.isLive &&
		hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) && (
			<>
				<Typography variant="h5">
					{title && translate(title)}
				</Typography>
				<Text
					className="asker-info-assign__description"
					text={translate('userProfile.reassign.description')}
					type="infoSmall"
				/>
				<Box sx={{ mt: 2 }}>
					<RequestSessionAssign
						value={
							activeSession.consultant
								? activeSession.consultant.id
								: null
						}
					/>
				</Box>
			</>
		)
	);
};
