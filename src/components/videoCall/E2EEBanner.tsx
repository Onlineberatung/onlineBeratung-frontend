import * as React from 'react';
import { useTranslation } from 'react-i18next';
import './e2eeBanner.styles.scss';

const E2EEBanner = ({ e2eEnabled }) => {
	const { t: translate } = useTranslation();
	return (
		<div className="e2ee-banner">
			<div className="e2ee-banner__icon-filled">
				<svg
					aria-hidden="true"
					focusable="false"
					xmlns="http://www.w3.org/2000/svg"
					height="24px"
					viewBox="0 0 24 24"
					width="24px"
					fill="#000000"
				>
					<path d="M0 0h24v24H0V0z" fill="none" />
					<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
				</svg>
			</div>
			<div className="e2ee-banner__icon-outline">
				<svg
					aria-hidden="true"
					focusable="false"
					xmlns="http://www.w3.org/2000/svg"
					height="24px"
					viewBox="0 0 24 24"
					width="24px"
					fill="#000000"
				>
					<path d="M0 0h24v24H0V0z" fill="none" />
					<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm7 10c0 4.52-2.98 8.69-7 9.93-4.02-1.24-7-5.41-7-9.93V6.3l7-3.11 7 3.11V11zm-11.59.59L6 13l4 4 8-8-1.41-1.42L10 14.17z" />
				</svg>
			</div>

			<div className="text">
				{e2eEnabled
					? translate('videoCall.overlay.encryption.e2e')
					: translate('videoCall.overlay.encryption.transport')}
			</div>
		</div>
	);
};

export default E2EEBanner;
