import { apiKeycloakLogout } from '../../api/apiLogoutKeycloak';
import { apiRocketchatLogout } from '../../api/apiLogoutRocketchat';
import { getTenantSettings } from '../../utils/tenantSettingsHelper';
import { budibaseLogout } from '../budibase/budibaseLogout';
import { removeAllCookies } from '../sessionCookie/accessSessionCookie';
import {
	removeRocketChatMasterKeyFromLocalStorage,
	removeTokenExpiryFromLocalStorage
} from '../sessionCookie/accessSessionLocalStorage';
import { appConfig } from '../../utils/appConfig';
import { calcomLogout } from './calcomLogout';
import { callEventListeners } from '../../utils/eventHandler';

export const EVENT_PRE_LOGOUT = 'pre_logout';

let isRequestInProgress = false;
export const logout = async (
	withRedirect: boolean = true,
	redirectUrl?: string
) => {
	if (isRequestInProgress) {
		return null;
	}

	if (await callEventListeners(EVENT_PRE_LOGOUT)) {
		return;
	}

	isRequestInProgress = true;
	const { featureAppointmentsEnabled, featureToolsEnabled } =
		getTenantSettings();

	Promise.all([
		apiRocketchatLogout(),
		apiKeycloakLogout(),
		featureAppointmentsEnabled && calcomLogout(),
		featureToolsEnabled && budibaseLogout()
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
	removeRocketChatMasterKeyFromLocalStorage();
	if (withRedirect) {
		redirectAfterLogout(redirectUrl);
	}
};

const redirectAfterLogout = (altRedirectUrl?: string) => {
	const redirectUrl = altRedirectUrl
		? altRedirectUrl
		: appConfig.urls.toEntry;
	setTimeout(() => {
		window.location.href = redirectUrl;
	}, 1000);
};
