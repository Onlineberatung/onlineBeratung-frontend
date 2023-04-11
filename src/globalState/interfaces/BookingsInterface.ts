export interface BookingEventsInterface {
	endTime: string;
	eventTypeId: number;
	id: number;
	startTime: string;
	location: 'CHAT' | 'PHONE_CALL' | 'VIDEO_CALL' | 'IN_PERSON';
	description: string;
	uid: string;
	userId: number;
	rescheduleLink?: string;
	consultantName?: string;
	askerId?: string;
	askerName?: string;
	title: string;
	videoAppointmentId: string;
}

export interface BookingEventUiInterface {
	id: number;
	rescheduleLink?: string;
	uid: string;
	date: string;
	duration: string;
	location: 'CHAT' | 'PHONE_CALL' | 'VIDEO_CALL' | 'IN_PERSON';
	counselor: string;
	askerId: string;
	askerName: string;
	description: string;
	title: string;
	videoAppointmentId: string;
	expanded: boolean;
}
