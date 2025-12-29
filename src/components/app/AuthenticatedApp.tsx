import './authenticatedApp.styles';
import './navigation.styles';

import * as React from 'react';
import {
	useCallback,
	useContext,
	useEffect,
	useState
} from 'react';

import { Redirect } from 'react-router-dom';

import { apiGetConsultingTypes } from '../../api';
import {
	AUTHORITIES,
	ConsultingTypesContext,
	hasUserAuthority,
	InformalContext,
	LocaleContext,
	RocketChatProvider,
	UserDataContext
} from '../../globalState';
import {
	RocketChatPublicSettingsProvider
} from '../../globalState/provider/RocketChatPublicSettingsProvider';
import {
	RocketChatSubscriptionsProvider
} from '../../globalState/provider/RocketChatSubscriptionsProvider';
import {
	RocketChatGetUserRolesProvider
} from '../../globalState/provider/RocketChatSytemUsersProvider';
import {
	RocketChatUnreadProvider
} from '../../globalState/provider/RocketChatUnreadProvider';
import {
	RocketChatUserStatusProvider
} from '../../globalState/provider/RocketChatUserStatusProvider';
import { useAppConfig } from '../../hooks/useAppConfig';
import { useJoinGroupChat } from '../../hooks/useJoinGroupChat';
import { requestPermissions } from '../../utils/notificationHelpers';
import { handleTokenRefresh } from '../auth/auth';
import { logout } from '../logout/logout';
import { Loading } from './Loading';
import { Routing } from './Routing';

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
										<Routing logout={handleLogout} />
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
