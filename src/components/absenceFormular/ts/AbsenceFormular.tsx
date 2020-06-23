import * as React from 'react';
import { useContext, useState } from 'react';
import { CheckboxItem, Checkbox } from '../../checkbox/ts/Checkbox';
import { InputFieldItemTSX, InputField } from '../../inputField/ts/InputField';
import { translate } from '../../../resources/ts/i18n/translate';
import { ajaxCallSetAbsence } from '../../apiWrapper/ts/';
import { BUTTON_TYPES } from '../../button/ts/Button';
import {
	OverlayItem,
	OVERLAY_FUNCTIONS,
	OverlayWrapper,
	Overlay
} from '../../overlay/ts/Overlay';
import { UserDataContext } from '../../../globalState';

export const AbsenceFormular = (props) => {
	const { userData, setUserData } = useContext(UserDataContext);
	const [savedAbsence, setSavedAbsence] = useState(true);
	const [currentAbsentState, setCurrentAbsentState] = useState(
		userData.absent
	);
	const [currentAbsenceMessage, setCurrentAbsenceMessage] = useState(
		userData.absenceMessage
	);
	const [overlayActive, setOverlayActive] = useState(false);
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);

	const absenceOverlayItem: OverlayItem = {
		imgSrc: '/../resources/img/illustrations/check.svg',
		headline: translate('absence.changeSuccess.overlay.headline'),
		buttonSet: [
			{
				label: translate('absence.changeSuccess.overlay.buttonLabel'),
				function: OVERLAY_FUNCTIONS.CLOSE,
				type: BUTTON_TYPES.AUTO_CLOSE
			}
		]
	};

	const handleButtonClick = () => {
		const absenceCheckbox = document.getElementById(
			'isAbsent'
		) as HTMLInputElement;
		const absenceMessageInput = document.getElementById(
			'absence'
		) as HTMLInputElement;

		if (!absenceCheckbox.checked) {
			absenceMessageInput.value = '';
			absenceMessageInput.setAttribute('value', '');
		}

		sendAbsence();
		setCurrentAbsentState(userData.absent);
	};

	const sendAbsence = () => {
		if (isRequestInProgress) {
			return null;
		}
		setIsRequestInProgress(true);

		const absenceCheckbox = document.getElementById(
			'isAbsent'
		) as HTMLInputElement;
		const absenceMessageInput = document.getElementById(
			'absence'
		) as HTMLInputElement;
		const absenceMessageInputVal: string = absenceMessageInput.value;
		let absenceCheckboxBool: boolean;
		absenceCheckbox.checked
			? (absenceCheckboxBool = true)
			: (absenceCheckboxBool = false);

		ajaxCallSetAbsence(absenceCheckboxBool, absenceMessageInputVal)
			.then(() => {
				setOverlayActive(true);
				setIsRequestInProgress(false);
			})
			.catch((error) => {
				console.log(error);
				setIsRequestInProgress(false);
			});
	};

	const handleCheckboxClick = () => {
		const absenceCheckbox = document.getElementById(
			'isAbsent'
		) as HTMLInputElement;
		setCurrentAbsentState(absenceCheckbox.checked);
		setSavedAbsence(false);
	};

	const handleOverlayAction = (buttonFunction: string) => {
		setOverlayActive(false);
		const absenceCheckbox = (document.getElementById(
			'isAbsent'
		) as HTMLInputElement).checked;
		const absenceMessageInput = (document.getElementById(
			'absence'
		) as HTMLInputElement).value;
		setSavedAbsence(true);
		setUserData({
			...userData,
			absent: absenceCheckbox,
			absenceMessage: absenceCheckbox ? absenceMessageInput : null
		});
	};

	const handleInputChange = (event) => {
		setCurrentAbsenceMessage(event.target.value);
	};

	const checkboxItem: CheckboxItem = {
		inputId: 'isAbsent',
		name: 'isAbsent',
		labelId: 'isAbsentLabel',
		label: translate('absence.checkbox.label'),
		checked: userData.absent
	};

	const inputItem: InputFieldItemTSX = {
		name: 'absence',
		class: 'absence__fieldGroup__input',
		id: 'absence',
		type: 'text',
		labelTranslatable: 'profile.functions.absenceLabel',
		infoText: translate('absence.input.infoText'),
		content: currentAbsenceMessage
	};

	return (
		<div id="absenceForm" className="absenceForm">
			<p className="absence__title profile__content__subtitle">
				{translate('profile.functions.absenceTitle')}
			</p>
			<div className="generalInformation">
				<Checkbox
					item={checkboxItem}
					checkboxHandle={handleCheckboxClick}
				/>
				{!savedAbsence || userData.absent ? (
					<div
						id="absenceInnerWrapper"
						className="generalInformation__innerWrapper"
					>
						<InputField
							item={inputItem}
							inputHandle={handleInputChange}
						/>
						<span
							onClick={handleButtonClick}
							id="absenceButton"
							role="button"
							className="absence__link"
						>
							{currentAbsentState
								? translate(
										'profile.functions.absenceButtonChange'
								  )
								: translate(
										'profile.functions.absenceButtonSave'
								  )}
						</span>
					</div>
				) : null}
			</div>
			{overlayActive ? (
				<OverlayWrapper>
					<Overlay
						item={absenceOverlayItem}
						handleOverlay={handleOverlayAction}
					/>
				</OverlayWrapper>
			) : null}
		</div>
	);
};
