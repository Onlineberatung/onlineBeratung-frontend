import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
	UserDataContext,
	useConsultingTypes,
	useConsultingType
} from '../../globalState';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import { SelectDropdown, SelectDropdownItem } from '../select/SelectDropdown';
import {
	consultingTypeSelectOptionsSet,
	getConsultingTypesForRegistrationStatus,
	REGISTRATION_STATUS_KEYS
} from './profileHelpers';
import { apiRegistrationNewConsultingTypes } from '../../api';
import { Overlay, OVERLAY_FUNCTIONS, OverlayItem } from '../overlay/Overlay';
import { logout } from '../logout/logout';
import { mobileListView } from '../app/navigationHandler';
import { AgencySelection } from '../agencySelection/AgencySelection';
import { Text, LABEL_TYPES } from '../text/Text';
import { Headline } from '../headline/Headline';
import { AskerRegistrationExternalAgencyOverlay } from './AskerRegistrationExternalAgencyOverlay';
import { useTranslation } from 'react-i18next';
import CheckIcon from '../../resources/img/illustrations/check.svg?react';
import XIcon from '../../resources/img/illustrations/x.svg?react';
import { Box as MuiBox, Stack } from '@mui/material';

export const AskerRegistration: React.FC = () => {
	const { t: translate } = useTranslation(['common', 'consultingTypes']);
	const history = useHistory();

	const { userData, reloadUserData } = useContext(UserDataContext);
	const [isButtonDisabled, setIsButtonDisabled] = useState(true);
	const [selectedConsultingTypeId, setSelectedConsultingTypeId] =
		useState<number>(null);
	const [selectedAgency, setSelectedAgency] = useState<any>({});
	const [successOverlayActive, setSuccessOverlayActive] = useState(false);
	const [successOverlayItem, setSuccessOverlayItem] =
		useState<OverlayItem>(null);
	const [externalAgencyOverlayActive, setExternalAgencyOverlayActive] =
		useState(false);
	const [sessionId, setSessionId] = useState(null);
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);
	const consultingTypes = useConsultingTypes();
	const selectedConsultingType = useConsultingType(selectedConsultingTypeId);

	const buttonSetRegistration: ButtonItem = {
		label: translate('profile.data.register.button.label'),
		type: BUTTON_TYPES.LINK
	};

	const overlayItemNewRegistrationSuccess: OverlayItem = {
		svg: CheckIcon,
		headline: translate('profile.data.registerSuccess.overlay.headline'),
		buttonSet: [
			{
				label: translate(
					'profile.data.registerSuccess.overlay.button1.label'
				),
				function: OVERLAY_FUNCTIONS.REDIRECT,
				type: BUTTON_TYPES.PRIMARY
			},
			{
				label: translate(
					'profile.data.registerSuccess.overlay.button2.label'
				),
				function: OVERLAY_FUNCTIONS.LOGOUT,
				type: BUTTON_TYPES.LINK
			}
		]
	};

	const overlayItemNewRegistrationError: OverlayItem = {
		svg: XIcon,
		illustrationBackground: 'error',
		headline: translate('profile.data.registerError.overlay.headline'),
		buttonSet: [
			{
				label: translate(
					'profile.data.registerError.overlay.button.label'
				),
				function: OVERLAY_FUNCTIONS.CLOSE,
				type: BUTTON_TYPES.PRIMARY
			}
		]
	};

	const isAllRequiredDataSet = () =>
		selectedConsultingTypeId != null && selectedAgency;

	useEffect(() => {
		if (isAllRequiredDataSet()) {
			setIsButtonDisabled(false);
		} else {
			setIsButtonDisabled(true);
		}
	}, [selectedAgency]); // eslint-disable-line react-hooks/exhaustive-deps

	const handleConsultingTypeSelect = (selectedOption) => {
		setSelectedConsultingTypeId(parseInt(selectedOption.value));
	};

	const getOptionOfSelectedConsultingType = () => {
		return translateConsultingType(userData, consultingTypes).filter(
			(option) => parseInt(option.value) === selectedConsultingTypeId
		)[0];
	};

	const translateConsultingType = (userData, consultingTypes) => {
		return consultingTypeSelectOptionsSet(userData, consultingTypes).map(
			(option) => ({
				...option,
				label: translate(
					[
						`consultingType.${option.id}.titles.registrationDropdown`,
						`consultingType.fallback.titles.registrationDropdown`,
						option.label
					],
					{ ns: 'consultingTypes' }
				)
			})
		);
	};

	const consultingTypesDropdown: SelectDropdownItem = {
		id: 'consultingTypeSelect',
		selectedOptions: translateConsultingType(userData, consultingTypes),
		handleDropdownSelect: handleConsultingTypeSelect,
		selectInputLabel: translate(
			'profile.data.register.consultingTypeSelect.label'
		),
		useIconOption: false,
		isSearchable: false,
		menuPlacement: 'bottom',
		defaultValue: getOptionOfSelectedConsultingType()
	};

	const handleRegistration = () => {
		if (isRequestInProgress) {
			return null;
		}

		if (isAllRequiredDataSet()) {
			if (selectedAgency.external) {
				if (selectedAgency.url) {
					setExternalAgencyOverlayActive(true);
				} else {
					console.error(
						`External agency with id ${selectedAgency.id} doesn't have a url set.`
					);
				}
				return;
			}

			setIsRequestInProgress(true);

			apiRegistrationNewConsultingTypes(
				selectedConsultingTypeId,
				selectedAgency.id,
				selectedAgency.postcode
			)
				.then((response) => {
					let overlayItem = overlayItemNewRegistrationSuccess;
					if (selectedConsultingType?.groupChat.isGroupChat) {
						overlayItem.buttonSet[0].label = translate(
							'profile.data.registerSuccess.overlay.groupChats.button.label.'
						);
					} else {
						setSessionId(response.sessionId);
					}
					setSuccessOverlayItem(overlayItem);
					setSuccessOverlayActive(true);
					setIsRequestInProgress(false);
				})
				.catch((error) => {
					setSuccessOverlayItem(overlayItemNewRegistrationError);
					setSuccessOverlayActive(true);
					setIsRequestInProgress(false);
				});
		}
	};

	const handleSuccessOverlayAction = (buttonFunction: string) => {
		reloadUserData().catch(console.log);

		if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECT) {
			mobileListView();
			if (!sessionId) {
				history.push({
					pathname: `/sessions/user/view`
				});
				return;
			}

			history.push({
				pathname: `/sessions/user/view/write/${sessionId}`
			});
		} else if (buttonFunction === OVERLAY_FUNCTIONS.CLOSE) {
			setSuccessOverlayItem({});
			setSuccessOverlayActive(false);
			setSelectedConsultingTypeId(null);
		} else {
			logout();
		}
	};

	const handleExternalAgencyOverlayAction = () => {
		setExternalAgencyOverlayActive(false);
	};

	const registeredConsultingTypes = userData
		? getConsultingTypesForRegistrationStatus(
				userData,
				consultingTypes,
				REGISTRATION_STATUS_KEYS.REGISTERED
			)
		: null;
	const isOnlyRegisteredForGroupChats =
		registeredConsultingTypes?.length === 1 &&
		consultingTypes.find(
			(cur) =>
				cur.id === parseInt(registeredConsultingTypes[0].consultingType)
		)?.groupChat.isGroupChat &&
		selectedConsultingType &&
		!selectedConsultingType.groupChat.isGroupChat;

	return (
		<MuiBox>
			<Stack spacing={2}>
				<Headline
					text={translate('profile.data.register.headline')}
					semanticLevel="5"
				/>
				<Stack spacing={2}>
					<SelectDropdown {...consultingTypesDropdown} />
					<Text
						labelType={LABEL_TYPES.NOTICE}
						text={translate(
							'profile.data.register.consultingModeInfo.singleChats'
						)}
						type="infoSmall"
					/>
				</Stack>
				{selectedConsultingType && (
					<AgencySelection
						consultingType={selectedConsultingType}
						onAgencyChange={(agency) => setSelectedAgency(agency)}
						isProfileView={true}
						agencySelectionNote={
							selectedConsultingType?.registration?.notes
								?.agencySelection
						}
					/>
				)}
				<Stack spacing={2} justifyContent="flex-end">
					<Button
						item={buttonSetRegistration}
						buttonHandle={handleRegistration}
						disabled={isButtonDisabled}
					/>
				</Stack>
			</Stack>
			{successOverlayActive && (
				<Overlay
					item={successOverlayItem}
					handleOverlay={handleSuccessOverlayAction}
				/>
			)}
			{externalAgencyOverlayActive && (
				<AskerRegistrationExternalAgencyOverlay
					selectedAgency={selectedAgency}
					consultingType={selectedConsultingType}
					handleOverlayAction={handleExternalAgencyOverlayAction}
				/>
			)}
		</MuiBox>
	);
};
