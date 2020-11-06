import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { translate } from '../../resources/scripts/i18n/translate';
import { UserDataContext, AcceptedGroupIdContext } from '../../globalState';
import { history } from '../app/app';
import { Button } from '../button/Button';
import {
	SelectDropdown,
	SelectDropdownItem
} from '../select/SelectDropdown';
import {
	consultingTypeSelectOptionsSet,
	buttonSetRegistration,
	overlayItemNewRegistrationSuccess,
	overlayItemNewRegistrationError
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

export const AskerNewRegistration = () => {
	const { userData } = useContext(UserDataContext);
	const [isButtonDisabled, setIsButtonDisabled] = useState(true);
	const [selectedConsultingType, setSelectedConsultingType] = useState<number>(null);
	const [selectedAgency, setSelectedAgency] = useState<any>({});
	const [overlayActive, setOverlayActive] = useState(false);
	const [overlayItem, setOverlayItem] = useState<OverlayItem>(null);
	const { setAcceptedGroupId } = useContext(AcceptedGroupIdContext);

	const isAllRequiredDataSet = () => selectedConsultingType && selectedAgency;

	useEffect(() => {
		if (isAllRequiredDataSet()) {
			setIsButtonDisabled(false);
		} else {
			setIsButtonDisabled(true);
		}
	}, [selectedAgency]);

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
		if (isAllRequiredDataSet()) {
			ajaxCallRegistrationNewConsultingTypes(
				selectedConsultingType,
				selectedAgency.id,
				selectedAgency.typedPostcode
			)
				.then((response) => {
					setOverlayItem(overlayItemNewRegistrationSuccess);
					setOverlayActive(true);
					setAcceptedGroupId(response.sessionId);
				})
				.catch((error) => {
					setOverlayItem(overlayItemNewRegistrationError);
					setOverlayActive(true);
				});
		}
	};

	const handleOverlayAction = (buttonFunction: string) => {
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

	return (
		<div className="profile__data__itemWrapper askerRegistration">
			<p className="askerRegistration__headline">
				{translate('profile.data.register.headline')}
			</p>
			<SelectDropdown {...consultingTypesDropdown} />
			<AgencySelection
				selectedConsultingType={selectedConsultingType}
				setAgency={(agency) => setSelectedAgency(agency)}
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
