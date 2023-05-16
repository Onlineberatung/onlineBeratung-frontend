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
import { apiGetConsultingTypes } from '../../api';
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
import { RocketChatGetUserRolesProvider } from '../../globalState/provider/RocketChatSytemUsersProvider';
import { useJoinGroupChat } from '../../hooks/useJoinGroupChat';
import { RocketChatUserStatusProvider } from '../../globalState/provider/RocketChatUserStatusProvider';
import { useAppConfig } from '../../hooks/useAppConfig';
import { E2EEncryptionSupportBanner } from '../E2EEncryptionSupportBanner/E2EEncryptionSupportBanner';

interface AuthenticatedAppProps {
	onAppReady: Function;
	onLogout: Function;
}

export const AuthenticatedApp = ({
	onLogout,
	onAppReady
}: AuthenticatedAppProps) => {
	const { releaseToggles } = useAppConfig();
	const { setConsultingTypes } = useContext(ConsultingTypesContext);
	const { userData, reloadUserData } = useContext(UserDataContext);
	const { locale, setLocale } = useContext(LocaleContext);
	const { setInformal } = useContext(InformalContext);
	const { joinGroupChat } = useJoinGroupChat();

	const [appReady, setAppReady] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true);
	const [userDataRequested, setUserDataRequested] = useState<boolean>(false);
	const { notifications } = useContext(NotificationsContext);

	useEffect(() => {
		// When the user has a group chat id that means that we need to join the user in the group chat
		const gcid = new URLSearchParams(window.location.search).get('gcid');
		joinGroupChat(gcid);
	}, [joinGroupChat]);

	useEffect(() => {
		if (
			!releaseToggles?.enableNewNotifications &&
			userData &&
			hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData)
		) {
			requestPermissions();
		}
	}, [releaseToggles?.enableNewNotifications, userData]);

	useEffect(() => {
		if (!userDataRequested) {
			setUserDataRequested(true);

			handleTokenRefresh(false)
				.then(() => {
					Promise.all([reloadUserData(), apiGetConsultingTypes()])
						.then(([userProfileData, consultingTypes]) => {
							// set informal / formal cookie depending on the given userdata
							setInformal(!userProfileData.formalLanguage);
							setConsultingTypes(consultingTypes);

							if (userProfileData.preferredLanguage) {
								setLocale(userProfileData.preferredLanguage);
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
		locale,
		setConsultingTypes,
		setInformal,
		setLocale,
		reloadUserData,
		userDataRequested
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
					<RocketChatGetUserRolesProvider>
						<RocketChatPublicSettingsProvider>
							<RocketChatSubscriptionsProvider>
								<RocketChatUnreadProvider>
									<RocketChatUserStatusProvider>
										<E2EEncryptionSupportBanner />
										<Routing logout={handleLogout} />
										{notifications && (
											<Notifications
												notifications={notifications}
											/>
										)}
									</RocketChatUserStatusProvider>
								</RocketChatUnreadProvider>
							</RocketChatSubscriptionsProvider>
						</RocketChatPublicSettingsProvider>
					</RocketChatGetUserRolesProvider>
				</RocketChatProvider>
			</>
		);
	} else if (loading) {
		return <Loading />;
	}

	return <Redirect to="/login" />;
};
