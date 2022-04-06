import * as React from 'react';
import {
	ComponentType,
	useCallback,
	useContext,
	useEffect,
	useState
} from 'react';
import { Routing } from './Routing';
import { config } from '../../resources/scripts/config';
import {
	setValueInCookie,
	getValueFromCookie
} from '../sessionCookie/accessSessionCookie';
import {
	UserDataContext,
	AuthDataContext,
	AuthDataInterface,
	NotificationsContext,
	hasUserAuthority,
	AUTHORITIES,
	SessionsDataContext,
	ConsultingTypesContext
} from '../../globalState';
import {
	apiFinishAnonymousConversation,
	apiGetConsultingTypes,
	apiGetUserData
} from '../../api';
import { Loading } from './Loading';
import { handleTokenRefresh } from '../auth/auth';
import { logout } from '../logout/logout';
import { Notifications } from '../notifications/Notifications';
import { LegalInformationLinksProps } from '../login/LegalInformationLinks';
import './authenticatedApp.styles';
import './navigation.styles';

interface AuthenticatedAppProps {
	onAppReady: Function;
	onLogout: Function;
	legalComponent: ComponentType<LegalInformationLinksProps>;
}

export const AuthenticatedApp = ({
	onLogout,
	onAppReady,
	legalComponent
}: AuthenticatedAppProps) => {
	const { setConsultingTypes } = useContext(ConsultingTypesContext);
	const { setAuthData } = useContext(AuthDataContext);
	const [authDataRequested, setAuthDataRequested] = useState<boolean>(false);
	const { userData, setUserData } = useContext(UserDataContext);
	const [appReady, setAppReady] = useState<boolean>(false);
	const [userDataRequested, setUserDataRequested] = useState<boolean>(false);
	const { notifications } = useContext(NotificationsContext);
	const { sessionsData } = useContext(SessionsDataContext);
	const sessionId = sessionsData?.mySessions?.[0]?.session?.id;

	if (!authDataRequested) {
		setAuthDataRequested(true);
		const currentAuthData: AuthDataInterface = {
			keycloakRefreshToken: getValueFromCookie('refreshToken'),
			keycloakToken: getValueFromCookie('keycloak'),
			rocketchatToken: getValueFromCookie('rc_token'),
			rocketchatUserId: getValueFromCookie('rc_uid')
		};
		setAuthData(currentAuthData);
	}

	if (!userDataRequested) {
		setUserDataRequested(true);
		handleTokenRefresh().then(() => {
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
					window.location.href = config.urls.toEntry;
					console.log(error);
				});
		});
	}

	useEffect(() => {
		onAppReady();
	}, [appReady]); // eslint-disable-line react-hooks/exhaustive-deps

	const handleLogout = useCallback(() => {
		if (hasUserAuthority(AUTHORITIES.ANONYMOUS_DEFAULT, userData)) {
			apiFinishAnonymousConversation(sessionId).catch((error) => {
				console.error(error);
			});
		}
		onLogout();
		logout();
	}, [onLogout, sessionId, userData]);

	if (appReady) {
		return (
			<>
				<Routing
					logout={handleLogout}
					legalComponent={legalComponent}
				/>
				{notifications && (
					<Notifications notifications={notifications} />
				)}
			</>
		);
	}

	return <Loading />;
};
