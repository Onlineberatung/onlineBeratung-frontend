import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import {
	apiGetConsultantStatistics,
	ApiGetConsultantStatisticsInterface,
	ConsultantStatisticsDTO
} from '../../api';
import { UserDataContext } from '../../globalState';
import { translate } from '../../utils/translate';
import { Headline } from '../headline/Headline';
import { SelectDropdown, SelectDropdownItem } from '../select/SelectDropdown';
import { Text } from '../text/Text';
import { ReactComponent as PersonsIcon } from '../../resources/img/icons/persons.svg';
import { ReactComponent as SpeechBubbleIcon } from '../../resources/img/icons/speech-bubble.svg';
import { ReactComponent as DownloadIcon } from '../../resources/img/icons/download.svg';
import { getValidDateFormatForSelectedDate } from '../groupChat/createChatHelpers';
import { CSVLink } from 'react-csv';
import { formatToDDMMYYYY } from '../../utils/dateHelpers';
import dayjs from 'dayjs';
import './profile.styles';

type statisticOptions =
	| 'lastMonth'
	| 'currentMonth'
	| 'currentYear'
	| 'lastYear';

const statisticsPeriodOptions: { value: statisticOptions; label: string }[] = [
	{
		value: 'lastMonth',
		label: translate('profile.statistics.period.lastMonth')
	},
	{
		value: 'currentMonth',
		label: translate('profile.statistics.period.currentMonth')
	},
	{
		value: 'currentYear',
		label: translate('profile.statistics.period.currentYear')
	},
	{
		value: 'lastYear',
		label: translate('profile.statistics.period.lastYear')
	}
];

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

const csvHeaders = [
	{
		label: translate(
			'profile.statistics.csvHeader.numberOfAssignedSessions'
		),
		key: 'numberOfAssignedSessions'
	},
	{
		label: translate('profile.statistics.csvHeader.numberOfSentMessages'),
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
	}
];

export const ConsultantStatistics = () => {
	const { userData } = useContext(UserDataContext);
	const [isRequestInProgress, setIsRequestInProgress] =
		useState<boolean>(false);
	const [statisticsPeriod, setStatisticsPeriod] =
		useState<statisticOptions>('lastMonth');
	const [periodDisplay, setPeriodDisplay] = useState<string>(
		translate('profile.statistics.period.display.default')
	);
	const [selectedStatistics, setSelectedStatistics] =
		useState<ConsultantStatisticsDTO>(null);
	const [csvData, setCsvData] = useState([]);

	useEffect(() => {
		//fetch complete statistics to deliver csv download
		const currentDate = getValidDateFormatForSelectedDate(new Date());
		getConsultantStatistics('1970-01-01', currentDate, true);
	}, []);

	useEffect(() => {
		if (statisticsPeriod) {
			const dates: ApiGetConsultantStatisticsInterface =
				getDatesForSelectedPeriod(statisticsPeriod);
			getConsultantStatistics(dates.startDate, dates.endDate);
		}
	}, [statisticsPeriod]);

	const getPeriodOptions = () => {
		return statisticsPeriodOptions.filter(
			(option) => option.value === statisticsPeriod
		)[0];
	};

	const preSelectedOption = statisticsPeriod
		? getPeriodOptions()
		: statisticsPeriodOptions[1];
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

	const getConsultantStatistics = (
		startDate: string,
		endDate: string,
		generatePdf: boolean = false
	) => {
		if (isRequestInProgress) {
			return null;
		}
		setIsRequestInProgress(true);
		apiGetConsultantStatistics({ startDate, endDate })
			.then((response: ConsultantStatisticsDTO) => {
				if (generatePdf) {
					const videoCallDurationInMinutes =
						response.videoCallDuration / 60;
					const data = [
						{
							numberOfAssignedSessions:
								response.numberOfAssignedSessions,
							numberOfSentMessages: response.numberOfSentMessages,
							numberOfSessionsWhereConsultantWasActive:
								response.numberOfSessionsWhereConsultantWasActive,
							videoCallDuration:
								videoCallDurationInMinutes === 0
									? 0
									: videoCallDurationInMinutes.toFixed(2)
						}
					];
					setCsvData(data);
				} else {
					setSelectedStatistics(response);
					const startDateString = formatToDDMMYYYY(
						Date.parse(response.startDate)
					);
					const endDateString = formatToDDMMYYYY(
						Date.parse(response.endDate)
					);
					setPeriodDisplay(`${startDateString} - ${endDateString}`);
				}
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
			<div>
				<Text
					text={`${translate(
						'profile.statistics.period.display.prefix'
					)}${periodDisplay}${translate(
						'profile.statistics.period.display.suffix'
					)}`}
					type="infoLargeAlternative"
				/>
				<div className="statistics__visuals__wrapper">
					<div className="statistics__visualization">
						<span>
							<PersonsIcon />
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
					<div className="statistics__visualization">
						<span>
							<SpeechBubbleIcon />
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
						filename={translate(
							'profile.statistics.complete.filename'
						)}
					>
						<DownloadIcon />
						{translate(
							'profile.statistics.complete.download.label'
						)}
					</CSVLink>
				</div>
			)}
		</div>
	);
};
