import * as React from 'react';
import { Redirect } from 'react-router-dom';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Routing } from './Routing';
import {
	UserDataContext,
	NotificationsContext,
	hasUserAuthority,
	AUTHORITIES,
	ConsultingTypesContext,
	RocketChatProvider,
	InformalContext,
	LocaleContext
} from '../../globalState';
import { apiGetConsultingTypes, apiGetUserData } from '../../api';
import { Loading } from './Loading';
import { handleTokenRefresh } from '../auth/auth';
import { logout } from '../logout/logout';
import { Notifications } from '../notifications/Notifications';
import './authenticatedApp.styles';
import './navigation.styles';
import { requestPermissions } from '../../utils/notificationHelpers';
import { RocketChatSubscriptionsProvider } from '../../globalState/provider/RocketChatSubscriptionsProvider';
import { RocketChatUnreadProvider } from '../../globalState/provider/RocketChatUnreadProvider';
import { RocketChatPublicSettingsProvider } from '../../globalState/provider/RocketChatPublicSettingsProvider';
import { FALLBACK_LNG } from '../../i18n';
import { apiPatchUserData } from '../../api/apiPatchUserData';
import { useAppConfigContext } from '../../globalState/context/useAppConfig';

interface AuthenticatedAppProps {
	onAppReady: Function;
	onLogout: Function;
}

export const AuthenticatedApp = ({
	onLogout,
	onAppReady
}: AuthenticatedAppProps) => {
	const { settings, setServerSettings } = useAppConfigContext();
	const { setConsultingTypes } = useContext(ConsultingTypesContext);
	const { userData, setUserData } = useContext(UserDataContext);
	const { locale } = useContext(LocaleContext);
	const { setInformal } = useContext(InformalContext);

	const [appReady, setAppReady] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true);
	const [userDataRequested, setUserDataRequested] = useState<boolean>(false);

	const { notifications } = useContext(NotificationsContext);

	useEffect(() => {
		if (
			userData &&
			hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData)
		) {
			requestPermissions();
		}
	}, [userData]);

	useEffect(() => {
		if (!userDataRequested) {
			setUserDataRequested(true);
			handleTokenRefresh(false)
				.then(() => {
					Promise.all([apiGetUserData(), apiGetConsultingTypes()])
						.then(([userProfileData, consultingTypes]) => {
							// set informal / formal cookie depending on the given userdata
							setInformal(!userProfileData.formalLanguage);
							setUserData(userProfileData);
							setConsultingTypes(consultingTypes);

							// If user has changed language from default but the profile has different language in profile override it
							if (
								userProfileData.preferredLanguage !== locale &&
								locale !== FALLBACK_LNG
							) {
								return apiPatchUserData({
									preferredLanguage: locale
								});
							}
							return;
						})
						.then(() => {
							setAppReady(true);
						})
						.catch((error) => {
							setLoading(false);
							console.log(error);
						});
				})
				.catch(() => {
					setLoading(false);
				});
		}
	}, [
		userDataRequested,
		setUserData,
		setConsultingTypes,
		setInformal,
		locale,
		settings.useApiClusterSettings,
		setServerSettings
	]);

	useEffect(() => {
		onAppReady();
	}, [appReady]); // eslint-disable-line react-hooks/exhaustive-deps

	const handleLogout = useCallback(() => {
		onLogout();
		logout();
	}, [onLogout]);

	if (appReady) {
		return (
			<>
				<RocketChatProvider>
					<RocketChatPublicSettingsProvider>
						<RocketChatSubscriptionsProvider>
							<RocketChatUnreadProvider>
								<Routing logout={handleLogout} />
								{notifications && (
									<Notifications
										notifications={notifications}
									/>
								)}
							</RocketChatUnreadProvider>
						</RocketChatSubscriptionsProvider>
					</RocketChatPublicSettingsProvider>
				</RocketChatProvider>
			</>
		);
	} else if (loading) {
		return <Loading />;
	}

	return <Redirect to="/login" />;
};
