import { translate } from '../../../resources/ts/i18n/translate';
import { getValidTimeFormatForSelectedTime } from '../../groupChat/ts/createChatHelpers';

export const getChatDate = (startDate, startTime) => {
	return new Date(
		new Date(startDate).getFullYear(),
		new Date(startDate).getMonth(),
		new Date(startDate).getDate(),
		startTime.slice(0, 2),
		startTime.slice(3, 5)
	);
};

export const getGroupChatDate = (
	listItem,
	isShortVersion?: boolean,
	onlyStartDate?: boolean,
	onlyStartTime?: boolean
) => {
	const startDate = listItem.startDate;
	const startTime = listItem.startTime;
	const duration = listItem.duration;
	const chatDate = getChatDate(startDate, startTime);

	const startDateFormatOptions =
		listItem.repetitive && !onlyStartDate
			? { weekday: 'short' }
			: {
					weekday: 'short',
					year: '2-digit',
					month: '2-digit',
					day: '2-digit'
			  };
	const newStartDate = chatDate.toLocaleDateString(
		'de-DE',
		startDateFormatOptions
	);
	const formatedStartDate = newStartDate.slice(0, 2) + newStartDate.slice(3);

	const formatedStartTime = getValidTimeFormatForSelectedTime(chatDate);
	const formatedEndTime = getValidTimeFormatForSelectedTime(
		new Date(chatDate.getTime() + duration * 60000)
	);

	if (isShortVersion) {
		return `${formatedStartTime} ${translate(
			'sessionList.time.label.postfix'
		)} - ${formatedEndTime} ${translate('sessionList.time.label.postfix')}`;
	} else if (onlyStartDate) {
		return formatedStartDate;
	} else if (onlyStartTime) {
		return `${formatedStartTime} ${translate(
			'sessionList.time.label.postfix'
		)}`;
	} else {
		return `${formatedStartDate}${
			listItem.repetitive ? '' : ','
		} ${formatedStartTime} ${translate(
			'sessionList.time.label.postfix'
		)} - ${formatedEndTime} ${translate('sessionList.time.label.postfix')}`;
	}
};
