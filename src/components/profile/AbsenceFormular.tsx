import * as React from 'react';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiSetAbsence } from '../../api';
import { BUTTON_TYPES } from '../button/Button';
import { OverlayItem, OVERLAY_FUNCTIONS, Overlay } from '../overlay/Overlay';
import { UserDataContext } from '../../globalState';
import { ReactComponent as CheckIcon } from '../../resources/img/illustrations/check.svg';
import './absenceFormular.styles';
import { Headline } from '../headline/Headline';
import Switch from 'react-switch';
import { Text } from '../text/Text';
import { Textarea } from '../form/textarea';
import { isMobile } from 'react-device-detect';
import { useTranslation } from 'react-i18next';

export const AbsenceFormular = () => {
	const { t: translate } = useTranslation();
	const { userData, reloadUserData } = useContext(UserDataContext);

	const [absentMessage, setAbsentMessage] = useState(userData.absenceMessage);
	const [overlayActive, setOverlayActive] = useState(false);
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);

	const isAbsent = useMemo(() => userData.absent, [userData.absent]);

	const absenceOverlayItem: OverlayItem = {
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

	const saveAbsence = useCallback(
		(isAbsent) => {
			if (isRequestInProgress) {
				return null;
			}
			setIsRequestInProgress(true);

			apiSetAbsence(isAbsent, absentMessage)
				.then(reloadUserData)
				.then(() => {
					setOverlayActive(true);
					setIsRequestInProgress(false);
				})
				.catch((error) => {
					console.log(error);
					setIsRequestInProgress(false);
				});
		},
		[absentMessage, isRequestInProgress, reloadUserData]
	);

	useEffect(() => {
		setAbsentMessage(userData.absenceMessage);
	}, [userData]);

	const handleOverlayAction = () => {
		setOverlayActive(false);
	};

	return (
		<div id="absenceForm" className="absenceForm">
			<div className="profile__content__title">
				<Headline
					text={translate('profile.functions.absence.title')}
					semanticLevel="5"
				/>
			</div>
			<div className="generalInformation">
				<Textarea
					value={absentMessage ?? ''}
					onChange={({ target: { value } }) =>
						setAbsentMessage(value)
					}
					placeholder={
						isAbsent
							? translate(
									'profile.functions.absence.activated.label'
								)
							: translate('profile.functions.absence.label')
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
						onColor="#0A882F"
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
			{overlayActive && (
				<Overlay
					item={absenceOverlayItem}
					handleOverlay={handleOverlayAction}
				/>
			)}
		</div>
	);
};
