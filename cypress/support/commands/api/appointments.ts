import { endpoints } from '../../../../src/resources/scripts/endpoints';
import {
	getAppointments,
	setAppointments,
	updateAppointment
} from '../helper/appointments';

const appointmentsApi = (cy) => {
	cy.intercept('GET', `${endpoints.appointmentsServiceBase}/*`, (req) => {
		const urlPathname = new URL(req.url).pathname;
		const uuid = urlPathname.substring(urlPathname.lastIndexOf('/') + 1);
		const appointment = getAppointments().find((a) => a.id === uuid);
		if (appointment) {
			req.reply(appointment);
			return;
		}
		req.reply({ statusCode: 404 });
	}).as('appointment_get');

	cy.intercept('PUT', `${endpoints.appointmentsServiceBase}/*`, (req) => {
		const urlPathname = new URL(req.url).pathname;
		const uuid = urlPathname.substring(urlPathname.lastIndexOf('/') + 1);
		const index = getAppointments().findIndex((a) => a.id === uuid);

		req.reply(updateAppointment(req.body, index));
	}).as('appointment_put');

	cy.intercept('DELETE', `${endpoints.appointmentsServiceBase}/*`, (req) => {
		const urlPathname = new URL(req.url).pathname;
		const uuid = urlPathname.substring(urlPathname.lastIndexOf('/') + 1);
		const index = getAppointments().findIndex((a) => a.id === uuid);
		const newAppointments = [...getAppointments()];
		if (index >= 0) {
			newAppointments.splice(index, 1);
		}
		setAppointments(newAppointments);

		req.reply({});
	}).as('appointment_delete');

	cy.intercept('GET', endpoints.appointmentsServiceBase, (req) => {
		req.reply([...getAppointments()]);
	}).as('appointments_get');

	cy.intercept('POST', endpoints.appointmentsServiceBase, (req) => {
		req.reply(updateAppointment(req.body));
	}).as('appointments_post');
};

export default appointmentsApi;
