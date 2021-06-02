import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { translate } from '../../utils/translate';
import {
	UserDataContext,
	AcceptedGroupIdContext,
	UserDataInterface,
	useConsultingTypes,
	useConsultingType
} from '../../globalState';
import { history } from '../app/app';
import { Button } from '../button/Button';
import { SelectDropdown, SelectDropdownItem } from '../select/SelectDropdown';
import {
	consultingTypeSelectOptionsSet,
	buttonSetRegistration,
	overlayItemNewRegistrationSuccess,
	overlayItemNewRegistrationError,
	getConsultingTypesForRegistrationStatus,
	REGISTRATION_STATUS_KEYS
} from './profileHelpers';
import { apiRegistrationNewConsultingTypes } from '../../api';
import {
	OverlayWrapper,
	Overlay,
	OVERLAY_FUNCTIONS,
	OverlayItem
} from '../overlay/Overlay';
import { logout } from '../logout/logout';
import {
	setProfileWrapperInactive,
	mobileListView
} from '../app/navigationHandler';
import { AgencySelection } from '../agencySelection/AgencySelection';
import './profile.styles';
import { apiGetUserData } from '../../api';
import { Text, LABEL_TYPES } from '../text/Text';
import { Headline } from '../headline/Headline';

export const AskerRegistration = () => {
	const { userData, setUserData } = useContext(UserDataContext);
	const [isButtonDisabled, setIsButtonDisabled] = useState(true);
	const [selectedConsultingTypeId, setSelectedConsultingTypeId] = useState<
		number
	>(null);
	const [selectedAgency, setSelectedAgency] = useState<any>({});
	const [overlayActive, setOverlayActive] = useState(false);
	const [overlayItem, setOverlayItem] = useState<OverlayItem>(null);
	const { setAcceptedGroupId } = useContext(AcceptedGroupIdContext);
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);
	const consultingTypes = useConsultingTypes();
	const selectedConsultingType = useConsultingType(selectedConsultingTypeId);

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
		return consultingTypeSelectOptionsSet(userData, consultingTypes).filter(
			(option) => parseInt(option.value) === selectedConsultingTypeId
		)[0];
	};

	const consultingTypesDropdown: SelectDropdownItem = {
		id: 'consultingTypeSelect',
		selectedOptions: consultingTypeSelectOptionsSet(
			userData,
			consultingTypes
		),
		handleDropdownSelect: handleConsultingTypeSelect,
		selectInputLabel: translate(
			'profile.data.register.consultingTypeSelect.label'
		),
		useIconOption: false,
		isSearchable: false,
		menuPlacement: 'top',
		defaultValue: getOptionOfSelectedConsultingType()
	};

	const handleRegistration = () => {
		if (isRequestInProgress) {
			return null;
		}
		setIsRequestInProgress(true);

		if (isAllRequiredDataSet()) {
			apiRegistrationNewConsultingTypes(
				selectedConsultingTypeId,
				selectedAgency.id,
				selectedAgency.postcode
			)
				.then((response) => {
					let overlayItem = overlayItemNewRegistrationSuccess;
					if (selectedConsultingType?.groupChat.isGroupChat) {
						overlayItem.buttonSet[0].label = translate(
							'profile.data.registerSuccess.overlay.button1Label.groupChats'
						);
					} else {
						setAcceptedGroupId(response.sessionId);
					}
					setOverlayItem(overlayItem);
					setOverlayActive(true);
					setIsRequestInProgress(false);
				})
				.catch((error) => {
					setOverlayItem(overlayItemNewRegistrationError);
					setOverlayActive(true);
					setIsRequestInProgress(false);
				});
		}
	};

	const handleOverlayAction = (buttonFunction: string) => {
		apiGetUserData()
			.then((userProfileData: UserDataInterface) => {
				setUserData(userProfileData);
			})
			.catch((error) => {
				console.log(error);
			});
		if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECT) {
			setProfileWrapperInactive();
			mobileListView();
			history.push({
				pathname: `/sessions/user/view`
			});
		} else if (buttonFunction === OVERLAY_FUNCTIONS.CLOSE) {
			setOverlayItem({});
			setOverlayActive(false);
			setSelectedConsultingTypeId(null);
		} else {
			logout();
		}
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
		!selectedConsultingType.groupChat.isGroupChat;

	return (
		<div className="profile__data__itemWrapper askerRegistration">
			<div className="profile__content__title">
				<Headline
					text={translate('profile.data.register.headline')}
					semanticLevel="5"
				/>
			</div>
			{isOnlyRegisteredForGroupChats ? (
				<div className="askerRegistration__consultingTypeWrapper">
					<SelectDropdown {...consultingTypesDropdown} />
					<Text
						className="askerRegistration__consultingModeInfo"
						labelType={LABEL_TYPES.NOTICE}
						text={translate(
							'profile.data.register.consultingModeInfo.singleChats'
						)}
						type="infoSmall"
					/>
				</div>
			) : (
				<SelectDropdown {...consultingTypesDropdown} />
			)}
			{selectedConsultingType && (
				<AgencySelection
					consultingType={selectedConsultingType}
					onAgencyChange={(agency) => setSelectedAgency(agency)}
					userData={userData}
					isProfileView={true}
					agencySelectionNote={
						selectedConsultingType?.registration?.notes
							?.agencySelection
					}
				/>
			)}
			<Button
				item={buttonSetRegistration}
				buttonHandle={handleRegistration}
				disabled={isButtonDisabled}
			/>
			{overlayActive && (
				<OverlayWrapper>
					<Overlay
						item={overlayItem}
						handleOverlay={handleOverlayAction}
					/>
				</OverlayWrapper>
			)}
		</div>
	);
};
