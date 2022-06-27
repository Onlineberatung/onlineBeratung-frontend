import { translate } from './translate';

export const MILLISECONDS_PER_SECOND = 1000;
export const MILLISECONDS_PER_MINUTE = 60 * MILLISECONDS_PER_SECOND;
export const MILLISECONDS_PER_HOUR = 60 * MILLISECONDS_PER_MINUTE;

export const formatToDDMMYYYY = (unixDate: number) => {
	const date = new Date(unixDate);
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();

	return day + '.' + month + '.' + year;
};

const printPrettyDate = (messageDate: number) => {
	const date = formatToDDMMYYYY(messageDate);
	const currentDate = new Date();
	const currentDateStr = formatToDDMMYYYY(currentDate.getTime());

	const yesterday = new Date(currentDate.setDate(currentDate.getDate() - 1));
	const yesterdayStr = yesterday.toLocaleDateString();

	const dayBeforeYesterday = new Date(
		currentDate.setDate(currentDate.getDate() - 1)
	);
	const dayBeforeYesterdayStr = dayBeforeYesterday.toLocaleDateString();

	if (date === currentDateStr) {
		return translate('message.today');
	} else if (date === yesterdayStr) {
		return translate('message.yesterday');
	} else if (date === dayBeforeYesterdayStr) {
		return translate('message.dayBeforeYesterday');
	} else {
		return date;
	}
};

export const getPrettyDateFromMessageDate = (messageDate: number) => {
	let messageDateFormated = messageDate * 1000;
	let prettyDate = printPrettyDate(messageDateFormated);

	return prettyDate;
};

export const formatToHHMM = (timestamp: string) => {
	const unixDate = parseInt(timestamp);
	const date = new Date(unixDate);
	const hours = date.getHours();
	let minutes: string = date.getMinutes().toString();
	if (parseInt(minutes, 10) < 10) {
		minutes = '0' + minutes;
	}
	return hours + ':' + minutes;
};

// Expects milliseconds since epoch
export const prettyPrintTimeDifference = (t1: number, t2: number): string => {
	const deltaT = t2 - t1;
	const hours = Math.trunc(deltaT / MILLISECONDS_PER_HOUR);
	const minutes = Math.trunc(
		(deltaT % MILLISECONDS_PER_HOUR) / MILLISECONDS_PER_MINUTE
	);

	// TODO: Revise hard-coded locale once internationalization is implemented
	return hours === 0 && minutes === 0
		? 'jetzt'
		: `vor ${hours ? `${hours} h ` : ''}${minutes} min`;
};

export const convertISO8601ToMSSinceEpoch = (iso8601Date) => {
	return new Date(iso8601Date).getTime();
};

export const getMonthFromString = (month: string) => {
	const date = Date.parse(month + '1, 2012');
	if (!isNaN(date)) {
		return String(new Date(date).getMonth() + 1).padStart(2, '0');
	}
	return -1;
};

export const getWeekDayFromPrefix = (weekday: string) => {
	let weekDay = '';
	switch (weekday) {
		case 'Mon,':
			weekDay = translate('dates.Monday');
			break;
		case 'Tue,':
			weekDay = translate('dates.Tuesday');
			break;
		case 'Wed,':
			weekDay = translate('dates.Wednesday');
			break;
		case 'Thu,':
			weekDay = translate('dates.Thursday');
			break;
		case 'Fri,':
			weekDay = translate('dates.Friday');
			break;
		case 'Sat,':
			weekDay = translate('dates.Saturday');
			break;
		case 'Sun,':
			weekDay = translate('dates.Sunday');
			break;
	}
	return weekDay;
};

export const addMinutesToDateTime = (date: number, addminutes: number) => {
	return new Date(date).setMinutes(new Date(date).getMinutes() + addminutes);
};
