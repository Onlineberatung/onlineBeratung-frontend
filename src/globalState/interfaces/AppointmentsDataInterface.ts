export const STATUS_CREATED = 'created';
export const STATUS_PAUSED = 'paused';
export const STATUS_STARTED = 'started';

export interface AppointmentsDataInterface {
	id?: string;
	status?:
		| typeof STATUS_CREATED
		| typeof STATUS_PAUSED
		| typeof STATUS_STARTED;
	description?: string;
	datetime?: string;
}
