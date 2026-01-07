import { getValueFromCookie } from '../components/sessionCookie/accessSessionCookie';
import { AUTHORITIES, hasUserAuthority } from '../globalState';
import {
	ConsultingTypeBasicInterface,
	UserDataInterface
} from '../globalState/interfaces';

export const currentUserWasVideoCallInitiator = (initiatorRcUserId: string) =>
	initiatorRcUserId === getValueFromCookie('rc_uid');

const currentUserIsAsker = (askerRcUserId: string) =>
	askerRcUserId === getValueFromCookie('rc_uid');

export const currentUserIsTeamConsultant = (
	initiatorRcUserId: string,
	askerRcUserId: string
) =>
	!currentUserWasVideoCallInitiator(initiatorRcUserId) &&
	!currentUserIsAsker(askerRcUserId);

export const hasVideoCallFeature = (userData, consultingTypes) =>
	userData &&
	hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) &&
	userData.agencies.some(
		(agency) =>
			!!(consultingTypes || []).find(
				(consultingType) =>
					consultingType.id === agency.consultingType &&
					consultingType.isVideoCallAllowed
			)
	);

export const hasVideoCallAbility = (
	userData: UserDataInterface,
	consultingTypes: ConsultingTypeBasicInterface[]
) => {
	// check if User can be called by any of his registered agencies
	if (hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData)) {
		const registeredConsultingTypes = Object.values(
			userData.consultingTypes
		)
			.filter((el) => el.isRegistered)
			.map((el) => el.agency.consultingType);
		const userCanBeCalled = registeredConsultingTypes.some((el) =>
			Object.values(consultingTypes).some(
				(consultingType) =>
					consultingType.id === el &&
					consultingType.isVideoCallAllowed
			)
		);
		if (userCanBeCalled) {
			return true;
		}
	} else if (hasVideoCallFeature(userData, consultingTypes)) {
		return true;
	}
	return false;
};
