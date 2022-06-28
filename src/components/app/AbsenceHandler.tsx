import {
	OverlayItem,
	OVERLAY_FUNCTIONS,
	OverlayWrapper,
	Overlay
} from '../overlay/Overlay';
import { translate } from '../../utils/translate';
import { BUTTON_TYPES } from '../button/Button';
import * as React from 'react';
import { apiSetAbsence } from '../../api';
import { UserDataContext } from '../../globalState';
import { useContext, useState, useEffect } from 'react';
import { ReactComponent as CheckIcon } from '../../resources/img/illustrations/check.svg';

export const AbsenceHandler = () => {
	const absenceReminderOverlayItem: OverlayItem = {
		headline: translate('absence.overlayHeadline'),
		headlineStyleLevel: '1',
		copy: translate('absence.overlay.copy'),
		buttonSet: [
			{
				label: translate('absence.overlayButton1.label'),
				function: OVERLAY_FUNCTIONS.DEACTIVATE_ABSENCE,
				type: BUTTON_TYPES.PRIMARY
			},
			{
				label: translate('absence.overlayButton2.label'),
				function: OVERLAY_FUNCTIONS.CLOSE,
				type: BUTTON_TYPES.SECONDARY
			}
		]
	};

	const absenceChangedOverlayItem: OverlayItem = {
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

	const { userData, setUserData } = useContext(UserDataContext);
	const [overlayItem, setOverlayItem] = useState(absenceReminderOverlayItem);
	const [overlayActive, setOverlayActive] = useState(false);
	const [reminderSend, setReminderSend] = useState(false);
	const [init, setInit] = useState(true);

	useEffect(() => {
		if (init) {
			handleAbsenceReminder();
			setInit(false);
		}
	}, [init]); // eslint-disable-line react-hooks/exhaustive-deps

	const handleAbsenceReminder = () => {
		const absence = userData.absent;
		if (absence && !reminderSend) {
			activateOverlay();
		}
	};

	const activateOverlay = () => {
		setReminderSend(true);
		setOverlayActive(true);
	};

	const handleOverlayAction = (buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.CLOSE) {
			setOverlayItem(absenceReminderOverlayItem);
			setOverlayActive(false);
		}
		if (buttonFunction === OVERLAY_FUNCTIONS.DEACTIVATE_ABSENCE) {
			apiSetAbsence(false, userData.absenceMessage)
				.then(() => {
					setOverlayItem(absenceChangedOverlayItem);
					setUserData({
						...userData,
						absent: false,
						absenceMessage: userData.absenceMessage
					});
				})
				.catch((error) => {
					console.log(error);
				});
		}
	};

	if (!overlayActive) return null;

	return (
		<>
			<OverlayWrapper>
				<Overlay
					item={overlayItem}
					handleOverlay={handleOverlayAction}
				/>
			</OverlayWrapper>
		</>
	);
};
