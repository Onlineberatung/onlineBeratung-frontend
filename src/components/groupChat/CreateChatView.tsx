import * as React from 'react';
import { useEffect, useContext, useState, useCallback, useMemo } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
	desktopView,
	mobileDetailView,
	mobileListView
} from '../app/navigationHandler';
import {
	SessionsDataContext,
	ExtendedSessionInterface,
	getExtendedSession,
	UPDATE_SESSIONS,
	SessionTypeContext,
	useTenant
} from '../../globalState';
import { InputField, InputFieldItem } from '../inputField/InputField';
import { Checkbox, CheckboxItem } from '../checkbox/Checkbox';
import { SelectDropdown, SelectDropdownItem } from '../select/SelectDropdown';
import {
	TOPIC_LENGTHS,
	durationSelectOptionsSet,
	getValidDateFormatForSelectedDate,
	getValidTimeFormatForSelectedTime
} from './createChatHelpers';
import { ReactComponent as CheckIcon } from '../../resources/img/illustrations/check.svg';
import { ReactComponent as XIcon } from '../../resources/img/illustrations/x.svg';
import { ButtonItem, BUTTON_TYPES, Button } from '../button/Button';
import { OVERLAY_FUNCTIONS, Overlay, OverlayItem } from '../overlay/Overlay';
import DatePicker, { registerLocale } from 'react-datepicker/dist/es';
import de from 'date-fns/locale/de';
import {
	groupChatSettings,
	apiCreateGroupChat,
	chatLinkData,
	apiUpdateGroupChat
} from '../../api';
import { SESSION_LIST_TAB } from '../session/sessionHelpers';
import { getChatDate } from '../session/sessionDateHelpers';
import { ReactComponent as BackIcon } from '../../resources/img/icons/arrow-left.svg';
import 'react-datepicker/src/stylesheets/datepicker.scss';
import '../datepicker/datepicker.styles';
import './createChat.styles';
import { useResponsive } from '../../hooks/useResponsive';
import { apiGetSessionRoomsByGroupIds } from '../../api/apiGetSessionRooms';
import { useSearchParam } from '../../hooks/useSearchParams';
import { useTranslation } from 'react-i18next';

registerLocale('de', de);

export const CreateGroupChatView = (props) => {
	const { t: translate } = useTranslation();
	const { rcGroupId: groupIdFromParam } = useParams<{ rcGroupId: string }>();
	const history = useHistory();

	const { sessions, ready, dispatch } = useContext(SessionsDataContext);
	const { path: listPath } = useContext(SessionTypeContext);
	const [selectedChatTopic, setSelectedChatTopic] = useState('');
	const [selectedDate, setSelectedDate] = useState('');
	const [selectedTime, setSelectedTime] = useState('');
	const [selectedDuration, setSelectedDuration] = useState(null);
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
	const [isEditGroupChatMode, setIsEditGroupChatMode] = useState(false);

	const tenantData = useTenant();
	const featureGroupChatV2Enabled =
		tenantData?.settings?.featureGroupChatV2Enabled;

	const [activeSession, setActiveSession] =
		useState<ExtendedSessionInterface | null>(null);

	const updateChatSuccessOverlayItem = useMemo<OverlayItem>(
		() => ({
			svg: CheckIcon,
			headline: translate('groupChat.updateSuccess.overlay.headline'),
			buttonSet: [
				{
					label: translate(
						'groupChat.updateSuccess.overlay.button1Label'
					),
					function: OVERLAY_FUNCTIONS.CLOSE,
					type: BUTTON_TYPES.SECONDARY
				}
			]
		}),
		[translate]
	);

	const prevPathIsGroupChatInfo =
		props.location.state && props.location.state.prevIsInfoPage;
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);
	const sessionListTab = useSearchParam<SESSION_LIST_TAB>('sessionListTab');

	const createChatSuccessOverlayItem = useMemo<OverlayItem>(
		() => ({
			svg: CheckIcon,
			headline: translate('groupChat.createSuccess.overlay.headline'),
			buttonSet: [
				{
					label: translate(
						'groupChat.createSuccess.overlay.buttonLabel'
					),
					function: OVERLAY_FUNCTIONS.CLOSE,
					type: BUTTON_TYPES.SECONDARY
				}
			]
		}),
		[translate]
	);

	const createChatErrorOverlayItem = useMemo<OverlayItem>(
		() => ({
			svg: XIcon,
			illustrationBackground: 'error',
			headline: translate('groupChat.createError.overlay.headline'),
			buttonSet: [
				{
					label: translate(
						'groupChat.createError.overlay.buttonLabel'
					),
					function: OVERLAY_FUNCTIONS.CLOSE,
					type: BUTTON_TYPES.AUTO_CLOSE
				}
			]
		}),
		[translate]
	);

	const getSessionListTab = useCallback(
		() => `${sessionListTab ? `?sessionListTab=${sessionListTab}` : ''}`,
		[sessionListTab]
	);

	const { fromL } = useResponsive();
	useEffect(() => {
		if (!fromL) {
			mobileDetailView();
			return () => {
				mobileListView();
			};
		}
		desktopView();
	}, [fromL]);

	useEffect(() => {
		if (!ready) {
			return;
		}

		const activeSession = getExtendedSession(groupIdFromParam, sessions);
		if (!activeSession) {
			return;
		}

		setActiveSession(activeSession);

		if (props.location.state && props.location.state.isEditMode) {
			const selectedTime = getChatDate(
				activeSession.item.startDate,
				activeSession.item.startTime
			);
			setIsEditGroupChatMode(true);
			setSelectedChatTopic(activeSession.item.topic as string);
			handleDatePicker(new Date(activeSession.item.startDate));
			handleTimePicker(selectedTime);
			setSelectedDuration(activeSession.item.duration);
			setSelectedRepetitive(activeSession.item.repetitive);
		}
	}, [groupIdFromParam, props.location.state, ready, sessions]);

	const arePrefilledValuesChanged = useCallback(() => {
		const prefillDate = new Date(activeSession.item.startDate);
		const inputDate = new Date(selectedDate);
		const prefillTime = getChatDate(
			activeSession.item.startDate,
			activeSession.item.startTime
		);
		const inputTime: Date = new Date(selectedTime);

		return (
			activeSession.item.topic !== selectedChatTopic ||
			prefillDate.getTime() !== inputDate.getTime() ||
			prefillTime.toLocaleTimeString() !==
				inputTime.toLocaleTimeString() ||
			parseInt(selectedDuration) !== activeSession.item.duration ||
			selectedRepetitive !== activeSession.item.repetitive
		);
	}, [
		activeSession?.item.duration,
		activeSession?.item.repetitive,
		activeSession?.item.startDate,
		activeSession?.item.startTime,
		activeSession?.item.topic,
		selectedChatTopic,
		selectedDate,
		selectedDuration,
		selectedRepetitive,
		selectedTime
	]);

	useEffect(() => {
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
	}, [
		selectedChatTopic,
		selectedDate,
		selectedTime,
		selectedDuration,
		isEditGroupChatMode,
		arePrefilledValuesChanged
	]);

	const handleBackButton = () => {
		if (isEditGroupChatMode) {
			const pathInfo =
				(prevPathIsGroupChatInfo ? '/groupChatInfo' : '') +
				getSessionListTab();
			history.push(
				`${listPath}/${activeSession.item.groupId}/${activeSession.item.id}${pathInfo}`
			);
		}
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

	const getOptionOfSelectedDuration = useCallback(() => {
		return durationSelectOptionsSet
			.map((option) => ({ ...option, label: translate(option.label) }))
			.filter(
				(option) =>
					option.value ===
					(selectedDuration
						? (selectedDuration.toString() as string)
						: '')
			)[0];
	}, [selectedDuration, translate]);

	const durationSelectDropdown = useMemo<SelectDropdownItem>(
		() => ({
			id: 'chatDuration',
			selectedOptions: durationSelectOptionsSet.map((option) => ({
				...option,
				label: translate(option.label)
			})),
			handleDropdownSelect: handleDurationSelect,
			selectInputLabel: translate(
				'groupChat.create.durationSelect.label'
			),
			useIconOption: false,
			isSearchable: false,
			menuPlacement: 'bottom',
			defaultValue: getOptionOfSelectedDuration()
		}),
		[getOptionOfSelectedDuration, translate]
	);

	const repetitiveCheckboxItem = useMemo<CheckboxItem>(
		() => ({
			inputId: 'isRepetitiveChat',
			name: 'isRepetitiveChat',
			labelId: 'isRepetitiveLabel',
			label: translate('groupChat.create.repetitiveCheckbox.label'),
			checked: selectedRepetitive
		}),
		[selectedRepetitive, translate]
	);

	const buttonSetCreate = useMemo<ButtonItem>(
		() => ({
			label: translate('groupChat.create.button.label'),
			function: OVERLAY_FUNCTIONS.CLOSE,
			type: BUTTON_TYPES.PRIMARY
		}),
		[translate]
	);

	const buttonSetCancel = useMemo<ButtonItem>(
		() => ({
			label: translate('groupChat.cancel.button.label'),
			function: OVERLAY_FUNCTIONS.CLOSE,
			type: BUTTON_TYPES.SECONDARY
		}),
		[translate]
	);

	const buttonSetSave = useMemo<ButtonItem>(
		() => ({
			label: translate('groupChat.save.button.label'),
			function: OVERLAY_FUNCTIONS.CLOSE,
			type: BUTTON_TYPES.PRIMARY
		}),
		[translate]
	);

	const createGroupChat = useCallback(
		(createChatDataItem: groupChatSettings) => {
			if (isRequestInProgress) {
				return null;
			}
			setIsRequestInProgress(true);
			apiCreateGroupChat(createChatDataItem)
				.then((response: chatLinkData) => {
					apiGetSessionRoomsByGroupIds([response.groupId]).then(
						({ sessions }) => {
							dispatch({
								type: UPDATE_SESSIONS,
								sessions: sessions
							});

							setActiveSession(
								getExtendedSession(response.groupId, sessions)
							);
							setOverlayItem(createChatSuccessOverlayItem);
							setOverlayActive(true);
						}
					);
				})
				.catch(() => {
					setOverlayItem(createChatErrorOverlayItem);
					setOverlayActive(true);
				});
		},
		[
			createChatErrorOverlayItem,
			createChatSuccessOverlayItem,
			dispatch,
			isRequestInProgress
		]
	);

	const updateGroupChatSettings = useCallback(
		(createChatDataItem: groupChatSettings) => {
			if (isRequestInProgress) {
				return null;
			}
			setIsRequestInProgress(true);
			apiUpdateGroupChat(activeSession.item.id, createChatDataItem)
				.then((response: chatLinkData) => {
					apiGetSessionRoomsByGroupIds([response.groupId]).then(
						({ sessions }) => {
							dispatch({
								type: UPDATE_SESSIONS,
								sessions: sessions
							});

							setOverlayItem(updateChatSuccessOverlayItem);
							setOverlayActive(true);
						}
					);
				})
				.catch((error) => {
					console.error(error);
				});
		},
		[
			activeSession?.item?.id,
			dispatch,
			isRequestInProgress,
			updateChatSuccessOverlayItem
		]
	);

	const handleCreateAndUpdateButton = useCallback(() => {
		const createChatDataItem: groupChatSettings = {
			topic: selectedChatTopic,
			startDate: getValidDateFormatForSelectedDate(selectedDate),
			startTime: getValidTimeFormatForSelectedTime(selectedTime),
			duration: parseInt(selectedDuration),
			repetitive: selectedRepetitive,
			featureGroupChatV2Enabled
		};

		isEditGroupChatMode
			? updateGroupChatSettings(createChatDataItem)
			: createGroupChat(createChatDataItem);
	}, [
		createGroupChat,
		featureGroupChatV2Enabled,
		isEditGroupChatMode,
		selectedChatTopic,
		selectedDate,
		selectedDuration,
		selectedRepetitive,
		selectedTime,
		updateGroupChatSettings
	]);

	const handleOverlayAction = useCallback(
		(buttonFunction: string) => {
			if (buttonFunction === OVERLAY_FUNCTIONS.CLOSE) {
				if (
					JSON.stringify(overlayItem) ===
						JSON.stringify(createChatSuccessOverlayItem) ||
					JSON.stringify(overlayItem) ===
						JSON.stringify(updateChatSuccessOverlayItem)
				) {
					const pathInfo =
						(prevPathIsGroupChatInfo ? '/groupChatInfo' : '') +
						getSessionListTab();
					history.push(
						`${listPath}/${activeSession.item.groupId}/${activeSession.item.id}${pathInfo}`
					);
				} else {
					setOverlayActive(false);
					setOverlayItem({});
				}
				setIsRequestInProgress(false);
			}
		},
		[
			activeSession?.item?.groupId,
			activeSession?.item?.id,
			createChatSuccessOverlayItem,
			getSessionListTab,
			history,
			listPath,
			overlayItem,
			prevPathIsGroupChatInfo,
			updateChatSuccessOverlayItem
		]
	);

	return (
		<div className="createChat__wrapper">
			{isEditGroupChatMode ? (
				<div className="createChat__header createChat__header--edit">
					<div className="createChat__header__inner">
						<span
							onClick={handleBackButton}
							className="createChat__header__backButton"
						>
							<BackIcon />
						</span>
						<h3 className="createChat__header__title createChat__header__title--withBackButton">
							{translate('groupChat.edit.title')}
						</h3>
					</div>
					<p className="createChat__header__subtitle createChat__header__subtitle--withBackButton">
						{activeSession.item.topic}
					</p>
				</div>
			) : (
				<div className="createChat__header">
					<div className="createChat__header__inner">
						<span
							onClick={handleBackButton}
							className="createChat__header__backButton"
						>
							<BackIcon />
						</span>
						<h3 className="createChat__header__title">
							{translate('groupChat.create.title')}
						</h3>
					</div>
					<p className="createChat__header__subtitle">
						{translate('groupChat.create.subtitle')}
					</p>
				</div>
			)}
			<div id="createChatForm" className="createChat__content">
				<form>
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
			</div>

			{overlayActive && (
				<Overlay
					item={overlayItem}
					handleOverlay={handleOverlayAction}
				/>
			)}
		</div>
	);
};
