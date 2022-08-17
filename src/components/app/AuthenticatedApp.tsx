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
	AppLanguageContext
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
import { config } from '../../resources/scripts/config';
import { apiPatchUserData } from '../../api/apiPatchUserData';

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

	const [appReady, setAppReady] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true);
	const [userDataRequested, setUserDataRequested] = useState<boolean>(false);

	const { notifications } = useContext(NotificationsContext);
	const { appLanguage, setAppLanguage } = useContext(AppLanguageContext);

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
							console.log(
								'ddd',
								JSON.parse(localStorage.getItem(`appLanguage`))
									.short
							);
							// if (
							// 	userProfileData.preferredLanguage !==
							// 	JSON.parse(localStorage.getItem(`appLanguage`))
							// 		.short
							// ) {
							// 	const updatedUserData = { ...userData };
							// 	updatedUserData.preferredLanguage = JSON.parse(
							// 		localStorage.getItem(`appLanguage`)
							// 	).short;
							// 	apiPatchUserData(updatedUserData)
							// 		.then(() => {
							// 			setUserData(updatedUserData);
							// 		})
							// 		.catch((error) => {
							// 			console.log(error);
							// 		});
							// }
							setAppLanguage(
								config.languages.find((language) => {
									return (
										language.short ===
										userProfileData.preferredLanguage
									);
								})
							);
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
