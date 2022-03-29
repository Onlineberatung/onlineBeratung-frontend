import { useCallback, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { translate } from '../../utils/translate';
import { Textarea } from '../form/textarea';
import * as React from 'react';
import { AppointmentsDataInterface } from '../../globalState/interfaces/AppointmentsDataInterface';

type OnlineMeetingFormProps = {
	onChange: (appointment: AppointmentsDataInterface) => void;
	onlineMeeting: AppointmentsDataInterface;
};

type OnlineMeeting = Omit<AppointmentsDataInterface, 'datetime'> & {
	datetime?: Date;
};

export const OnlineMeetingForm = ({
	onChange,
	onlineMeeting: initialOnlineMeeting
}: OnlineMeetingFormProps) => {
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
				<div className="flex">
					<div className="flex__col--1 mr--2">
						<div className="formWrapper react-datepicker--date">
							<DatePicker
								selected={onlineMeeting.datetime}
								onChange={(date) =>
									handleChange('datetime', date)
								}
								locale="de"
								minDate={new Date()}
								maxDate={new Date(2999, 12, 31)}
								dateFormat="cccccc, dd. MMMM yyyy"
							/>
							<span
								className={
									onlineMeeting.datetime
										? `react-datepicker__label react-datepicker__label--active`
										: `react-datepicker__label`
								}
								aria-label="date input label"
							>
								{translate(
									'appointments.onlineMeeting.form.date'
								)}
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
									locale="de"
									showTimeSelect
									showTimeSelectOnly
									timeIntervals={15}
									timeCaption="Uhrzeit"
									dateFormat="HH:mm"
								/>
								<span
									className={
										onlineMeeting.datetime
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
