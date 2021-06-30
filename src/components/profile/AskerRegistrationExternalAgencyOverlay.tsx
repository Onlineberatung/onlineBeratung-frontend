import * as React from 'react';
import { Overlay, OverlayWrapper, OVERLAY_FUNCTIONS } from '../overlay/Overlay';
import { ReactComponent as ArrowIcon } from '../../resources/img/illustrations/arrow.svg';
import { translate } from '../../utils/translate';
import { BUTTON_TYPES } from '../button/Button';
import { ConsultingTypeBasicInterface } from '../../globalState';

interface AskerRegistrationExternalAgencyOverlayProps {
	consultingType: ConsultingTypeBasicInterface;
	handleOverlayAction: (action: string) => void;
	selectedAgency: any;
}

const AskerRegistrationExternalAgencyOverlay = ({
	consultingType,
	handleOverlayAction,
	selectedAgency
}: AskerRegistrationExternalAgencyOverlayProps) => {
	const handleOverlay = (action) => {
		if (action === OVERLAY_FUNCTIONS.REDIRECT) {
			window.open(selectedAgency.url, '_blank')?.focus();
		} else {
			handleOverlayAction(action);
		}
	};

	return (
		<OverlayWrapper>
			<Overlay
				item={{
					svg: ArrowIcon,
					headline: translate(
						'profile.externalRegistration.headline'
					),
					copy:
						translate('profile.externalRegistration.copy.start') +
						consultingType.titles.default +
						translate('profile.externalRegistration.copy.end'),
					buttonSet: [
						{
							label: translate(
								'profile.externalRegistration.submit'
							),
							function: OVERLAY_FUNCTIONS.REDIRECT,
							type: BUTTON_TYPES.PRIMARY
						},
						{
							label: translate(
								'profile.externalRegistration.cancel'
							),
							function: OVERLAY_FUNCTIONS.CLOSE,
							type: BUTTON_TYPES.SECONDARY
						}
					]
				}}
				handleOverlay={handleOverlay}
			/>
		</OverlayWrapper>
	);
};

export default AskerRegistrationExternalAgencyOverlay;
