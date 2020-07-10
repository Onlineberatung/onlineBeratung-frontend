import { getTranslation } from '../../../resources/ts/i18n/translate';
import { getAgencyById } from '../../apiWrapper/ts/';
import { getUrlParameter } from '../../../resources/ts/helpers/getUrlParameter';
import { config } from '../../../resources/ts/config';
import {
	isU25Registration,
	isRehabilitationRegistration,
	isOffenderRegistration,
	getConsultingTypeFromRegistration,
	AGENCY_FALLBACK_LINK,
	isKreuzbundRegistration
} from '../../../resources/ts/helpers/resorts';
import { ajaxCallPostcodeSuggestion } from '../../apiWrapper/ts/ajaxCallPostcode';
import { FETCH_ERRORS } from '../../apiWrapper/ts/fetchData';

export interface AgencyDataProps {
	postcode?: string;
	name?: string;
	teamAgency?: boolean;
	description?: string;
}

const DEFAULT_POSTCODE = '00000';

export const prefillPostcode = () => {
	const agencyId = getUrlParameter('aid');

	if (agencyId) {
		getAgencyData(agencyId);
		movePrefilledPostcodeInput();
	} else if (isU25Registration()) {
		redirectToHelpmail();
	}

	if (
		isOffenderRegistration() ||
		isRehabilitationRegistration() ||
		isKreuzbundRegistration()
	) {
		ajaxCallPostcodeSuggestion({
			postcode: DEFAULT_POSTCODE,
			consultingType: getConsultingTypeFromRegistration()
		})
			.then((response) => {
				const fallbackAid = response[0].id;
				if (!agencyId || parseInt(agencyId) != fallbackAid) {
					window.location.href =
						AGENCY_FALLBACK_LINK[
							getConsultingTypeFromRegistration()
						] + fallbackAid;
				}
			})
			.catch((error) => {
				console.log(error);
			});
	}
};

const getAgencyData = (agencyId: any) => {
	getAgencyById(agencyId)
		.then((response) => {
			const agencyData = response[0];
			agencyData.consultingType === getConsultingTypeFromRegistration()
				? setAgencyData(agencyData, agencyId)
				: redirectToRegistrationWithoutAid();
		})
		.catch((error) => {
			if (error.message === FETCH_ERRORS.NO_MATCH) {
				redirectToRegistrationWithoutAid();
			}
		});
};

const movePrefilledPostcodeInput = () => {
	document
		.querySelector('.registration__form')
		.classList.add('registration__form--deactivatePostcodeInput');
	const postcodeSelect = document.querySelector(
		'.postcode'
	) as HTMLInputElement;
	const usernameSelect = document.querySelector(
		'.username'
	) as HTMLInputElement;
	const generalInformation = document.querySelector('.generalInformation');
	generalInformation.removeChild(postcodeSelect);
	generalInformation.insertBefore(postcodeSelect, usernameSelect);
};

const redirectToRegistrationWithoutAid = () => {
	const url = window.location.href;
	window.location.href = url.split('?')[0];
};

export const redirectToHelpmail = () => {
	window.location.href = config.endpoints.registrationHelpmailRedirect;
};

const setAgencyData = (obj: AgencyDataProps, agencyId: string) => {
	const postcodeInput = document.getElementById(
		'postcode'
	) as HTMLInputElement;
	const postcodeInputParent = postcodeInput.closest(
		'.formWrapper__inputWrapper'
	);
	const postcodeInputRow = postcodeInputParent.closest(
		'.formWrapper__inputRow'
	);
	const infoText = postcodeInputParent.querySelector(
		'.formWrapper__infoText'
	) as HTMLElement;
	const markup = `
		${getTranslation(
			'registration.preset.agency.prefix',
			isU25Registration()
		)} <br />
		<strong>${obj.name}</strong>
		${
			obj.teamAgency
				? `
							<br>
							<span class="formWrapper__infoText__text--tertiary">
								<span class='suggestionWrapper__item__content__teamAgency__icon'>
									<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewbox="0 0 72 72"><path d="M36,6 C52.5333333,6 66,19.4666667 66,36 C66,52.5333333 52.5333333,66 36,66 C19.4666667,66 6,52.5333333 6,36 C6,19.4666667 19.4666667,6 36,6 Z M29.3515625,50.4609375 L29.3515625,54.5625 L42.78125,54.5625 L42.78125,50.4609375 L39.5,49.7578125 L39.5,29.203125 L29,29.203125 L29,33.328125 L32.65625,34.03125 L32.65625,49.7578125 L29.3515625,50.4609375 Z M39.5,23.1328125 L39.5,18 L32.65625,18 L32.65625,23.1328125 L39.5,23.1328125 Z"/>
								</span>` +
				  getTranslation(
						'registration.agency.isteam',
						isU25Registration()
				  ) +
				  '</span>'
				: ''
		}
	`;

	postcodeInputRow.classList.add('formWrapper__inputRow--disabled');
	if (!obj.postcode) {
		postcodeInput
			.closest('.inputField__wrapper')
			.classList.add('inputField__wrapper--hide');
		const emptyPostcode = DEFAULT_POSTCODE;
		postcodeInput.value = emptyPostcode;
		postcodeInput.setAttribute('data-input-val', emptyPostcode);
	} else {
		postcodeInput.value = obj.postcode;
	}
	postcodeInput.readOnly = true;
	infoText.innerHTML = markup;
	postcodeInput.setAttribute('data-agency-id', agencyId);
};
