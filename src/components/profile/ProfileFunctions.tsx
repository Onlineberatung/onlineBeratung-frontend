import * as React from 'react';
import { useContext } from 'react';
import { AbsenceFormular } from '../absenceFormular/AbsenceFormular';
import { translate } from '../../utils/translate';
import { PasswordReset } from '../passwordReset/PasswordReset';
import {
	UserDataContext,
	hasUserAuthority,
	AUTHORITIES
} from '../../globalState';
import './profile.styles';

export const ProfileFunctions = () => {
	const { userData } = useContext(UserDataContext);

	return (
		<div className="profile__content__item profile__functions">
			<p className="profile__content__title">
				{translate('profile.functions.title')}
			</p>
			{hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) ? (
				<AbsenceFormular />
			) : null}
			<PasswordReset />
		</div>
	);
};
