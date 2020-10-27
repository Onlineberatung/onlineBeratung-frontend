import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { translate } from '../../../resources/ts/i18n/translate';
import { UserDataContext, AcceptedGroupIdContext } from '../../../globalState';
import { history } from '../../app/ts/app';
import { Button } from '../../button/ts/Button';
import {
	SelectDropdown,
	SelectDropdownItem
} from '../../select/ts/SelectDropdown';
import {
	consultingTypeSelectOptionsSet,
	buttonSetRegistration,
	overlayItemNewRegistrationSuccess,
	overlayItemNewRegistrationError
} from './profileHelpers';
import { ajaxCallRegistrationNewConsultingTypes } from '../../apiWrapper/ts/ajaxCallRegistrationNewConsultingType';
import {
	OverlayWrapper,
	Overlay,
	OVERLAY_FUNCTIONS
} from '../../overlay/ts/Overlay';
import { logout } from '../../logout/ts/logout';
import {
	setProfileWrapperInactive,
	mobileListView
} from '../../app/ts/navigationHandler';
import { AgencySelection } from '../../agencySelection/ts/AgencySelection';

export const AskerNewRegistration = () => {
	const { userData } = useContext(UserDataContext);
	const [isButtonDisabled, setIsButtonDisabled] = useState(true);
	const [selectedConsultingType, setSelectedConsultingType] = useState(null);
	const [selectedAgency, setSelectedAgency] = useState(null);
	const [overlayActive, setOverlayActive] = useState(false);
	const [overlayItem, setOverlayItem] = useState(null);
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
			(option) => option.value == (selectedConsultingType as any)
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
			setOverlayItem(null);
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
