import { apiKeycloakLogout } from '../../api/apiLogoutKeycloak';
import { apiRocketchatLogout } from '../../api/apiLogoutRocketchat';
import { config } from '../../resources/scripts/config';
import { getTenantSettings } from '../../utils/tenantSettingsHelper';
import { calcomLogout } from '../booking/settings/calcomLogout';
import { budibaseLogout } from '../budibase/budibaseLogout';
import { removeAllCookies } from '../sessionCookie/accessSessionCookie';
import { removeTokenExpiryFromLocalStorage } from '../sessionCookie/accessSessionLocalStorage';

let isRequestInProgress = false;
export const logout = (withRedirect: boolean = true, redirectUrl?: string) => {
	if (isRequestInProgress) {
		return null;
	}
	isRequestInProgress = true;
	const { featureAppointmentsEnabled, featureToolsEnabled } =
		getTenantSettings();

	Promise.all([
		apiRocketchatLogout(),
		apiKeycloakLogout(),
		featureAppointmentsEnabled ? calcomLogout() : null,
		featureToolsEnabled ? budibaseLogout() : null
	]).finally(() => {
		invalidateCookies(withRedirect, redirectUrl);
	});
};

const invalidateCookies = (
	withRedirect: boolean = true,
	redirectUrl?: string
) => {
	removeAllCookies();
	removeTokenExpiryFromLocalStorage();
	if (withRedirect) {
		redirectAfterLogout(redirectUrl);
	}
};

const redirectAfterLogout = (altRedirectUrl?: string) => {
	const redirectUrl = altRedirectUrl ? altRedirectUrl : config.urls.toEntry;
	setTimeout(() => {
		window.location.href = redirectUrl;
	}, 1000);
};
