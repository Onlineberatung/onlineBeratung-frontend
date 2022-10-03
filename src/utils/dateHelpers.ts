import { translate } from './translate';

export const MILLISECONDS_PER_SECOND = 1000;
export const MILLISECONDS_PER_MINUTE = 60 * MILLISECONDS_PER_SECOND;
export const MILLISECONDS_PER_HOUR = 60 * MILLISECONDS_PER_MINUTE;

export const formatToDDMMYYYY = (
	unixDate: number,
	twoDigits: boolean = false
) => {
	const date = new Date(unixDate);

	return date.toLocaleDateString('de-DE', {
		day: twoDigits ? '2-digit' : 'numeric',
		month: twoDigits ? '2-digit' : 'numeric',
		year: 'numeric'
	});
};

const printPrettyDate = (
	messageDate: number,
	showDayOfTheWeek: boolean = false,
	twoDigits: boolean = false
) => {
	const date = formatToDDMMYYYY(messageDate, twoDigits);

	const currentDate = new Date();
	const currentDateStr = currentDate.toLocaleDateString('de-DE', {
		day: twoDigits ? '2-digit' : 'numeric',
		month: twoDigits ? '2-digit' : 'numeric',
		year: 'numeric'
	});

	const yesterday = new Date(currentDate.setDate(currentDate.getDate() - 1));
	const yesterdayStr = yesterday.toLocaleDateString('de-DE', {
		day: twoDigits ? '2-digit' : 'numeric',
		month: twoDigits ? '2-digit' : 'numeric',
		year: 'numeric'
	});

	const dayBeforeYesterday = new Date(
		currentDate.setDate(currentDate.getDate() - 1)
	);
	const dayBeforeYesterdayStr = dayBeforeYesterday.toLocaleDateString(
		'de-DE',
		{
			day: twoDigits ? '2-digit' : 'numeric',
			month: twoDigits ? '2-digit' : 'numeric',
			year: 'numeric'
		}
	);

	const tomorrow = new Date(currentDate.setDate(currentDate.getDate() + 3));
	const tomorrowStr = tomorrow.toLocaleDateString('de-DE', {
		day: twoDigits ? '2-digit' : 'numeric',
		month: twoDigits ? '2-digit' : 'numeric',
		year: 'numeric'
	});

	if (date === currentDateStr) {
		return translate('message.today');
	} else if (date === yesterdayStr) {
		return translate('message.yesterday');
	} else if (date === dayBeforeYesterdayStr) {
		return translate('message.dayBeforeYesterday');
	} else if (date === tomorrowStr) {
		return translate('message.tomorrow');
	} else if (showDayOfTheWeek) {
		const dayDate = new Date(messageDate);
		return translate(`date.day.${dayDate.getDay()}`) + ', ' + date;
	} else {
		return date;
	}
};

export const getPrettyDateFromMessageDate = (
	messageDate: number,
	showDayOfTheWeek: boolean = false,
	twoDigits: boolean = false
) => {
	return printPrettyDate(messageDate * 1000, showDayOfTheWeek, twoDigits);
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
export const prettyPrintTimeDifference = (
	t1: number,
	t2: number,
	includeIn = false
): string => {
	const deltaT = t2 - t1;
	const hours = Math.trunc(deltaT / MILLISECONDS_PER_HOUR);
	const minutes = Math.trunc(
		(deltaT % MILLISECONDS_PER_HOUR) / MILLISECONDS_PER_MINUTE
	);

	const prefix = includeIn
		? hours < 0 || minutes < 0
			? 'vor'
			: 'in'
		: 'vor';

	// TODO: Revise hard-coded locale once internationalization is implemented
	return hours === 0 && minutes === 0
		? 'jetzt'
		: `${prefix} ${hours ? `${hours} h ` : ''}${minutes} min`;
};

export const convertISO8601ToMSSinceEpoch = (iso8601Date) => {
	return new Date(iso8601Date).getTime();
};

export const dateToLocalISO = (date: Date) => {
	return `${date.getFullYear()}-${(date.getMonth() + 101)
		.toString()
		.substring(1)}-${(date.getDate() + 100).toString().substring(1)} ${(
		date.getHours() + 100
	)
		.toString()
		.substring(1)}:${(date.getMinutes() + 100).toString().substring(1)}`;
};

export const addMissingZero = (value: number) => {
	if (value < 10) {
		return '0' + value;
	} else {
		return value;
	}
};
