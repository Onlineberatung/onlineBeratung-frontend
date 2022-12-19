import React from 'react';
import { useTranslation } from 'react-i18next';
import './ConsultingTypesOverlay.styles.scss';
import { Overlay, OVERLAY_FUNCTIONS } from '../../../components/overlay/Overlay';
import { ServiceExplanation } from '../../../components/serviceExplanation/ServiceExplanation';
import { BUTTON_TYPES } from '../../../components/button/Button';

interface ConsultingTypesOverlayProps {
	handleOverlay?(): void;
}

export const ConsultingTypesOverlay = ({
	handleOverlay
}: ConsultingTypesOverlayProps) => {
	const { t: translate } = useTranslation();
	return (
		<Overlay
			className="consultingTypes__explanationOverlay"
			item={{
				headline: translate('consultingTypes.overlay.title'),
				nestedComponent: (
					<ServiceExplanation className="consultingTypesOverlay__serviceExplanation" />
				),
				buttonSet: [
					{
						label: translate('consultingTypes.overlay.close'),
						function: OVERLAY_FUNCTIONS.CLOSE,
						type: BUTTON_TYPES.PRIMARY
					}
				]
			}}
			handleOverlay={handleOverlay}
		/>
	);
};
