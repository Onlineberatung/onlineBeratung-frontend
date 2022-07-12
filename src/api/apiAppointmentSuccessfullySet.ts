import { config } from '../resources/scripts/config';
import { FETCH_METHODS, fetchData } from './fetchData';

export const apiAppointmentSuccessfullySet = async (
	content: object,
	sessionId: number,
	isInitialMessage: boolean,
	rcGroupId: string
): Promise<void> => {
	const appointmentSuccessfullySetMessage = {
		...content,
		messageType: 'APPOINTMENT_SET'
	};
	if (isInitialMessage) {
		const url = `${config.endpoints.appointmentBase}/${sessionId}/enquiry/new`;
		return fetchData({
			url: url,
			rcValidation: true,
			method: FETCH_METHODS.POST,
			bodyData: JSON.stringify(appointmentSuccessfullySetMessage)
		});
	} else {
		const appointmentSuccessfullySetMessage = JSON.stringify({
			content: JSON.stringify(content),
			messageType: 'APPOINTMENT_SET'
		});

		const url = config.endpoints.setAppointmentSuccessMessage;
		return fetchData({
			url: url,
			headersData: { rcGroupId: rcGroupId },
			rcValidation: true,
			method: FETCH_METHODS.POST,
			bodyData: appointmentSuccessfullySetMessage
		});
	}
};
