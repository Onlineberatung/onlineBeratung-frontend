import { config } from '../resources/scripts/config';
import { FETCH_METHODS, fetchData } from './fetchData';

export const apiAppointmentSuccessfullySet = async (
	content: object,
	sessionId: number
): Promise<void> => {
	const url = `${config.endpoints.appointmentBase}/${sessionId}/enquiry/new`;
	const appointmentSuccessfullySetMessage = {
		...content,
		messageType: 'APPOINTMENT_SET'
	};
	return fetchData({
		url: url,
		rcValidation: true,
		method: FETCH_METHODS.POST,
		bodyData: JSON.stringify(appointmentSuccessfullySetMessage)
	});
};
