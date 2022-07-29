import { config } from '../resources/scripts/config';
import { fetchData, FETCH_METHODS } from './fetchData';

export enum ALIAS_MESSAGE_TYPES {
	E2EE_ACTIVATED = 'E2EE_ACTIVATED',
	FINISHED_CONVERSATION = 'FINISHED_CONVERSATION',
	FORWARD = 'FORWARD',
	FURTHER_STEPS = 'FURTHER_STEPS',
	UPDATE_SESSION_DATA = 'UPDATE_SESSION_DATA',
	VIDEOCALL = 'VIDEOCALL',
	USER_MUTED = 'USER_MUTED',
	USER_UNMUTED = 'USER_UNMUTED',
	REASSIGN_CONSULTANT = 'REASSIGN_CONSULTANT',
	MASTER_KEY_LOST = 'MASTER_KEY_LOST',
	REASSIGN_CONSULTANT_RESET_LAST_MESSAGE = 'REASSIGN_CONSULTANT_RESET_LAST_MESSAGE',
	APPOINTMENT_SET = 'APPOINTMENT_SET',
	APPOINTMENT_CANCELLED = 'APPOINTMENT_CANCELLED',
	APPOINTMENT_RESCHEDULED = 'APPOINTMENT_RESCHEDULED'
}
export interface ConsultantReassignment {
	toConsultantId: string;
	toConsultantName: string;
	toAskerName: string;
	fromConsultantName: string;
	status: ReassignStatus;
}

export enum ReassignStatus {
	REQUESTED = 'REQUESTED',
	CONFIRMED = 'CONFIRMED',
	REJECTED = 'REJECTED'
}
interface AliasMessageParams {
	rcGroupId: string;
	type: ALIAS_MESSAGE_TYPES;
	args?: ConsultantReassignment;
}

export const apiSendAliasMessage = async ({
	rcGroupId,
	type,
	args
}: AliasMessageParams): Promise<any> => {
	const url = `${config.endpoints.sendAliasMessage}`;

	return fetchData({
		url,
		headersData: { rcGroupId },
		method: FETCH_METHODS.POST,
		rcValidation: true,
		bodyData: JSON.stringify({
			messageType: type,
			args: args
		})
	});
};
