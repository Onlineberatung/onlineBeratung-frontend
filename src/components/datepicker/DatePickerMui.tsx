import { useState } from 'react';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker as MuiTimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TextField } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/de';
import 'dayjs/locale/en';
import './datepicker-mui.styles.scss';

interface DatePickerProps {
	selected: Date | string | null;
	onChange: (date: Date | null) => void;
	onFocus?: () => void;
	onBlur?: () => void;
	locale?: string;
	minDate?: Date;
	maxDate?: Date;
	dateFormat?: string;
	label?: string;
	placeholder?: string;
	showLabel?: boolean;
	isLabelActive?: boolean;
}

interface TimePickerProps {
	selected: Date | string | null;
	onChange: (time: Date | null) => void;
	onFocus?: () => void;
	onBlur?: () => void;
	locale?: string;
	showTimeSelect?: boolean;
	showTimeSelectOnly?: boolean;
	timeIntervals?: number;
	timeCaption?: string;
	dateFormat?: string;
	label?: string;
	placeholder?: string;
	showLabel?: boolean;
	isLabelActive?: boolean;
}

/**
 * MUI DatePicker wrapper component that maintains API compatibility with react-datepicker
 * while using MUI X Date Pickers underneath
 */
export const DatePicker = ({
	selected,
	onChange,
	onFocus,
	onBlur,
	locale = 'en',
	minDate,
	maxDate,
	dateFormat = 'cccccc, dd. MMMM yyyy',
	label,
	placeholder,
	showLabel = true,
	isLabelActive = false
}: DatePickerProps) => {
	const [isFocused, setIsFocused] = useState(false);

	// Convert date to dayjs
	const value = selected ? dayjs(selected) : null;

	// Convert dayjs format to MUI format with proper locale support
	// react-datepicker uses date-fns format, MUI uses dayjs format
	// Common formats:
	// 'cccccc, dd. MMMM yyyy' -> 'ddd, DD. MMMM YYYY' (German: Mo, 15. Februar 2024)
	// 'MM/dd/yyyy' -> 'MM/DD/YYYY' (English: 02/15/2024)
	const muiFormat = dateFormat
		.replace(/cccccc/g, 'ddd')  // Short day name
		.replace(/dd/g, 'DD')       // Day of month
		.replace(/yyyy/g, 'YYYY')   // Full year
		.replace(/MM/g, 'MM')       // Month number
		.replace(/MMMM/g, 'MMMM');  // Full month name

	const handleChange = (newValue: Dayjs | null) => {
		onChange(newValue ? newValue.toDate() : null);
	};

	const handleFocus = () => {
		setIsFocused(true);
		onFocus?.();
	};

	const handleBlur = () => {
		setIsFocused(false);
		onBlur?.();
	};

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
			<div className="mui-datepicker-wrapper">
				<MuiDatePicker
					value={value}
					onChange={handleChange}
					format={muiFormat}
					minDate={minDate ? dayjs(minDate) : undefined}
					maxDate={maxDate ? dayjs(maxDate) : undefined}
					label={label}
					slotProps={{
						textField: {
							onFocus: handleFocus,
							onBlur: handleBlur,
							fullWidth: true,
							variant: 'outlined',
							placeholder: placeholder,
							InputLabelProps: {
								shrink: isFocused || !!selected
							}
						}
					}}
				/>
			</div>
		</LocalizationProvider>
	);
};

/**
 * MUI TimePicker wrapper component that maintains API compatibility with react-datepicker
 * while using MUI X Date Pickers underneath
 */
export const TimePicker = ({
	selected,
	onChange,
	onFocus,
	onBlur,
	locale = 'en',
	timeIntervals = 15,
	dateFormat = 'HH:mm',
	label,
	placeholder,
	showLabel = true,
	isLabelActive = false
}: TimePickerProps) => {
	const [isFocused, setIsFocused] = useState(false);

	// Convert date to dayjs
	const value = selected ? dayjs(selected) : null;

	// MUI uses same format as dayjs for HH:mm
	const muiFormat = dateFormat;

	const handleChange = (newValue: Dayjs | null) => {
		onChange(newValue ? newValue.toDate() : null);
	};

	const handleFocus = () => {
		setIsFocused(true);
		onFocus?.();
	};

	const handleBlur = () => {
		setIsFocused(false);
		onBlur?.();
	};

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
			<div className="mui-datepicker-wrapper mui-timepicker-wrapper">
				<MuiTimePicker
					value={value}
					onChange={handleChange}
					format={muiFormat}
					minutesStep={timeIntervals}
					label={label}
					slotProps={{
						textField: {
							onFocus: handleFocus,
							onBlur: handleBlur,
							fullWidth: true,
							variant: 'outlined',
							placeholder: placeholder,
							InputLabelProps: {
								shrink: isFocused || !!selected
							}
						}
					}}
				/>
			</div>
		</LocalizationProvider>
	);
};
