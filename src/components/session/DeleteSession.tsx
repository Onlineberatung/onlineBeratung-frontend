import React, { ReactNode, useState } from 'react';
import { ReactComponent as CheckIllustration } from '../../resources/img/illustrations/check.svg';
import { ReactComponent as XIllustration } from '../../resources/img/illustrations/x.svg';
import { apiDeleteRemove } from '../../api/apiDeleteRemove';
import { Overlay, OverlayItem, OVERLAY_FUNCTIONS } from '../overlay/Overlay';
import { BUTTON_TYPES } from '../button/Button';
import { useTranslation } from 'react-i18next';

type DeleteSessionProps = {
	children: (onClick: () => void) => ReactNode;
	chatId: number;
	onSuccess: () => void;
	onError?: (error: any) => void;
};

const DeleteSession = ({
	children,
	chatId,
	onSuccess,
	onError
}: DeleteSessionProps) => {
	const { t: translate } = useTranslation();
	const [isRequestInProgress, setIsRequestInProgress] =
		useState<boolean>(false);
	const [overlayItem, setOverlayItem] = useState<OverlayItem | null>(null);

	const overlayConfirm: OverlayItem = {
		headline: translate('deleteSession.confirmOverlay.headline'),
		headlineStyleLevel: '1',
		copy: translate('deleteSession.confirmOverlay.copy'),
		buttonSet: [
			{
				label: translate('deleteSession.confirmOverlay.button.confirm'),
				function: OVERLAY_FUNCTIONS.DELETE_SESSION,
				type: BUTTON_TYPES.PRIMARY,
				disabled: isRequestInProgress
			},
			{
				label: translate('deleteSession.confirmOverlay.button.deny'),
				function: OVERLAY_FUNCTIONS.CLOSE,
				type: BUTTON_TYPES.SECONDARY,
				disabled: isRequestInProgress
			}
		]
	};

	const overlaySuccess: OverlayItem = {
		headline: translate('deleteSession.successOverlay.headline'),
		svg: CheckIllustration,
		buttonSet: [
			{
				label: translate('deleteSession.successOverlay.button'),
				function: OVERLAY_FUNCTIONS.CLOSE_SUCCESS,
				type: BUTTON_TYPES.AUTO_CLOSE
			}
		]
	};

	const overlayError: OverlayItem = {
		headline: translate('deleteSession.errorOverlay.headline'),
		svg: XIllustration,
		buttonSet: [
			{
				label: translate('deleteSession.errorOverlay.button'),
				function: OVERLAY_FUNCTIONS.CLOSE,
				type: BUTTON_TYPES.PRIMARY
			}
		]
	};

	const handleOverlayAction = (buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.CLOSE) {
			setOverlayItem(null);
		} else if (
			!isRequestInProgress &&
			buttonFunction === OVERLAY_FUNCTIONS.DELETE_SESSION
		) {
			setIsRequestInProgress(true);
			apiDeleteRemove(chatId)
				.then(() => {
					setOverlayItem(overlaySuccess);
				})
				.catch((error) => {
					setIsRequestInProgress(false);
					setOverlayItem(overlayError);
					if (onError) onError(error);
				});
		} else if (buttonFunction === OVERLAY_FUNCTIONS.CLOSE_SUCCESS) {
			onSuccess();
		}
	};

	return (
		<>
			{children(() => setOverlayItem(overlayConfirm))}
			{overlayItem && (
				<Overlay
					className="deleteSession__overlay"
					item={overlayItem}
					handleOverlay={handleOverlayAction}
				/>
			)}
		</>
	);
};

export default DeleteSession;
