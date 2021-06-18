import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { Routing } from './Routing';
import { config } from '../../resources/scripts/config';
import {
	setTokenInCookie,
	getTokenFromCookie
} from '../sessionCookie/accessSessionCookie';
import {
	UserDataContext,
	AuthDataContext,
	AuthDataInterface,
	NotificationsContext,
	ConsultingTypesContext
} from '../../globalState';
import { apiGetConsultingTypes, apiGetUserData } from '../../api';
import { Loading } from './Loading';
import { handleTokenRefresh } from '../auth/auth';
import { logout } from '../logout/logout';
import { Notifications } from '../notifications/Notifications';
import './authenticatedApp.styles';
import './navigation.styles';

interface AuthenticatedAppProps {
	onAppReady: Function;
	onLogout: Function;
}

export const AuthenticatedApp = (props: AuthenticatedAppProps) => {
	const { setConsultingTypes } = useContext(ConsultingTypesContext);
	const { setAuthData } = useContext(AuthDataContext);
	const [authDataRequested, setAuthDataRequested] = useState<boolean>(false);
	const { setUserData } = useContext(UserDataContext);
	const [appReady, setAppReady] = useState<boolean>(false);
	const [userDataRequested, setUserDataRequested] = useState<boolean>(false);
	const { notifications } = useContext(NotificationsContext);

	if (!authDataRequested) {
		setAuthDataRequested(true);
		const currentAuthData: AuthDataInterface = {
			keycloakRefreshToken: getTokenFromCookie('refreshToken'),
			keycloakToken: getTokenFromCookie('keycloak'),
			rocketchatToken: getTokenFromCookie('rc_token'),
			rocketchatUserId: getTokenFromCookie('rc_uid')
		};
		setAuthData(currentAuthData);
	}

	if (!userDataRequested) {
		setUserDataRequested(true);
		handleTokenRefresh().then(() => {
			Promise.all([apiGetUserData(), apiGetConsultingTypes()])
				.then(([userProfileData, consultingTypes]) => {
					// set informal / formal cookie depending on the given userdata
					setTokenInCookie(
						'useInformal',
						!userProfileData.formalLanguage ? '1' : ''
					);
					setUserData(userProfileData);
					setConsultingTypes(consultingTypes);
					setAppReady(true);
				})
				.catch((error) => {
					window.location.href = config.urls.toLogin;
					console.log(error);
				});
		});
	}

	useEffect(() => {
		props.onAppReady();
	}, [appReady]); // eslint-disable-line react-hooks/exhaustive-deps

	const handleLogout = () => {
		props.onLogout();
		logout();
	};

	if (appReady) {
		return (
			<>
				<Routing logout={handleLogout} />
				{notifications && (
					<Notifications notifications={notifications} />
				)}
			</>
		);
	}

	return <Loading />;
};
