import { v4 as uuidv4 } from 'uuid';
import { appConfig } from './appConfig';
const requests: RequestLog[] = [];

export const REQUEST_LOGS_LIMIT = 10;
export const REQUEST_COLLECTOR_EVENT = 'requestCollector';

export class RequestLog {
	uuid: string = uuidv4();
	start: Date = new Date();
	url: string;
	method: string;
	status?: number;
	end?: Date;
	duration?: number;
	timeout?: number;

	constructor(url: string, method: string, timeout?: number) {
		this.url = url;
		this.method = method;
		this.timeout = timeout;
		requestCollector.update(this);
	}

	finish(status) {
		this.status = status;
		const end = new Date();
		this.end = end;
		this.duration = end.getTime() - this.start.getTime();
		requestCollector.update(this);
	}
}

export const requestCollector = {
	update(reqLog: RequestLog) {
		const i = requests.findIndex((request) => request.uuid === reqLog.uuid);
		if (i < 0) {
			requests.push(reqLog);
		} else {
			requests.splice(i, 1, reqLog);
		}
		requests.splice(
			0,
			requests.length -
				(appConfig?.requestCollector?.limit || REQUEST_LOGS_LIMIT)
		);
		window.dispatchEvent(new Event(REQUEST_COLLECTOR_EVENT));
	},

	get() {
		return requests.reverse();
	}
};
