import * as React from 'react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './ConsultingTypesAgencySelection.styles.scss';
import { useAppConfig } from '../../../hooks/useAppConfig';
import { VALID_POSTCODE_LENGTH } from '../../../components/agencySelection/agencySelectionHelpers';
import { apiAgencySelection, FETCH_ERRORS } from '../../../api';
import { parsePlaceholderString } from '../../../utils/parsePlaceholderString';
import { InputField } from '../../../components/inputField/InputField';
import { PinIcon } from '../../../resources/img/icons';
import { Button, BUTTON_TYPES } from '../../../components/button/Button';
import { Notice } from '../../../components/notice/Notice';
import {
	AgencyDataInterface,
	ConsultingTypeInterface
} from '../../../globalState/interfaces';
import { AskerRegistrationExternalAgencyOverlay } from '../../../components/profile/AskerRegistrationExternalAgencyOverlay';
import { Text } from '../../../components/text/Text';

interface ConsultingTypesAgencySelectionProps {
	consultingType: ConsultingTypeInterface;
}

const ConsultingTypesAgencySelection = ({
	consultingType
}: ConsultingTypesAgencySelectionProps) => {
	const settings = useAppConfig();
	const [postcode, setPostcode] = useState('');
	const [agency, setAgency] = useState<AgencyDataInterface>();
	const [postcodeFallbackLink, setPostcodeFallbackLink] = useState<string>();
	const [externalAgencyOverlayActive, setExternalAgencyOverlayActive] =
		useState<boolean>(null);
	const { t: translate } = useTranslation();

	const handlePostcodeInput = (e) => {
		setPostcode(e.target.value);
		setPostcodeFallbackLink(null);
	};

	const handleButton = () => {
		if (agency.external) {
			if (!agency.url) {
				console.error(
					"Agency is external but didn't provide a `url`. Failed to redirect."
				);
				return;
			}
			setExternalAgencyOverlayActive(true);
		} else {
			window.location.href = `/${consultingType.slug}/registration?postcode=${postcode}`;
		}
	};

	useEffect(() => {
		setAgency(undefined);

		if (postcode.length !== VALID_POSTCODE_LENGTH) {
			return;
		}

		let isCanceled = false;
		apiAgencySelection({
			postcode,
			consultingType: consultingType.id
		})
			.then((result) => {
				if (isCanceled) return;

				if (!result || result.length === 0) {
					console.error(
						'Agency selection returned an empty result. This should never happen.'
					);
					return;
				}
				setAgency(result[0]);
			})
			.catch((error) => {
				if (error.message === FETCH_ERRORS.EMPTY) {
					setPostcodeFallbackLink(
						parsePlaceholderString(settings.postcodeFallbackUrl, {
							url: consultingType.urls
								.registrationPostcodeFallbackUrl,
							postcode: postcode
						})
					);
				}

				return null;
			});

		return () => {
			isCanceled = true;
		};
	}, [
		consultingType.id,
		consultingType.urls.registrationPostcodeFallbackUrl,
		postcode,
		settings.postcodeFallbackUrl
	]);

	const handleExternalAgencyOverlayAction = () => {
		setExternalAgencyOverlayActive(false);
	};

	return (
		<div className="consultingTypesAgencySelection">
			<div className="consultingTypesAgencySelection__innerWrapper">
				<InputField
					item={{
						name: 'postcode',
						id: 'postcode',
						class: 'consultingTypesAgencySelection__postcode',
						type: 'number',
						label: translate(
							'registration.agencySelection.postcode.label'
						),
						content: postcode,
						maxLength: VALID_POSTCODE_LENGTH,
						pattern: '^[0-9]+$',
						icon: <PinIcon />
					}}
					inputHandle={handlePostcodeInput}
				/>
				<Button
					className="consultingTypesAgencySelection__register"
					buttonHandle={handleButton}
					disabled={agency == null}
					item={{
						type: BUTTON_TYPES.PRIMARY,
						label: translate('consultingTypes.register')
					}}
				/>
			</div>
			{postcodeFallbackLink != null && (
				<Notice
					className="consultingTypesAgencySelection__postcodeFallback"
					title={translate(
						'registration.agencySelection.postcode.unavailable.title'
					)}
				>
					<Text
						text={translate(
							'registration.agencySelection.postcode.unavailable.text'
						)}
						type="infoLargeAlternative"
					/>
					<a
						href={postcodeFallbackLink}
						target="_blank"
						rel="noreferrer"
					>
						{translate(
							'registration.agencySelection.postcode.search'
						)}
					</a>
				</Notice>
			)}
			{externalAgencyOverlayActive && (
				<AskerRegistrationExternalAgencyOverlay
					selectedAgency={agency}
					consultingType={consultingType}
					handleOverlayAction={handleExternalAgencyOverlayAction}
				/>
			)}
		</div>
	);
};

export default ConsultingTypesAgencySelection;
