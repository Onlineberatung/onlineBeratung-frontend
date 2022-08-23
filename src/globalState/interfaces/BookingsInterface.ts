export interface BookingEventsInterface {
	endTime: string;
	eventTypeId: number;
	id: number;
	startTime: string;
	description: string;
	uid: string;
	userId: number;
	rescheduleLink?: string;
	consultantName?: string;
	askerId?: string;
	askerName?: string;
	title: string;
}

export interface BookingEventUiInterface {
	id: number;
	rescheduleLink?: string;
	uid: string;
	date: string;
	duration: string;
	counselor: string;
	askerId: string;
	askerName: string;
	description: string;
	title: string;
	expanded: boolean;
}
