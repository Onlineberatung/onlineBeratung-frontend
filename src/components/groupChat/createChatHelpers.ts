import { translate } from '../../resources/scripts/i18n/translate';
import { OverlayItem, OVERLAY_FUNCTIONS } from '../overlay/Overlay';
import { BUTTON_TYPES } from '../button/Button';
import { ReactComponent as CheckIcon } from '../../resources/img/illustrations/check.svg';
import { ReactComponent as XIcon } from '../../resources/img/illustrations/x.svg';

export const TOPIC_LENGTHS = {
	MIN: 3,
	MAX: 50
};

export const durationSelectOptionsSet = [
	{
		value: '30',
		label: translate('groupChat.create.durationSelect.option1')
	},
	{
		value: '60',
		label: translate('groupChat.create.durationSelect.option2')
	},
	{
		value: '90',
		label: translate('groupChat.create.durationSelect.option3')
	},
	{
		value: '120',
		label: translate('groupChat.create.durationSelect.option4')
	},
	{
		value: '150',
		label: translate('groupChat.create.durationSelect.option5')
	},
	{
		value: '180',
		label: translate('groupChat.create.durationSelect.option6')
	}
];

export const createChatSuccessOverlayItem: OverlayItem = {
	svg: CheckIcon,
	headline: translate('groupChat.createSuccess.overlayHeadline'),
	buttonSet: [
		{
			label: translate('groupChat.createSuccess.overlay.buttonLabel'),
			function: OVERLAY_FUNCTIONS.CLOSE,
			type: BUTTON_TYPES.SECONDARY
		}
	]
};

export const createChatErrorOverlayItem: OverlayItem = {
	svg: XIcon,
	headline: translate('groupChat.createError.overlay.headline'),
	buttonSet: [
		{
			label: translate('groupChat.createError.overlay.buttonLabel'),
			function: OVERLAY_FUNCTIONS.CLOSE,
			type: BUTTON_TYPES.AUTO_CLOSE
		}
	]
};

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
