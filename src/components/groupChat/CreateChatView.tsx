import * as React from 'react';
import { useEffect, useContext, useState } from 'react';
import { translate } from '../../resources/scripts/i18n/translate';
import { mobileDetailView, mobileListView } from '../app/navigationHandler';
import {
	ActiveSessionGroupIdContext,
	ACTIVE_SESSION,
	AcceptedGroupIdContext,
	getActiveSession,
	SessionsDataContext,
	getSessionsDataWithChangedValue
} from '../../globalState';
import { InputField, InputFieldItem } from '../inputField/InputField';
import { Checkbox, CheckboxItem } from '../checkbox/Checkbox';
import { SelectDropdown, SelectDropdownItem } from '../select/SelectDropdown';
import {
	TOPIC_LENGTHS,
	durationSelectOptionsSet,
	getValidDateFormatForSelectedDate,
	getValidTimeFormatForSelectedTime,
	createChatSuccessOverlayItem,
	createChatErrorOverlayItem
} from './createChatHelpers';
import { ButtonItem, BUTTON_TYPES, Button } from '../button/Button';
import {
	OVERLAY_FUNCTIONS,
	OverlayWrapper,
	Overlay,
	OverlayItem
} from '../overlay/Overlay';
import DatePicker, { registerLocale } from 'react-datepicker/dist/es';
import de from 'date-fns/locale/de';
import { history } from '../app/app';
import {
	groupChatSettings,
	ajaxCallCreateGroupChat,
	chatLinkData,
	ajaxCallUpdateGroupChat
} from '../apiWrapper';
import {
	getSessionListPathForLocation,
	getChatItemForSession
} from '../session/sessionHelpers';
import { getChatDate } from '../session/sessionDateHelpers';
import { updateChatSuccessOverlayItem } from './groupChatHelpers';
import '../../../node_modules/react-datepicker/src/stylesheets/datepicker.scss';
import '../datepicker/datepicker.styles';
import './createChat.styles';

registerLocale('de', de);

export const CreateGroupChatView = (props) => {
	const { activeSessionGroupId, setActiveSessionGroupId } = useContext(
		ActiveSessionGroupIdContext
	);
	const { setAcceptedGroupId } = useContext(AcceptedGroupIdContext);
	const { sessionsData, setSessionsData } = useContext(SessionsDataContext);
	const [selectedChatTopic, setSelectedChatTopic] = useState('');
	const [selectedDate, setSelectedDate] = useState('');
	const [selectedTime, setSelectedTime] = useState('');
	const [selectedDuration, setSelectedDuration] = useState('');
	const [selectedRepetitive, setSelectedRepetitive] = useState(false);
	const [isCreateButtonDisabled, setIsCreateButtonDisabled] = useState(true);
	const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
	const [chatTopicLabel, setChatTopicLabel] = useState(
		'groupChat.create.topicInput.label'
	);
	const [overlayItem, setOverlayItem] = useState<OverlayItem>(null);
	const [overlayActive, setOverlayActive] = useState(false);
	const [isDateInputFocused, setIsDateInputFocus] = useState(false);
	const [isTimeInputFocused, setIsTimeInputFocus] = useState(false);
	const [groupIdToRedirect, setGroupIdToRedirect] = useState(null);
	const [isEditGroupChatMode, setIsEditGroupChatMode] = useState(false);
	const activeSession = getActiveSession(activeSessionGroupId, sessionsData);
	const chatItem = getChatItemForSession(activeSession);
	const prevPathIsGroupChatInfo =
		props.location.state && props.location.state.prevIsInfoPage;
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);

	useEffect(() => {
		mobileDetailView();
		if (props.location.state && props.location.state.isEditMode) {
			const selectedTime = getChatDate(
				chatItem.startDate,
				chatItem.startTime
			);
			setIsEditGroupChatMode(true);
			setSelectedChatTopic(chatItem.topic);
			handleDatePicker(new Date(chatItem.startDate));
			handleTimePicker(selectedTime);
			setSelectedDuration(chatItem.duration);
			setSelectedRepetitive(chatItem.repetitive);
		} else {
			setActiveSessionGroupId(ACTIVE_SESSION.CREATE_CHAT);
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(
		() => {
			const isChatTopicValid =
				selectedChatTopic &&
				selectedChatTopic.length >= TOPIC_LENGTHS.MIN &&
				selectedChatTopic.length < TOPIC_LENGTHS.MAX;
			if (
				isChatTopicValid &&
				selectedDate &&
				selectedTime &&
				selectedDuration
			) {
				isEditGroupChatMode && arePrefilledValuesChanged()
					? setIsSaveButtonDisabled(false)
					: setIsSaveButtonDisabled(true);
				setIsCreateButtonDisabled(false);
			} else {
				setIsCreateButtonDisabled(true);
				setIsSaveButtonDisabled(true);
			}
		},
		/* eslint-disable */
		[
			selectedChatTopic,
			selectedDate,
			selectedTime,
			selectedDuration,
			selectedRepetitive
		]
	);
	/* eslint-enable */

	const handleBackButton = () => {
		mobileListView();
		if (isEditGroupChatMode) {
			const redirectPath = prevPathIsGroupChatInfo
				? `${getSessionListPathForLocation()}/${chatItem.groupId}/${
						chatItem.id
				  }/groupChatInfo`
				: `${getSessionListPathForLocation()}/${chatItem.groupId}/${
						chatItem.id
				  }`;
			history.push(redirectPath);
		} else {
			setActiveSessionGroupId(null);
		}
	};

	const arePrefilledValuesChanged = () => {
		const prefillDate = new Date(chatItem.startDate);
		const inputDate = new Date(selectedDate);
		const prefillTime = getChatDate(chatItem.startDate, chatItem.startTime);
		const inputTime: Date = new Date(selectedTime); //TO-DO: CHECK IF THIS IS STILL WORKING

		return (
			chatItem.topic !== selectedChatTopic ||
			prefillDate.getTime() !== inputDate.getTime() ||
			prefillTime.toLocaleTimeString() !==
				inputTime.toLocaleTimeString() ||
			parseInt(selectedDuration) !== chatItem.duration ||
			selectedRepetitive !== chatItem.repetitive
		);
	};

	const chatTopicInputItem: InputFieldItem = {
		name: 'chatTopic',
		class: 'creatChat__name__input',
		id: 'chatTopic',
		type: 'text',
		label: translate(chatTopicLabel),
		content: selectedChatTopic
	};

	const handleChatTopicInput = (event) => {
		const chatTopic = event.target.value;
		const chatTopicLength = chatTopic.length;
		if (chatTopicLength < TOPIC_LENGTHS.MIN) {
			setChatTopicLabel('groupChat.create.topicInput.warning.short');
		} else if (chatTopicLength >= TOPIC_LENGTHS.MAX) {
			setChatTopicLabel('groupChat.create.topicInput.warning.long');
		} else {
			setChatTopicLabel('groupChat.create.topicInput.label');
		}
		setSelectedChatTopic(chatTopic);
	};

	const handleDatePicker = (date) => {
		setSelectedDate(date);
	};

	const handleTimePicker = (time) => {
		setSelectedTime(time);
	};

	const handleDurationSelect = (selectedOption) => {
		setSelectedDuration(selectedOption.value);
	};

	const getOptionOfSelectedDuration = () => {
		console.log('durationSelectOptionsSet', durationSelectOptionsSet);
		console.log('selectedDuration', selectedDuration);
		return durationSelectOptionsSet.filter(
			(option) => option.value === (selectedDuration.toString() as string)
		)[0];
	};

	const durationSelectDropdown: SelectDropdownItem = {
		id: 'chatDuration',
		selectedOptions: durationSelectOptionsSet,
		handleDropdownSelect: handleDurationSelect,
		selectInputLabel: translate('groupChat.create.durationSelect.label'),
		useIconOption: false,
		isSearchable: false,
		menuPlacement: 'bottom',
		defaultValue: getOptionOfSelectedDuration()
	};

	const repetitiveCheckboxItem: CheckboxItem = {
		inputId: 'isRepetitiveChat',
		name: 'isRepetitiveChat',
		labelId: 'isRepetitiveLabel',
		label: translate('groupChat.create.repetitiveCheckbox.label'),
		checked: selectedRepetitive
	};

	const buttonSetCreate: ButtonItem = {
		label: translate('groupChat.create.button.label'),
		function: OVERLAY_FUNCTIONS.CLOSE,
		type: BUTTON_TYPES.PRIMARY
	};

	const buttonSetCancel: ButtonItem = {
		label: translate('groupChat.cancel.button.label'),
		function: OVERLAY_FUNCTIONS.CLOSE,
		type: BUTTON_TYPES.GHOST
	};

	const buttonSetSave: ButtonItem = {
		label: translate('groupChat.save.button.label'),
		function: OVERLAY_FUNCTIONS.CLOSE,
		type: BUTTON_TYPES.PRIMARY
	};

	const handleCreateAndUpdateButton = () => {
		const repetitiveCheckbox = document.getElementById(
			repetitiveCheckboxItem.inputId
		) as HTMLInputElement;
		const repetitiveCheckboxChecked =
			repetitiveCheckbox && repetitiveCheckbox.checked;

		const createChatDataItem: groupChatSettings = {
			topic: selectedChatTopic,
			startDate: getValidDateFormatForSelectedDate(selectedDate),
			startTime: getValidTimeFormatForSelectedTime(selectedTime),
			duration: parseInt(selectedDuration),
			repetitive: repetitiveCheckboxChecked
		};

		isEditGroupChatMode
			? updateGroupChatSettings(createChatDataItem)
			: createGroupChat(createChatDataItem);
	};

	const createGroupChat = (createChatDataItem: groupChatSettings) => {
		if (isRequestInProgress) {
			return null;
		}
		setIsRequestInProgress(true);
		ajaxCallCreateGroupChat(createChatDataItem)
			.then((response: chatLinkData) => {
				//TODO: reimplement on registration logic with link
				//createChatSuccessOverlayItem.copyTwo = response.chatLink;
				setGroupIdToRedirect(response.groupId);
				setOverlayItem(createChatSuccessOverlayItem);
				setOverlayActive(true);
			})
			.catch((error) => {
				setOverlayItem(createChatErrorOverlayItem);
				setOverlayActive(true);
			});
	};

	const updateGroupChatSettings = (createChatDataItem: groupChatSettings) => {
		if (isRequestInProgress) {
			return null;
		}
		setIsRequestInProgress(true);
		ajaxCallUpdateGroupChat(chatItem.id, createChatDataItem)
			.then((response: chatLinkData) => {
				setOverlayItem(updateChatSuccessOverlayItem);
				setOverlayActive(true);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const handleOverlayAction = (buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.CLOSE) {
			if (
				overlayItem === createChatSuccessOverlayItem ||
				overlayItem === updateChatSuccessOverlayItem
			) {
				if (isEditGroupChatMode) {
					const redirectPath = prevPathIsGroupChatInfo
						? `${getSessionListPathForLocation()}/${
								chatItem.groupId
						  }/${chatItem.id}/groupChatInfo`
						: `${getSessionListPathForLocation()}/${
								chatItem.groupId
						  }/${chatItem.id}`;
					let changedSessionsData = getSessionsDataWithChangedValue(
						sessionsData,
						activeSession,
						'topic',
						selectedChatTopic
					);
					changedSessionsData = getSessionsDataWithChangedValue(
						sessionsData,
						activeSession,
						'startDate',
						getValidDateFormatForSelectedDate(selectedDate)
					);
					changedSessionsData = getSessionsDataWithChangedValue(
						sessionsData,
						activeSession,
						'startTime',
						getValidTimeFormatForSelectedTime(selectedTime)
					);
					changedSessionsData = getSessionsDataWithChangedValue(
						sessionsData,
						activeSession,
						'duration',
						parseInt(selectedDuration)
					);
					changedSessionsData = getSessionsDataWithChangedValue(
						sessionsData,
						activeSession,
						'repetitive',
						selectedRepetitive
					);
					setSessionsData(changedSessionsData);
					history.push({ pathname: redirectPath });
				} else {
					setAcceptedGroupId(groupIdToRedirect);
					history.push({
						pathname: `${getSessionListPathForLocation()}`
					});
				}
			} else {
				setOverlayActive(false);
				setOverlayItem({});
			}
			setIsRequestInProgress(false);
		}
	};

	return (
		<div className="createChat__wrapper">
			{isEditGroupChatMode ? (
				<div className="createChat__header createChat__header--edit">
					<div className="createChat__header__inner">
						<a
							onClick={handleBackButton}
							className="createChat__header__backButton"
							href="/#" //TO-DO: CHECK IF THIS IS STILL WORKING -> otherwise use other html element
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								xmlnsXlink="http://www.w3.org/1999/xlink"
								width="72"
								height="72"
								viewBox="0 0 72 72"
							>
								<defs>
									<path
										id="arrow-left-a"
										d="M45.0252206,6.96804002 C45.4962829,6.4969777 46.0611408,6.26144654 46.7197943,6.26144654 C47.3784479,6.26144654 47.9433058,6.4969777 48.4143681,6.96804002 L54.5548531,13.1460432 C55.0259154,13.6171055 55.2614465,14.1757104 55.2614465,14.8218578 C55.2614465,15.4680053 55.0259154,16.0266102 54.5548531,16.4976725 L34.791079,36.2614465 L54.5548531,56.0252206 C55.0259154,56.4962829 55.2614465,57.0548878 55.2614465,57.7010352 C55.2614465,58.3471827 55.0259154,58.9057875 54.5548531,59.3768499 L48.4143681,65.5548531 C47.9433058,66.0259154 47.3784479,66.2614465 46.7197943,66.2614465 C46.0611408,66.2614465 45.4962829,66.0259154 45.0252206,65.5548531 L17.4451469,37.9372612 C16.9740846,37.4661988 16.7385535,36.907594 16.7385535,36.2614465 C16.7385535,35.6152991 16.9740846,35.0566942 17.4451469,34.5856319 L45.0252206,6.96804002 Z"
									/>
								</defs>
								<use xlinkHref="#arrow-left-a" />
							</svg>
						</a>
						<h3 className="createChat__header__title createChat__header__title--withBackButton">
							{translate('groupChat.edit.title')}
						</h3>
					</div>
					<p className="createChat__header__subtitle createChat__header__subtitle--withBackButton">
						{chatItem.topic}
					</p>
				</div>
			) : (
				<div className="createChat__header">
					<div className="createChat__header__inner">
						<a
							onClick={handleBackButton}
							className="createChat__header__backButton"
							href="/#" //TO-DO: CHECK IF THIS IS STILL WORKING -> otherwise use other html element
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								xmlnsXlink="http://www.w3.org/1999/xlink"
								width="72"
								height="72"
								viewBox="0 0 72 72"
							>
								<defs>
									<path
										id="arrow-left-a"
										d="M45.0252206,6.96804002 C45.4962829,6.4969777 46.0611408,6.26144654 46.7197943,6.26144654 C47.3784479,6.26144654 47.9433058,6.4969777 48.4143681,6.96804002 L54.5548531,13.1460432 C55.0259154,13.6171055 55.2614465,14.1757104 55.2614465,14.8218578 C55.2614465,15.4680053 55.0259154,16.0266102 54.5548531,16.4976725 L34.791079,36.2614465 L54.5548531,56.0252206 C55.0259154,56.4962829 55.2614465,57.0548878 55.2614465,57.7010352 C55.2614465,58.3471827 55.0259154,58.9057875 54.5548531,59.3768499 L48.4143681,65.5548531 C47.9433058,66.0259154 47.3784479,66.2614465 46.7197943,66.2614465 C46.0611408,66.2614465 45.4962829,66.0259154 45.0252206,65.5548531 L17.4451469,37.9372612 C16.9740846,37.4661988 16.7385535,36.907594 16.7385535,36.2614465 C16.7385535,35.6152991 16.9740846,35.0566942 17.4451469,34.5856319 L45.0252206,6.96804002 Z"
									/>
								</defs>
								<use xlinkHref="#arrow-left-a" />
							</svg>
						</a>
						<h3 className="createChat__header__title">
							{translate('groupChat.create.title')}
						</h3>
					</div>
					<p className="createChat__header__subtitle">
						{translate('groupChat.create.subtitle')}
					</p>
				</div>
			)}
			<form id="createChatForm" className="createChat__content">
				<InputField
					item={chatTopicInputItem}
					inputHandle={handleChatTopicInput}
				/>
				<div className="formWrapper react-datepicker--date">
					<DatePicker
						selected={selectedDate}
						onChange={(date) => handleDatePicker(date)}
						onFocus={() => setIsDateInputFocus(true)}
						onBlur={() => setIsDateInputFocus(false)}
						locale="de"
						minDate={new Date()}
						maxDate={new Date(2999, 12, 31)}
						dateFormat="cccccc, dd. MMMM yyyy"
					/>
					<span
						className={
							isDateInputFocused || selectedDate
								? `react-datepicker__label react-datepicker__label--active`
								: `react-datepicker__label`
						}
						aria-label="date input label"
					>
						{translate('groupChat.create.dateInput.label')}
					</span>
				</div>
				<div className="formWrapper react-datepicker--time">
					<DatePicker
						selected={selectedTime}
						onChange={(time) => handleTimePicker(time)}
						onFocus={() => setIsTimeInputFocus(true)}
						onBlur={() => setIsTimeInputFocus(false)}
						locale="de"
						showTimeSelect
						showTimeSelectOnly
						timeIntervals={15}
						timeCaption="Uhrzeit"
						dateFormat="HH:mm"
					/>
					<span
						className={
							isTimeInputFocused || selectedTime
								? `react-datepicker__label react-datepicker__label--active`
								: `react-datepicker__label`
						}
						aria-label="time input label"
					>
						{translate('groupChat.create.beginDateInput.label')}
					</span>
				</div>
				<SelectDropdown {...durationSelectDropdown} />
				<Checkbox
					item={repetitiveCheckboxItem}
					checkboxHandle={() =>
						setSelectedRepetitive(!selectedRepetitive)
					}
				/>
				{isEditGroupChatMode ? (
					<div className="createChat__buttonsWrapper">
						<Button
							item={buttonSetCancel}
							buttonHandle={handleBackButton}
						/>
						<Button
							item={buttonSetSave}
							buttonHandle={handleCreateAndUpdateButton}
							disabled={isSaveButtonDisabled}
						/>
					</div>
				) : (
					<Button
						item={buttonSetCreate}
						buttonHandle={handleCreateAndUpdateButton}
						disabled={isCreateButtonDisabled}
					/>
				)}
			</form>
			{overlayActive ? (
				<OverlayWrapper>
					<Overlay
						item={overlayItem}
						handleOverlay={handleOverlayAction}
					/>
				</OverlayWrapper>
			) : null}
		</div>
	);
};
