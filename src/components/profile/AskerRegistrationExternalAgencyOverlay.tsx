import * as React from 'react';
import { Overlay, OVERLAY_FUNCTIONS } from '../overlay/Overlay';
import { ReactComponent as ArrowIcon } from '../../resources/img/illustrations/arrow.svg';
import { BUTTON_TYPES } from '../button/Button';
import { ConsultingTypeBasicInterface } from '../../globalState/interfaces';
import { useTranslation } from 'react-i18next';

interface AskerRegistrationExternalAgencyOverlayProps {
	consultingType: ConsultingTypeBasicInterface;
	handleOverlayAction: (action: string) => void;
	selectedAgency: any;
}

export const AskerRegistrationExternalAgencyOverlay = ({
	consultingType,
	handleOverlayAction,
	selectedAgency
}: AskerRegistrationExternalAgencyOverlayProps) => {
	const { t: translate } = useTranslation(['common', 'consultingTypes']);
	const handleOverlay = (action) => {
		if (action === OVERLAY_FUNCTIONS.REDIRECT) {
			window.open(selectedAgency.url, '_blank')?.focus();
		} else {
			handleOverlayAction(action);
		}
	};

	return (
		<Overlay
			item={{
				svg: ArrowIcon,
				headline: translate('profile.externalRegistration.headline'),
				copy:
					translate('profile.externalRegistration.copy.start') +
					translate(
						[
							`consultingType.${consultingType.id}.titles.default`,
							`consultingType.fallback.titles.default`,
							consultingType.titles.default
						],
						{ ns: 'consultingTypes' }
					) +
					translate('profile.externalRegistration.copy.end'),
				buttonSet: [
					{
						label: translate('profile.externalRegistration.submit'),
						function: OVERLAY_FUNCTIONS.REDIRECT,
						type: BUTTON_TYPES.PRIMARY
					},
					{
						label: translate('profile.externalRegistration.cancel'),
						function: OVERLAY_FUNCTIONS.CLOSE,
						type: BUTTON_TYPES.SECONDARY
					}
				]
			}}
			handleOverlay={handleOverlay}
		/>
	);
};
