import { config } from '../resources/scripts/config';
import { fetchData, FETCH_METHODS } from './fetchData';

export const apiAppointmentSuccessfullySet = async (
	content: string,
	rcGroupId: string
): Promise<void> => {
	const url = config.endpoints.setAppointmentSuccessMessage;
	const appointmentSuccessfullySetMessage = JSON.stringify({
		content: content,
		messageType: 'APPOINTMENT_SET'
	});
	const headersData = { rcGroupId: rcGroupId };
	return fetchData({
		url: url,
		headersData: headersData,
		method: FETCH_METHODS.POST,
		bodyData: appointmentSuccessfullySetMessage
	});
};
