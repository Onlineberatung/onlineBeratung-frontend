import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { CheckboxItem, Checkbox } from '../checkbox/Checkbox';
import { InputFieldItem, InputField } from '../inputField/InputField';
import { translate } from '../../utils/translate';
import { apiSetAbsence } from '../../api';
import { BUTTON_TYPES } from '../button/Button';
import {
	OverlayItem,
	OVERLAY_FUNCTIONS,
	OverlayWrapper,
	Overlay
} from '../overlay/Overlay';
import { UserDataContext } from '../../globalState';
import { ReactComponent as CheckIcon } from '../../resources/img/illustrations/check.svg';
import './absenceFormular.styles';
import { Headline } from '../headline/Headline';
import Switch from 'react-switch';
import { Text } from '../text/Text';

export const AbsenceFormular = () => {
	const { userData, setUserData } = useContext(UserDataContext);

	const [isAbsent, setIsAbsent] = useState(userData.absent);
	const [absentMessage, setAbsentMessage] = useState(userData.absenceMessage);

	const [overlayActive, setOverlayActive] = useState(false);
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);

	const absenceOverlayItem: OverlayItem = {
		svg: CheckIcon,
		headline: translate('absence.changeSuccess.overlay.headline'),
		buttonSet: [
			{
				label: translate('absence.changeSuccess.overlay.buttonLabel'),
				function: OVERLAY_FUNCTIONS.CLOSE,
				type: BUTTON_TYPES.AUTO_CLOSE
			}
		]
	};

	useEffect(() => {
		if (!isAbsent) {
			setAbsentMessage(null);
		}
	}, [isAbsent]);

	useEffect(() => {
		setIsAbsent(userData.absent);
		setAbsentMessage(userData.absenceMessage);
	}, [userData]);

	const handleButtonClick = () => {
		if (isRequestInProgress) {
			return null;
		}
		setIsRequestInProgress(true);

		apiSetAbsence(isAbsent, absentMessage)
			.then(() => {
				setOverlayActive(true);
				setIsRequestInProgress(false);
			})
			.catch((error) => {
				console.log(error);
				setIsRequestInProgress(false);
			});
	};

	const handleOverlayAction = (buttonFunction: string) => {
		setOverlayActive(false);
		setUserData({
			...userData,
			absent: isAbsent,
			absenceMessage: isAbsent ? absentMessage : null
		});
	};

	const inputItem: InputFieldItem = {
		name: 'absence',
		class: 'absence__fieldGroup__input',
		id: 'absence',
		type: 'text',
		label: translate('profile.functions.absenceLabel'),
		content: absentMessage
	};

	return (
		<div id="absenceForm" className="absenceForm">
			<div className="profile__content__title">
				<Headline
					text={translate('profile.functions.absenceTitle')}
					semanticLevel="5"
				/>
			</div>
			<div className="generalInformation">
				<div className="flex">
					<Switch
						className="mr--1"
						onChange={() => setIsAbsent(!isAbsent)}
						checked={isAbsent}
						uncheckedIcon={false}
						checkedIcon={false}
						width={48}
						height={26}
						onColor="#0dcd21"
						offColor="#8C878C"
						boxShadow="0px 1px 4px rgba(0, 0, 0, 0.6)"
						handleDiameter={27}
						activeBoxShadow="none"
					/>
					<Text
						text={translate('absence.checkbox.label')}
						type="standard"
					/>
				</div>
				{isAbsent && (
					<>
						<InputField
							item={inputItem}
							inputHandle={({ target: { value } }) =>
								setAbsentMessage(value)
							}
						/>
						<Text
							text={translate('absence.input.infoText')}
							type="standard"
							className="tertiary"
						/>
					</>
				)}
				{(isAbsent !== userData.absent ||
					absentMessage !== userData.absenceMessage) && (
					<div className="w--100 mt--2">
						<span
							onClick={handleButtonClick}
							id="absenceButton"
							role="button"
							className="absence__link"
						>
							{userData.absent && isAbsent
								? translate(
										'profile.functions.absenceButtonChange'
								  )
								: translate(
										'profile.functions.absenceButtonSave'
								  )}
						</span>
					</div>
				)}
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
