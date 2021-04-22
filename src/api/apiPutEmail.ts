import { InputFieldLabelState } from '../components/inputField/InputField';
import { isStringValidEmail } from '../components/registration/registrationHelpers';
import { config } from '../resources/scripts/config';
import { translate } from '../resources/scripts/i18n/translate';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';

export const apiPutEmail = async (email: string): Promise<any> => {
	const url = config.endpoints.email;

	return fetchData({
		bodyData: email.trim(),
		url: url,
		method: FETCH_METHODS.PUT,
		responseHandling: [FETCH_ERRORS.CONFLICT_WITH_RESPONSE]
	});
};

export const validateEmail = (
	email
): { valid: InputFieldLabelState; label: string } => {
	if (email.length > 0 && isStringValidEmail(email)) {
		return {
			valid: 'valid',
			label: translate('furtherSteps.email.overlay.input.valid')
		};
	} else if (email.length > 0) {
		return {
			valid: 'invalid',
			label: translate('furtherSteps.email.overlay.input.invalid')
		};
	} else {
		return {
			valid: null,
			label: translate('furtherSteps.email.overlay.input.label')
		};
	}
};
