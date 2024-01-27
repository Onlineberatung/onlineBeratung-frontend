import { v4 as uuid } from 'uuid';
import { deepMerge } from '../helpers';
import { AppointmentsDataInterface } from '../../../src/globalState/interfaces';

export let appointments: AppointmentsDataInterface[] = [];

export const getAppointments = () => appointments;
export const setAppointments = (data) => (appointments = data);

export const removeAppointment = (index: number) => {
	appointments.splice(index, 1);
};

export const updateAppointment = (
	props: { [key: string]: any },
	index?: number
) => {
	let appointment;
	if (index !== undefined && appointments?.[index]) {
		appointment = deepMerge(appointments[index], props || {});
		appointments[index] = appointment;
	} else {
		appointment = deepMerge(props, {
			id: props.id || uuid()
		});
		appointments.push(appointment);
	}
	return appointment;
};

Cypress.Commands.add(
	'appointments',
	(props?: { [key: string]: any }, index?: number) =>
		new Cypress.Promise((resolve) => {
			let appointment = undefined;
			if (!props) {
				setAppointments([]);
			} else if (!props && index) {
				removeAppointment(index);
			} else {
				appointment = updateAppointment(props, index);
			}
			resolve(appointment);
		})
);
