import * as React from 'react';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
	AUTHORITIES,
	E2EEContext,
	hasUserAuthority,
	SessionTypeContext,
	useConsultingType,
	UserDataContext,
	ActiveSessionContext
} from '../../globalState';
import { mobileListView } from '../app/navigationHandler';
import { SessionHeaderComponent } from '../sessionHeader/SessionHeaderComponent';
import { SESSION_LIST_TAB } from '../session/sessionHelpers';
import {
	apiGetGroupChatInfo,
	apiPutGroupChat,
	FETCH_ERRORS,
	GROUP_CHAT_API
} from '../../api';
import { Overlay, OVERLAY_FUNCTIONS, OverlayItem } from '../overlay/Overlay';
import { Button, BUTTON_TYPES, ButtonItem } from '../button/Button';
import { logout } from '../logout/logout';
import { Redirect } from 'react-router-dom';
import { ReactComponent as WarningIcon } from '../../resources/img/icons/i.svg';
import './joinChat.styles';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import { ReactComponent as XIcon } from '../../resources/img/illustrations/x.svg';
import { useE2EE } from '../../hooks/useE2EE';
import { encryptForParticipant } from '../../utils/encryptionHelpers';
import { apiRocketChatUpdateGroupKey } from '../../api/apiRocketChatUpdateGroupKey';
import { apiRocketChatSetRoomKeyID } from '../../api/apiRocketChatSetRoomKeyID';
import { getValueFromCookie } from '../sessionCookie/accessSessionCookie';
import {
	ALIAS_MESSAGE_TYPES,
	apiSendAliasMessage
} from '../../api/apiSendAliasMessage';
import { useWatcher } from '../../hooks/useWatcher';
import { useSearchParam } from '../../hooks/useSearchParams';
import { useTranslation } from 'react-i18next';
import { useTimeoutOverlay } from '../../hooks/useTimeoutOverlay';
import { OVERLAY_REQUEST } from '../../globalState/interfaces/AppConfig/OverlaysConfigInterface';
import { FALLBACK_LNG } from '../../i18n';

interface JoinGroupChatViewProps {
	forceBannedOverlay?: boolean;
	bannedUsers?: string[];
}

export const JoinGroupChatView = ({
	forceBannedOverlay = false,
	bannedUsers = []
}: JoinGroupChatViewProps) => {
	const { t: translate } = useTranslation(['common', 'consultingTypes']);
	const { activeSession, reloadActiveSession } =
		useContext(ActiveSessionContext);
	const { userData } = useContext(UserDataContext);
	const [overlayItem, setOverlayItem] = useState<OverlayItem>(null);
	const [overlayActive, setOverlayActive] = useState(false);
	const [redirectToSessionsList, setRedirectToSessionsList] = useState(false);
	const consultingType = useConsultingType(activeSession.item.consultingType);

	const [isButtonDisabled, setIsButtonDisabled] = useState(false);
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);
	const sessionListTab = useSearchParam<SESSION_LIST_TAB>('sessionListTab');
	const getSessionListTab = () =>
		`${sessionListTab ? `?sessionListTab=${sessionListTab}` : ''}`;

	const { isE2eeEnabled } = useContext(E2EEContext);
	const { path: listPath } = useContext(SessionTypeContext);
	const { keyID, sessionKeyExportedString, encrypted, ready } = useE2EE(
		activeSession.rid
	);

	const { visible: requestOverlayVisible, overlay: requestOverlay } =
		useTimeoutOverlay(
			// Disable the request overlay if upload is in progess because upload progress is shown in the ui already
			isRequestInProgress,
			null,
			null,
			null,
			2500
		);

	const joinButtonItem: ButtonItem = useMemo(
		() => ({
			label: translate('groupChat.join.button.label.join'),
			type: BUTTON_TYPES.PRIMARY
		}),
		[translate]
	);

	const startButtonItem: ButtonItem = useMemo(
		() => ({
			label: translate('groupChat.join.button.label.start'),
			type: BUTTON_TYPES.PRIMARY
		}),
		[translate]
	);

	const [buttonItem, setButtonItem] = useState(joinButtonItem);

	const startJoinGroupChatErrorOverlay: OverlayItem = {
		svg: XIcon,
		illustrationBackground: 'error',
		headline: translate('groupChat.joinError.overlay.headline'),
		buttonSet: [
			{
				label: translate('groupChat.joinError.overlay.buttonLabel'),
				function: OVERLAY_FUNCTIONS.CLOSE,
				type: BUTTON_TYPES.PRIMARY
			}
		]
	};

	const joinGroupChatClosedErrorOverlay: OverlayItem = useMemo(
		() => ({
			svg: XIcon,
			illustrationBackground: 'error',
			headline: translate('groupChat.join.chatClosedOverlay.headline'),
			buttonSet: [
				{
					label: translate(
						'groupChat.join.chatClosedOverlay.button1Label'
					),
					function: OVERLAY_FUNCTIONS.REDIRECT,
					type: BUTTON_TYPES.PRIMARY
				},
				{
					label: translate(
						'groupChat.join.chatClosedOverlay.button2Label'
					),
					function: OVERLAY_FUNCTIONS.LOGOUT,
					type: BUTTON_TYPES.SECONDARY
				}
			]
		}),
		[translate]
	);

	const bannedUserOverlay: OverlayItem = useMemo(
		() => ({
			svg: XIcon,
			illustrationBackground: 'large',
			headline: translate('banUser.banned.headline'),
			copy: translate('banUser.banned.info')
		}),
		[translate]
	);

	const handleEncryptRoom = useCallback(async () => {
		if (!isE2eeEnabled || encrypted || activeSession?.item?.active) {
			return;
		}

		const rcUserId = getValueFromCookie('rc_uid');

		const userKey = await encryptForParticipant(
			sessionStorage.getItem('public_key'),
			keyID,
			sessionKeyExportedString
		);

		await apiRocketChatUpdateGroupKey(rcUserId, activeSession.rid, userKey);

		// Set Room Key ID at the very end because if something failed before it will still be repairable
		// After room key is set the room is encrypted and the room key could not be set again.
		try {
			await apiRocketChatSetRoomKeyID(activeSession.rid, keyID);
			await apiSendAliasMessage({
				rcGroupId: activeSession.rid,
				type: ALIAS_MESSAGE_TYPES.E2EE_ACTIVATED
			});
		} catch (e) {
			console.error(e);
			return;
		}
	}, [
		isE2eeEnabled,
		encrypted,
		activeSession?.item?.active,
		activeSession.rid,
		keyID,
		sessionKeyExportedString
	]);
	/* E2EE END */

	const updateGroupChatInfo = useCallback(() => {
		return apiGetGroupChatInfo(activeSession.item.id)
			.then((res) => {
				if (activeSession.item.active !== res.active) {
					reloadActiveSession();
				}
			})
			.catch((error) => {
				if (error.message === FETCH_ERRORS.NO_MATCH) {
					setOverlayItem(joinGroupChatClosedErrorOverlay);
					setOverlayActive(true);
				}
			});
	}, [
		activeSession.item.active,
		activeSession.item.id,
		reloadActiveSession,
		joinGroupChatClosedErrorOverlay
	]);

	const [startWatcher, stopWatcher, isWatcherRunning] = useWatcher(
		updateGroupChatInfo,
		5000
	);

	useEffect(() => {
		if (!isWatcherRunning) {
			startWatcher();
		}

		return () => {
			if (isWatcherRunning) {
				stopWatcher();
			}
		};
	}, [
		consultingType?.groupChat.isGroupChat,
		isWatcherRunning,
		startWatcher,
		stopWatcher
	]);

	useEffect(() => {
		if (
			hasUserAuthority(AUTHORITIES.CREATE_NEW_CHAT, userData) &&
			!activeSession.item.active
		) {
			setButtonItem(startButtonItem);
		} else {
			setButtonItem(joinButtonItem);
		}
	}, [activeSession.item.active, userData, startButtonItem, joinButtonItem]);

	useEffect(() => {
		if (
			hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) ||
			!hasUserAuthority(AUTHORITIES.CREATE_NEW_CHAT, userData)
		) {
			setIsButtonDisabled(
				!activeSession.item.active ||
					bannedUsers.includes(userData.userName) ||
					!ready
			);
		}
	}, [activeSession.item.active, bannedUsers, ready, userData]);

	const handleOverlayClose = () => {
		setOverlayActive(false);
	};

	const handleButtonClick = () => {
		if (bannedUsers.includes(userData.userName)) {
			setOverlayItem(bannedUserOverlay);
			setOverlayActive(true);
			return;
		}
		if (isRequestInProgress) {
			return;
		}
		setIsRequestInProgress(true);
		const groupChatApiCall =
			hasUserAuthority(AUTHORITIES.CREATE_NEW_CHAT, userData) &&
			!activeSession.item.active
				? GROUP_CHAT_API.START
				: GROUP_CHAT_API.JOIN;
		apiPutGroupChat(activeSession.item.id, groupChatApiCall)
			.then(
				() =>
					groupChatApiCall === GROUP_CHAT_API.START &&
					handleEncryptRoom()
			)
			.then(() => reloadActiveSession())
			.catch(() => {
				setOverlayItem(startJoinGroupChatErrorOverlay);
				setOverlayActive(true);
			})
			.finally(() => {
				setIsRequestInProgress(false);
			});
	};

	const handleOverlayAction = (buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.CLOSE) {
			setOverlayActive(false);
			setOverlayItem({});
		} else if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECT) {
			setRedirectToSessionsList(true);
		} else if (buttonFunction === OVERLAY_FUNCTIONS.LOGOUT) {
			logout();
		}
		setIsRequestInProgress(false);
	};

	useEffect(() => {
		if (forceBannedOverlay) {
			setOverlayItem(bannedUserOverlay);
			setOverlayActive(true);
		}
	}, [forceBannedOverlay, bannedUserOverlay]);

	const groupChatRules = useMemo(() => {
		const transKeys = [
			`consultingType.${consultingType?.id ?? 'noConsultingType'}.groupChatRules`,
			`consultingType.fallback.groupChatRules`
		];

		// Get groupChat rules from fallback_lng to get the count and make i18n
		// fallback chain working for non translated rules (de -> de@informal)
		const groupChatRuleKeys = Object.keys(
			translate(transKeys, {
				returnObjects: true,
				defaultValue: consultingType?.groupChat?.groupChatRules || [],
				lng: FALLBACK_LNG,
				ns: 'consultingTypes'
			})
		);

		// Then translate every rule by its own translation
		return groupChatRuleKeys.map((key) =>
			translate(
				transKeys.map((transKey) => `${transKey}.${key}`),
				{ ns: 'consultingTypes' }
			)
		);
	}, [
		consultingType?.groupChat?.groupChatRules,
		consultingType?.id,
		translate
	]);

	if (redirectToSessionsList) {
		mobileListView();
		return <Redirect to={listPath + getSessionListTab()} />;
	}

	return (
		<div className="session joinChat">
			<SessionHeaderComponent
				isJoinGroupChatView={true}
				bannedUsers={bannedUsers}
			/>
			<div className="joinChat__content session__content">
				<Headline
					text={translate('groupChat.join.content.headline')}
					semanticLevel="4"
				/>
				{groupChatRules.map((groupChatRuleText, i) => (
					<Text text={groupChatRuleText} type="standard" key={i} />
				))}
			</div>
			<div className="joinChat__button-container">
				{!hasUserAuthority(AUTHORITIES.CREATE_NEW_CHAT, userData) &&
					!activeSession.item.active && (
						<p className="joinChat__warning-message">
							<WarningIcon />
							{translate(
								hasUserAuthority(
									AUTHORITIES.ASKER_DEFAULT,
									userData
								)
									? 'groupChat.join.warning.message'
									: 'groupChat.join.warning.consultant.message'
							)}
						</p>
					)}
				<Button
					item={buttonItem}
					buttonHandle={handleButtonClick}
					disabled={isButtonDisabled}
				/>
			</div>

			{requestOverlayVisible && (
				<Overlay item={requestOverlay} name={OVERLAY_REQUEST} />
			)}

			{overlayActive && (
				<Overlay
					item={overlayItem}
					handleOverlay={handleOverlayAction}
					handleOverlayClose={handleOverlayClose}
				/>
			)}
		</div>
	);
};
