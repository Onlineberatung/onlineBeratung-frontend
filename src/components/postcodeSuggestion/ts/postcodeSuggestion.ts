import 'js-autocomplete/auto-complete';
import { renderAgency } from './renderAgency';
import {
	getConsultingTypeFromRegistration,
	POSTCODE_FALLBACK_LINK,
	hasConsultingTypeLongPostcodeValidation
} from '../../../resources/ts/helpers/resorts';
import { ajaxCallPostcodeSuggestion } from '../../apiWrapper/ts/ajaxCallPostcode';
import { translate } from '../../../resources/ts/i18n/translate';
import {
	warningLabelForTranslatableAndParentId,
	handleWarningLabelOnInput
} from '../../registrationFormular/ts/warningLabels';
import { FETCH_ERRORS } from '../../apiWrapper/ts/fetchData';

const MAX_AGENCY_SUGGESTION = 3;

export const VALID_POSTCODE_LENGTH = {
	SHORT: 3,
	LONG: 5,
	MAX: 5
};

export const validPostcodeLengthForConsultingType = (
	postcodeLength: number
) => {
	if (hasConsultingTypeLongPostcodeValidation()) {
		return postcodeLength == VALID_POSTCODE_LENGTH.LONG;
	} else {
		return postcodeLength >= VALID_POSTCODE_LENGTH.SHORT;
	}
};

export const hasPostcodeToBeExtended = (postcodeLength: number) =>
	postcodeLength >= VALID_POSTCODE_LENGTH.SHORT &&
	postcodeLength <= VALID_POSTCODE_LENGTH.MAX;

export const addPostcodeListener = (target: string) => {
	const input = document.getElementById(target) as HTMLInputElement;

	input.addEventListener('input', (e) => {
		const inputVal = input.value;
		const whiteSpotWarning = document.querySelector('.warning__link');
		if (validPostcodeLengthForConsultingType(inputVal.length)) {
			ajaxCallPostcodeSuggestion({
				postcode: inputVal,
				consultingType: getConsultingTypeFromRegistration()
			})
				.then((response) => {
					whiteSpotWarning
						? handleWarningLabelOnInput(e, true)
						: null;
					initPostcodeSuggestion(response, inputVal);
				})
				.catch((error) => {
					if (error.message === FETCH_ERRORS.EMPTY) {
						initPostcodeFallback();
					}
					return null;
				});
		} else {
			hideElement(document.getElementById('suggestionLayer'));
			whiteSpotWarning ? handleWarningLabelOnInput(e, true) : null;
		}
	});
};

export const initPostcodeSuggestion = (data: Array<any>, inputVal: string) => {
	let agencyCount = 0;
	const suggestionLayer = document.getElementById('suggestionLayer');
	emptyAgencyResults(suggestionLayer);
	showSuggestionWrapper(suggestionLayer);

	if (typeof data === 'string') {
		data = JSON.parse(data);
	}

	for (let i = 0; i < data.length; i++) {
		const agencyData = data[i];
		++agencyCount;
		const agencyDescr = agencyData.description;
		const agencyID = agencyData.id;
		const agencyPostcode = agencyData.postcode;
		const agencyName = agencyData.name;
		const isTeamAgency = agencyData.teamAgency;

		if (
			agencyCount <= MAX_AGENCY_SUGGESTION ||
			inputVal.length === VALID_POSTCODE_LENGTH.MAX
		) {
			renderAgency(
				agencyDescr,
				agencyID,
				agencyPostcode,
				agencyName,
				isTeamAgency
			);
		} else {
			emptyAgencyResults(suggestionLayer);
		}
	}
	addClickHandlers(suggestionLayer, inputVal);
};

const emptyAgencyResults = (item: HTMLElement) => {
	item.innerHTML = null;
};

const initPostcodeFallback = () => {
	const postcodeInput = document
		.querySelector('.inputField__wrapper.formWrapper.postcode')
		.querySelector('.formWrapper__infoText.warning');
	if (!postcodeInput) {
		const fallbackLink =
			POSTCODE_FALLBACK_LINK[getConsultingTypeFromRegistration()] || null;
		if (fallbackLink) {
			const suggestionLayer = document.getElementById('suggestionLayer');
			emptyAgencyResults(suggestionLayer);
			document
				.getElementById('postcode')
				.setAttribute('data-postcodefallback', 'error');
			const errorText = `${translate(
				'warningLabels.postcode.unavailable'
			)} <a class="warning__link" href="${fallbackLink}" target="_blank">${translate(
				'warningLabels.postcode.search'
			)}</a>`;
			warningLabelForTranslatableAndParentId(errorText, 'postcode', true);
		}
	}
};

const addClickHandlers = (suggestionLayer: HTMLElement, inputVal: string) => {
	let agencyItems = document.querySelectorAll('.suggestionWrapper__item');
	const input = document.getElementById('postcode') as HTMLInputElement;

	hasConsultingTypeLongPostcodeValidation()
		? hideElement(suggestionLayer)
		: null;

	Array.from(agencyItems).forEach((item) => {
		const itemPostcodeElement = item.querySelector(
			'.suggestionWrapper__item__content__postcode'
		);
		let itemPostcode = itemPostcodeElement
			? itemPostcodeElement.textContent
			: '';

		if (!itemPostcode) {
			itemPostcode = item.querySelector(
				'.suggestionWrapper__item__content__name'
			).textContent;
		}

		item.addEventListener('click', (e) => {
			e.stopPropagation();
			input.type =
				isNaN(parseInt(itemPostcode)) ||
				parseInt(itemPostcode).toString().length <
					VALID_POSTCODE_LENGTH.MAX
					? 'text'
					: 'number';
			input.value = itemPostcode;
			showElement(suggestionLayer);
			setAgencyId(item as HTMLElement, inputVal);
			emptyAgencyResults(suggestionLayer);
		});
	});

	document.addEventListener('click', () => {
		hideElement(suggestionLayer);
	});
};

export const setFirstAgencyId = () => {
	const firstAgency = document.querySelector(
		'.suggestionWrapper__item'
	) as HTMLElement;
	firstAgency ? setAgencyId(firstAgency) : null;
};

const showElement = (item: HTMLElement) => {
	item.innerHTML = '';
};

const hideElement = (item: HTMLElement) => {
	item.style.display = 'none';
};

const showSuggestionWrapper = (item: HTMLElement) => {
	item.style.display = 'block';
};

const setAgencyId = (item: HTMLElement, inputVal?: string) => {
	const agencyId = item.dataset.agencyId;
	const postcodeInput = document.getElementById(
		'postcode'
	) as HTMLInputElement;

	postcodeInput.setAttribute('data-agency-id', agencyId);
	inputVal ? postcodeInput.setAttribute('data-input-val', inputVal) : null;
};
