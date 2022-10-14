export const TOPIC_LENGTHS = {
	MIN: 3,
	MAX: 50
};

export const durationSelectOptionsSet = [
	{
		value: '30',
		label: 'groupChat.create.durationSelect.option1'
	},
	{
		value: '60',
		label: 'groupChat.create.durationSelect.option2'
	},
	{
		value: '90',
		label: 'groupChat.create.durationSelect.option3'
	},
	{
		value: '120',
		label: 'groupChat.create.durationSelect.option4'
	},
	{
		value: '150',
		label: 'groupChat.create.durationSelect.option5'
	},
	{
		value: '180',
		label: 'groupChat.create.durationSelect.option6'
	}
];

const getTwoDigitFormat = (value: number) => {
	return ('0' + value).slice(-2);
};

export const getValidDateFormatForSelectedDate = (selectedDate): string => {
	return `${selectedDate.getFullYear()}-${getTwoDigitFormat(
		selectedDate.getMonth() + 1
	)}-${getTwoDigitFormat(selectedDate.getDate())}`;
};

export const getValidTimeFormatForSelectedTime = (selectedTime): string => {
	return `${getTwoDigitFormat(selectedTime.getHours())}:${getTwoDigitFormat(
		selectedTime.getMinutes()
	)}`;
};
