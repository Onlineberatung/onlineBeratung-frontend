import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS } from './fetchData';

export interface ConsultantStatisticsDTO {
	startDate: string;
	endDate: string;
	numberOfAssignedSessions: number;
	numberOfSentMessages: number;
	numberOfSessionsWhereConsultantWasActive: number;
	videoCallDuration: number;
	numberOfAppointments: number;
}

export interface ApiGetConsultantStatisticsInterface {
	startDate: string;
	endDate: string;
}

export const apiGetConsultantStatistics = async ({
	startDate,
	endDate
}: ApiGetConsultantStatisticsInterface): Promise<ConsultantStatisticsDTO> => {
	const url =
		endpoints.consultantStatistics +
		`?startDate=${startDate}&endDate=${endDate}`;

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET
	});
};
