import { OverlayItem, OVERLAY_FUNCTIONS, Overlay } from '../overlay/Overlay';
import { BUTTON_TYPES } from '../button/Button';
import * as React from 'react';
import { apiSetAbsence } from '../../api';
import { UserDataContext } from '../../globalState';
import { useContext, useState, useEffect } from 'react';
import { ReactComponent as CheckIcon } from '../../resources/img/illustrations/check.svg';
import { useTranslation } from 'react-i18next';
import { OVERLAY_ABSENCE } from '../../globalState/interfaces/AppConfig/OverlaysConfigInterface';

export const AbsenceHandler = () => {
	const { t: translate } = useTranslation();
	const absenceReminderOverlayItem: OverlayItem = {
		headline: translate('absence.overlay.headline'),
		headlineStyleLevel: '1',
		copy: translate('absence.overlay.copy'),
		buttonSet: [
			{
				label: translate('absence.overlay.button1.label'),
				function: OVERLAY_FUNCTIONS.DEACTIVATE_ABSENCE,
				type: BUTTON_TYPES.PRIMARY
			},
			{
				label: translate('absence.overlay.button2.label'),
				function: OVERLAY_FUNCTIONS.CLOSE,
				type: BUTTON_TYPES.SECONDARY
			}
		]
	};

	const absenceChangedOverlayItem: OverlayItem = {
		svg: CheckIcon,
		headline: translate('absence.overlay.changeSuccess.headline'),
		buttonSet: [
			{
				label: translate('absence.overlay.changeSuccess.buttonLabel'),
				function: OVERLAY_FUNCTIONS.CLOSE,
				type: BUTTON_TYPES.AUTO_CLOSE
			}
		]
	};

	const { userData, reloadUserData } = useContext(UserDataContext);

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
				.then(reloadUserData)
				.then(() => {
					setOverlayItem(absenceChangedOverlayItem);
				})
				.catch(console.log);
		}
	};

	if (!overlayActive) return null;

	return (
		<Overlay
			name={OVERLAY_ABSENCE}
			item={overlayItem}
			handleOverlay={handleOverlayAction}
		/>
	);
};
