import {
	AUTHORITIES,
	hasUserAuthority,
	ListItemInterface,
	UserDataInterface
} from '../globalState';

export const showAppointmentsMenu = (
	userData: UserDataInterface,
	sessions: ListItemInterface[]
) => {
	return (
		userData.appointmentFeatureEnabled &&
		(hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) ||
			!!sessions[0]?.consultant)
	);
};
