import * as React from 'react';
import { useEffect, useState } from 'react';
import {
	apiGetConsultantStatistics,
	ApiGetConsultantStatisticsInterface,
	ConsultantStatisticsDTO
} from '../../api';
import { Headline } from '../headline/Headline';
import {
	SelectDropdown,
	SelectDropdownItem,
	SelectOption
} from '../select/SelectDropdown';
import PersonsIcon from '@mui/icons-material/Group';
import SpeechBubbleIcon from '@mui/icons-material/Chat';
import DownloadIcon from '@mui/icons-material/Download';
import { CSVLink } from 'react-csv';
import { formatToDDMMYYYY } from '../../utils/dateHelpers';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { getTenantSettings } from '../../utils/tenantSettingsHelper';
import { Box as MuiBox, Stack, Typography } from '@mui/material';

const statisticsPeriodOptionCurrentMonth = 'currentMonth';
const statisticsPeriodOptionLastMonth = 'lastMonth';
const statisticsPeriodOptionCurrentYear = 'currentYear';
const statisticsPeriodOptionLastYear = 'lastYear';

type statisticOptions =
	| typeof statisticsPeriodOptionCurrentMonth
	| typeof statisticsPeriodOptionLastMonth
	| typeof statisticsPeriodOptionCurrentYear
	| typeof statisticsPeriodOptionLastYear;

const getDatesForSelectedPeriod = (
	selectedOption: statisticOptions
): ApiGetConsultantStatisticsInterface => {
	const currentDate = dayjs();
	const currentYear = currentDate.get('year');
	const endOfLastMonth = currentDate.date(0);
	const daysInCurrentMonth = currentDate.daysInMonth();

	const optionDates = {
		lastMonth: {
			startDate: endOfLastMonth.date(1).format('YYYY-MM-DD'),
			endDate: endOfLastMonth.format('YYYY-MM-DD')
		},
		currentMonth: {
			startDate: currentDate.date(1).format('YYYY-MM-DD'),
			endDate: currentDate.date(daysInCurrentMonth).format('YYYY-MM-DD')
		},
		currentYear: {
			startDate: `${currentYear}-01-01`,
			endDate: `${currentYear}-12-31`
		},
		lastYear: {
			startDate: `${currentYear - 1}-01-01`,
			endDate: `${currentYear - 1}-12-31`
		}
	};
	return optionDates[selectedOption];
};

export const ConsultantStatistics = () => {
	const { t: translate } = useTranslation();
	const [isRequestInProgress, setIsRequestInProgress] =
		useState<boolean>(false);
	const [statisticsPeriod, setStatisticsPeriod] = useState<statisticOptions>(
		statisticsPeriodOptionCurrentMonth
	);
	const [periodDisplay, setPeriodDisplay] = useState<string>(
		translate('profile.statistics.period.display.default')
	);
	const [selectedStatistics, setSelectedStatistics] =
		useState<ConsultantStatisticsDTO>(null);
	const [csvData, setCsvData] = useState([]);
	const { featureAppointmentsEnabled } = getTenantSettings();

	const csvHeaders = [
		{
			label: translate(
				'profile.statistics.csvHeader.numberOfAssignedSessions'
			),
			key: 'numberOfAssignedSessions'
		},
		{
			label: translate(
				'profile.statistics.csvHeader.numberOfSentMessages'
			),
			key: 'numberOfSentMessages'
		},
		{
			label: translate(
				'profile.statistics.csvHeader.numberOfSessionsWhereConsultantWasActive'
			),
			key: 'numberOfSessionsWhereConsultantWasActive'
		},
		{
			label: translate('profile.statistics.csvHeader.videoCallDuration'),
			key: 'videoCallDuration'
		},
		featureAppointmentsEnabled && {
			label: translate(
				'profile.statistics.csvHeader.numberOfAppointments'
			),
			key: 'numberOfAppointments'
		}
	].filter(Boolean);

	const statisticsPeriodOptions: {
		value: statisticOptions;
		label: string;
	}[] = [
		{
			value: statisticsPeriodOptionCurrentMonth,
			label: translate('profile.statistics.period.currentMonth')
		},
		{
			value: statisticsPeriodOptionLastMonth,
			label: translate('profile.statistics.period.lastMonth')
		},
		{
			value: statisticsPeriodOptionCurrentYear,
			label: translate('profile.statistics.period.currentYear')
		},
		{
			value: statisticsPeriodOptionLastYear,
			label: translate('profile.statistics.period.lastYear')
		}
	];

	useEffect(() => {
		if (statisticsPeriod) {
			const dates: ApiGetConsultantStatisticsInterface =
				getDatesForSelectedPeriod(statisticsPeriod);
			getConsultantStatistics(dates.startDate, dates.endDate);
		}
	}, [statisticsPeriod]); // eslint-disable-line react-hooks/exhaustive-deps

	const getPeriodOptions = () => {
		return statisticsPeriodOptions.filter(
			(option) => option.value === statisticsPeriod
		)[0];
	};

	const preSelectedOption = statisticsPeriod
		? getPeriodOptions()
		: statisticsPeriodOptions[0];

	const selectDropdown: SelectDropdownItem = {
		id: 'statisticsSelect',
		selectedOptions: statisticsPeriodOptions,
		handleDropdownSelect: (selectedOption) => {
			const value = Array.isArray(selectedOption)
				? selectedOption[0]?.value
				: (selectedOption as SelectOption)?.value;
			if (value) {
				setStatisticsPeriod(value as statisticOptions);
			}
		},
		useIconOption: false,
		isSearchable: false,
		menuPlacement: 'bottom',
		defaultValue: preSelectedOption
	};

	const getConsultantStatistics = (startDate: string, endDate: string) => {
		if (isRequestInProgress) {
			return null;
		}
		setIsRequestInProgress(true);
		apiGetConsultantStatistics({ startDate, endDate })
			.then((response: ConsultantStatisticsDTO) => {
				const videoCallDurationMinutes = Math.floor(
					response.videoCallDuration / 60
				);
				const videoCallDurationSeconds =
					response.videoCallDuration % 60;
				const data = [
					{
						numberOfAssignedSessions:
							response.numberOfAssignedSessions,
						numberOfSentMessages: response.numberOfSentMessages,
						numberOfSessionsWhereConsultantWasActive:
							response.numberOfSessionsWhereConsultantWasActive,
						videoCallDuration:
							videoCallDurationMinutes +
							':' +
							videoCallDurationSeconds,
						numberOfAppointments:
							featureAppointmentsEnabled &&
							response.numberOfAppointments
					}
				];

				setCsvData(data);

				setSelectedStatistics(response);
				const startDateString = formatToDDMMYYYY(
					Date.parse(response.startDate)
				);
				const endDateString = formatToDDMMYYYY(
					Date.parse(response.endDate)
				);
				setPeriodDisplay(`${startDateString} - ${endDateString}`);
			})
			.catch((error) => {
				console.error(error);
			})
			.finally(() => {
				setIsRequestInProgress(false);
			});
	};

	return (
		<MuiBox>
			<Stack spacing={2}>
				<Headline
					text={translate('profile.statistics.title')}
					semanticLevel="5"
				/>
				<Stack spacing={2}>
					<Typography variant="body2" color="text.secondary">
						{translate('profile.statistics.period.prefix')}
					</Typography>
					<SelectDropdown {...selectDropdown} />
				</Stack>
				<MuiBox sx={{ border: 1, borderColor: 'divider', p: 3, borderRadius: 1 }}>
					<Typography variant="body1" align="center" fontWeight="bold" sx={{ mb: 2 }}>
						{translate('profile.statistics.period.display.prefix')}
						{periodDisplay}
						{translate('profile.statistics.period.display.suffix')}
					</Typography>
					<Stack direction="row" spacing={4} justifyContent="center">
						<Stack alignItems="center" spacing={1} sx={{ borderRight: 1, borderColor: 'divider', pr: 4 }}>
							<Stack direction="row" alignItems="center" spacing={1}>
								<PersonsIcon aria-hidden="true" focusable="false" />
								<Typography variant="h4">
									{selectedStatistics?.numberOfAssignedSessions || 0}
								</Typography>
							</Stack>
							<Typography variant="body2" align="center">
								{translate(
									'profile.statistics.csvHeader.numberOfAssignedSessions'
								)}
							</Typography>
						</Stack>
						<Stack alignItems="center" spacing={1} sx={{ pl: 4 }}>
							<Stack direction="row" alignItems="center" spacing={1}>
								<SpeechBubbleIcon
									aria-hidden="true"
									focusable="false"
								/>
								<Typography variant="h4">
									{selectedStatistics?.numberOfSentMessages || 0}
								</Typography>
							</Stack>
							<Typography variant="body2" align="center">
								{translate(
									'profile.statistics.csvHeader.numberOfSentMessages'
								)}
							</Typography>
						</Stack>
					</Stack>
				</MuiBox>
				{csvData && (
					<Stack direction="row" spacing={2} alignItems="center">
						<Typography variant="body2" color="text.secondary">
							{translate('profile.statistics.complete.title')}
						</Typography>
						<CSVLink
							separator={';'}
							headers={csvHeaders}
							data={csvData}
							filename={`${translate(
								'profile.statistics.complete.filename'
							)} - ${periodDisplay}.csv`}
							className="button-as-link"
							style={{ 
								display: 'flex', 
								alignItems: 'center', 
								gap: '8px',
								textDecoration: 'underline'
							}}
						>
							<DownloadIcon
								titleAccess={translate(
									'profile.statistics.complete.download.label'
								)}
								aria-label={translate(
									'profile.statistics.complete.download.label'
								)}
							/>
							{translate(
								'profile.statistics.complete.download.label'
							)}
						</CSVLink>
					</Stack>
				)}
			</Stack>
		</MuiBox>
	);
};
