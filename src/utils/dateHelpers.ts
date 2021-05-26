import { translate } from './translate';

const MILLISECONDS_PER_SECOND = 1000;
const MILLISECONDS_PER_MINUTE = 60 * MILLISECONDS_PER_SECOND;
const MILLISECONDS_PER_HOUR = 60 * MILLISECONDS_PER_MINUTE;

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

export const prettyPrintTimeSince = (secondsSinceEpoch: number) => {
	const now = Date.now();
	const deltaT = now - secondsSinceEpoch * MILLISECONDS_PER_SECOND;
	const hours = Math.trunc(deltaT / MILLISECONDS_PER_HOUR);
	const minutes = Math.trunc(
		(deltaT % MILLISECONDS_PER_HOUR) / MILLISECONDS_PER_MINUTE
	);

	// TODO: Revise hard-coded locale once internationalization is implemented
	return `vor ${hours ? `${hours}h ` : ''}${minutes}min`;
};
