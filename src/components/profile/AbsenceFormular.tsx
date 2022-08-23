import * as React from 'react';
import { useCallback, useContext, useEffect, useState } from 'react';
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
import { Textarea } from '../form/textarea';
import { isMobile } from 'react-device-detect';

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

	const saveAbsence = useCallback(
		(isAbsent) => {
			setIsAbsent(isAbsent);
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
		},
		[absentMessage, isRequestInProgress]
	);

	useEffect(
		() => {
			if (!isAbsent && isAbsent !== userData.absent) {
				saveAbsence(isAbsent);
			}
		},
		[isAbsent, userData.absent] // eslint-disable-line react-hooks/exhaustive-deps
	);

	useEffect(() => {
		setIsAbsent(userData.absent);
		setAbsentMessage(userData.absenceMessage);
	}, [userData]);

	const handleOverlayAction = () => {
		setOverlayActive(false);
		setUserData({
			...userData,
			absent: isAbsent,
			absenceMessage: absentMessage
		});
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
				<Textarea
					value={absentMessage}
					onChange={({ target: { value } }) =>
						setAbsentMessage(value)
					}
					placeholder={
						isAbsent
							? translate(
									'profile.functions.absenceActivatedLabel'
							  )
							: translate('profile.functions.absenceLabel')
					}
					disabled={isAbsent}
					className={`${isAbsent ? 'disabled' : ''} ${
						isMobile && isAbsent ? 'mobile' : ''
					}`}
				/>

				<Text
					text={translate('absence.input.infoText')}
					type="infoLargeAlternative"
				/>

				<div className="flex">
					<Switch
						className="mr--1"
						onChange={() => saveAbsence(!isAbsent)}
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
