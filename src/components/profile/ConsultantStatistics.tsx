import * as React from 'react';
import { useEffect, useState } from 'react';
import {
	apiGetConsultantStatistics,
	ApiGetConsultantStatisticsInterface,
	ConsultantStatisticsDTO
} from '../../api';
import { Headline } from '../headline/Headline';
import { SelectDropdown, SelectDropdownItem } from '../select/SelectDropdown';
import { Text } from '../text/Text';
import { ReactComponent as PersonsIcon } from '../../resources/img/icons/persons.svg';
import { ReactComponent as SpeechBubbleIcon } from '../../resources/img/icons/speech-bubble.svg';
import { ReactComponent as DownloadIcon } from '../../resources/img/icons/download.svg';
import { CSVLink } from 'react-csv';
import { formatToDDMMYYYY } from '../../utils/dateHelpers';
import dayjs from 'dayjs';
import './statistics.styles';
import './profile.styles';
import { useTranslation } from 'react-i18next';
import { getTenantSettings } from '../../utils/tenantSettingsHelper';

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
		handleDropdownSelect: (selectedOption) =>
			setStatisticsPeriod(selectedOption.value),
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
				console.log(error);
			})
			.finally(() => {
				setIsRequestInProgress(false);
			});
	};

	return (
		<div className="statistics">
			<div className="profile__content__title">
				<Headline
					text={translate('profile.statistics.title')}
					semanticLevel="5"
				/>
			</div>
			<div className="statistics__periodSelect">
				<Text
					text={translate('profile.statistics.period.prefix')}
					type="infoLargeAlternative"
				/>
				<SelectDropdown {...selectDropdown} />
			</div>
			<div className="b--1 p--3 mb--4">
				<Text
					text={`${translate(
						'profile.statistics.period.display.prefix'
					)}${periodDisplay}${translate(
						'profile.statistics.period.display.suffix'
					)}`}
					className="text--center text--bold"
					type="standard"
				/>
				<div className="statistics__visuals__wrapper">
					<div className="statistics__visualization text--center br--1 pr--4">
						<span>
							<PersonsIcon aria-hidden="true" focusable="false" />
							<p>
								{selectedStatistics?.numberOfAssignedSessions ||
									0}
							</p>
						</span>
						<Text
							text={translate(
								'profile.statistics.csvHeader.numberOfAssignedSessions'
							)}
							type="standard"
						/>
					</div>
					<div className="statistics__visualization pl--4">
						<span>
							<SpeechBubbleIcon
								aria-hidden="true"
								focusable="false"
							/>
							<p>
								{selectedStatistics?.numberOfSentMessages || 0}
							</p>
						</span>
						<Text
							text={translate(
								'profile.statistics.csvHeader.numberOfSentMessages'
							)}
							type="standard"
						/>
					</div>
				</div>
			</div>
			{csvData && (
				<div className="statistics__download">
					<Text
						text={translate('profile.statistics.complete.title')}
						type="infoLargeAlternative"
					/>
					<CSVLink
						separator={';'}
						headers={csvHeaders}
						data={csvData}
						filename={`${translate(
							'profile.statistics.complete.filename'
						)} - ${periodDisplay}.csv`}
						className="button-as-link"
					>
						<DownloadIcon
							title={translate(
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
				</div>
			)}
		</div>
	);
};
