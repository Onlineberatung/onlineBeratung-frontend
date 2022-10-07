import { useCallback, useContext, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { Textarea } from '../form/textarea';
import * as React from 'react';
import { AppointmentsDataInterface } from '../../globalState/interfaces/AppointmentsDataInterface';
import { useTranslation } from 'react-i18next';
import { LocaleContext } from '../../globalState';

type OnlineMeetingFormProps = {
	onChange: (appointment: AppointmentsDataInterface) => void;
	onlineMeeting: AppointmentsDataInterface;
};

type OnlineMeeting = Omit<AppointmentsDataInterface, 'datetime'> & {
	datetime?: Date;
};

export const DEFAULT_MEETING_TIME = 8;

export const OnlineMeetingForm = ({
	onChange,
	onlineMeeting: initialOnlineMeeting
}: OnlineMeetingFormProps) => {
	const { t: translate } = useTranslation();
	const { locale } = useContext(LocaleContext);
	const [dateFocus, setDateFocus] = useState(false);
	const [timeFocus, setTimeFocus] = useState(false);
	const [onlineMeeting, setOnlineMeeting] = useState((): OnlineMeeting => {
		const { datetime, ...args } = initialOnlineMeeting;
		const initialState: OnlineMeeting = args;

		if (datetime) {
			initialState.datetime = new Date(datetime);
		}

		return initialState;
	});

	useEffect(() => {
		const { datetime, ...args } = onlineMeeting;
		onChange({
			...args,
			...(datetime ? { datetime: datetime.toISOString() } : {})
		});
	}, [onChange, onlineMeeting]);

	const handleChange = useCallback(
		(key, value) => {
			setOnlineMeeting({
				...onlineMeeting,
				[key]: value
			});
		},
		[onlineMeeting]
	);

	return (
		<div className="onlineMeetingForm mt--3">
			<div>
				<div className="flex flex--fd-column flex-m--fd-row">
					<div className="flex__col--1 mr-m--2 mb--2 mb-m--0">
						<div className="formWrapper react-datepicker--date">
							<DatePicker
								selected={onlineMeeting.datetime}
								onChange={(date) => {
									const dateTime = new Date(date.getTime());
									if (!onlineMeeting.datetime) {
										dateTime.setHours(DEFAULT_MEETING_TIME);
									}
									handleChange('datetime', dateTime);
								}}
								locale={locale}
								minDate={new Date()}
								maxDate={new Date(2999, 12, 31)}
								dateFormat="cccccc, dd. MMMM yyyy"
								onFocus={() => setDateFocus(true)}
								onBlur={() => setDateFocus(false)}
							/>
							<span
								className={
									onlineMeeting.datetime || dateFocus
										? `react-datepicker__label react-datepicker__label--active`
										: `react-datepicker__label`
								}
								aria-label="date input label"
							>
								{translate(
									'appointments.onlineMeeting.form.date'
								)}{' '}
							</span>
						</div>
					</div>
					<div className="flex__col--1">
						<div>
							<div className="formWrapper react-datepicker--time">
								<DatePicker
									selected={onlineMeeting.datetime}
									onChange={(time) =>
										handleChange('datetime', time)
									}
									locale={locale}
									showTimeSelect
									showTimeSelectOnly
									timeIntervals={15}
									timeCaption="Uhrzeit"
									dateFormat="HH:mm"
									onFocus={() => setTimeFocus(true)}
									onBlur={() => setTimeFocus(false)}
								/>
								<span
									className={
										onlineMeeting.datetime || timeFocus
											? `react-datepicker__label react-datepicker__label--active`
											: `react-datepicker__label`
									}
									aria-label="time input label"
								>
									{translate(
										'appointments.onlineMeeting.form.time'
									)}
								</span>
							</div>
						</div>
					</div>
				</div>

				<div>
					<Textarea
						placeholder={translate(
							'appointments.onlineMeeting.form.description'
						)}
						maxLength={300}
						value={onlineMeeting.description}
						onChange={({ target: { value } }) =>
							handleChange('description', value)
						}
					/>
				</div>
			</div>
		</div>
	);
};
