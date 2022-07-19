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
	//TODO Andre: should be removed
	expanded: boolean;
	title: string;
}
