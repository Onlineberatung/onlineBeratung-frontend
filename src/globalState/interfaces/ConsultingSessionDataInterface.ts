import { TopicsDataInterface } from './TopicsDataInterface';

export interface ConsultingSessionDataInterface {
	age: number;
	agencyId: number;
	askerId: string;
	askerRcId: string;
	askerUserName: string;
	consultantId: string;
	consultantRcId: string;
	consultingType: number;
	counsellingRelation: string;
	feedbackGroupId: string;
	gender: string;
	groupId: string;
	id: number;
	isMonitoring: boolean;
	isTeamSession: boolean;
	mainTopic: TopicsDataInterface;
	postcode: string;
	topics: TopicsDataInterface[];
}
