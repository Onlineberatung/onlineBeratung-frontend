import * as React from 'react';
import { Redirect } from 'react-router-dom';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Routing } from './Routing';
import { setValueInCookie } from '../sessionCookie/accessSessionCookie';
import {
	UserDataContext,
	NotificationsContext,
	hasUserAuthority,
	AUTHORITIES,
	ConsultingTypesContext,
	LegalLinkInterface,
	RocketChatProvider,
	useTenant
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
import { useLoginBudiBase } from '../../utils/budibaseHelper';
import { useJoinGroupChat } from '../../hooks/useJoinGroupChat';

interface AuthenticatedAppProps {
	onAppReady: Function;
	onLogout: Function;
	legalLinks: Array<LegalLinkInterface>;
	spokenLanguages: string[];
}

export const AuthenticatedApp = ({
	onLogout,
	onAppReady,
	spokenLanguages,
	legalLinks
}: AuthenticatedAppProps) => {
	const { setConsultingTypes } = useContext(ConsultingTypesContext);
	const { userData, setUserData } = useContext(UserDataContext);
	const tenantData = useTenant();
	const { joinGroupChat } = useJoinGroupChat();

	const [appReady, setAppReady] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true);
	const [userDataRequested, setUserDataRequested] = useState<boolean>(false);
	const { notifications } = useContext(NotificationsContext);
	const { loginBudiBase } = useLoginBudiBase();

	useEffect(() => {
		// When the user has a group chat id that means that we need to join the user in the group chat
		const gcid = new URLSearchParams(window.location.search).get('gcid');
		joinGroupChat(gcid);
	}, [joinGroupChat]);

	useEffect(() => {
		if (tenantData?.settings?.featureToolsEnabled) {
			loginBudiBase();
		}
	}, [loginBudiBase, tenantData]);

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
							setValueInCookie(
								'useInformal',
								!userProfileData.formalLanguage ? '1' : ''
							);
							setUserData(userProfileData);
							setConsultingTypes(consultingTypes);
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
	}, [userDataRequested, setUserData, setConsultingTypes]);

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
								<Routing
									logout={handleLogout}
									legalLinks={legalLinks}
									spokenLanguages={spokenLanguages}
								/>
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
