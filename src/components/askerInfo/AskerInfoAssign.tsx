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
import { Stack } from '@mui/material';
import { Headline } from '../headline/Headline';

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
				<Headline
					text={title && translate(title)}
					semanticLevel="5"
				/>
				<Stack spacing={2} sx={{ mt: 2 }}>
					<Text
						className="asker-info-assign__description"
						text={translate('userProfile.reassign.description')}
						type="infoSmall"
					/>
					<RequestSessionAssign
						value={
							activeSession.consultant
								? activeSession.consultant.id
								: null
						}
					/>
				</Stack>
			</>
		)
	);
};
