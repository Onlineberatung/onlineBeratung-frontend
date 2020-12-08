import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { translate } from '../../resources/scripts/i18n/translate';
import {
	UserDataContext,
	AcceptedGroupIdContext,
	UserDataInterface
} from '../../globalState';
import { history } from '../app/app';
import { Button } from '../button/Button';
import { SelectDropdown, SelectDropdownItem } from '../select/SelectDropdown';
import {
	consultingTypeSelectOptionsSet,
	buttonSetRegistration,
	overlayItemNewRegistrationSuccess,
	overlayItemNewRegistrationError,
	autoselectAgencyForConsultingType,
	getConsultingTypesForRegistrationStatus,
	REGISTRATION_STATUS_KEYS
} from './profileHelpers';
import { ajaxCallRegistrationNewConsultingTypes } from '../apiWrapper/ajaxCallRegistrationNewConsultingType';
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
import { getUserData } from '../apiWrapper';
import { InfoText, LABEL_TYPES } from '../infoText/InfoText';

export const AskerNewRegistration = () => {
	const { userData, setUserData } = useContext(UserDataContext);
	const [isButtonDisabled, setIsButtonDisabled] = useState(true);
	const [selectedConsultingType, setSelectedConsultingType] = useState<
		number
	>(null);
	const [selectedAgency, setSelectedAgency] = useState<any>({});
	const [overlayActive, setOverlayActive] = useState(false);
	const [overlayItem, setOverlayItem] = useState<OverlayItem>(null);
	const { setAcceptedGroupId } = useContext(AcceptedGroupIdContext);
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);
	const [autoSelectAgency, setAutoSelectAgency] = useState(false);

	const isAllRequiredDataSet = () => selectedConsultingType && selectedAgency;

	useEffect(() => {
		if (isAllRequiredDataSet()) {
			setIsButtonDisabled(false);
		} else {
			setIsButtonDisabled(true);
		}
		setAutoSelectAgency(
			autoselectAgencyForConsultingType(selectedConsultingType)
		);
	}, [selectedAgency]); // eslint-disable-line react-hooks/exhaustive-deps

	const handleConsultingTypeSelect = (selectedOption) => {
		setSelectedConsultingType(selectedOption.value);
	};

	const getOptionOfSelectedConsultingType = () => {
		return consultingTypeSelectOptionsSet(userData).filter(
			(option) => option.value === (selectedConsultingType as any)
		)[0];
	};

	const consultingTypesDropdown: SelectDropdownItem = {
		id: 'consultingTypeSelect',
		selectedOptions: consultingTypeSelectOptionsSet(userData),
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
			ajaxCallRegistrationNewConsultingTypes(
				selectedConsultingType,
				selectedAgency.id,
				selectedAgency.typedPostcode
			)
				.then((response) => {
					let overlayItem = overlayItemNewRegistrationSuccess;
					if (autoSelectAgency) {
						overlayItem.buttonSet[0].label = translate(
							'profile.data.registerSuccess.overlay.button1Label.groupChats'
						);
					}
					setOverlayItem(overlayItem);
					setOverlayActive(true);
					if (!autoSelectAgency) {
						setAcceptedGroupId(response.sessionId);
					}
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
		getUserData()
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
			setSelectedConsultingType(null);
		} else {
			logout();
		}
	};

	const registeredConsultingTypes = userData
		? getConsultingTypesForRegistrationStatus(
				userData,
				REGISTRATION_STATUS_KEYS.REGISTERED
		  )
		: null;
	const isOnlyRegisteredForGroupChats =
		registeredConsultingTypes?.length === 1 &&
		registeredConsultingTypes[0].consultingType === '15';
	return (
		<div className="profile__data__itemWrapper askerRegistration">
			<p
				className="askerRegistration__headline profile__content__subtitle"
				dangerouslySetInnerHTML={{
					__html: translate('profile.data.register.headline')
				}}
			></p>
			{isOnlyRegisteredForGroupChats ? (
				<div className="askerRegistration__consultingTypeWrapper">
					<SelectDropdown {...consultingTypesDropdown} />
					<InfoText
						className="askerRegistration__consultingModeInfo"
						labelType={LABEL_TYPES.CAUTION}
						text={translate(
							'profile.data.register.consultingModeInfo.singleChats'
						)}
					/>
				</div>
			) : (
				<SelectDropdown {...consultingTypesDropdown} />
			)}
			<AgencySelection
				selectedConsultingType={selectedConsultingType}
				setAgency={(agency) => setSelectedAgency(agency)}
				userData={userData}
			/>
			<Button
				item={buttonSetRegistration}
				buttonHandle={handleRegistration}
				disabled={isButtonDisabled}
			/>
			{overlayActive ? (
				<OverlayWrapper>
					<Overlay
						item={overlayItem}
						handleOverlay={handleOverlayAction}
					/>
				</OverlayWrapper>
			) : null}
		</div>
	);
};
