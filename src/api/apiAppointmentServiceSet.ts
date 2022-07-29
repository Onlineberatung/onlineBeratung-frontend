import { config } from '../resources/scripts/config';
import { FETCH_METHODS, fetchData } from './fetchData';

export const apiAppointmentServiceSet = async (
	content: object,
	sessionId: number
): Promise<void> => {
	const appointmentSuccessfullySetMessage = {
		...content,
		messageType: 'APPOINTMENT_SET'
	};
	const url = config.endpoints.appointmentBaseNew(sessionId);
	return fetchData({
		url,
		rcValidation: true,
		method: FETCH_METHODS.POST,
		bodyData: JSON.stringify(appointmentSuccessfullySetMessage)
	});
};
