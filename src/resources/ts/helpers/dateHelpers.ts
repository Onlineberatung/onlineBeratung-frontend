import { translate } from '../i18n/translate';

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
