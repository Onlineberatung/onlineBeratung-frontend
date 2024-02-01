import { Field } from 'rc-field-form';
import * as React from 'react';
import {
	Checkbox,
	CheckboxItem
} from '../../../../components/checkbox/Checkbox';
import { FC } from 'react';

export interface CheckboxFormFieldProps
	extends Omit<
		CheckboxItem,
		'labelId' | 'inputId' | 'checkboxHandle' | 'checked'
	> {
	id?: string;
	labelClass?: string;
	localValue: string;
	onChange?: (v: string) => void;
}

const CheckBoxLocal: FC<CheckboxFormFieldProps> = ({
	value,
	onChange,
	localValue,
	id,
	name,
	...checkboxProps
}) => {
	const onLocalChange = React.useCallback(
		() => onChange(value === localValue ? '' : localValue),
		[onChange, value, localValue]
	);

	return (
		<Checkbox
			inputId={id || name}
			labelId={id || name}
			name={''}
			value={localValue}
			checked={value === localValue}
			checkboxHandle={onLocalChange}
			onKeyPress={(e) => e.key === 'Space' && onLocalChange()}
			{...checkboxProps}
		/>
	);
};

export const CheckboxFormField: FC<CheckboxFormFieldProps> = ({
	name,
	children,
	...props
}) => {
	return (
		<Field name={name} rules={[{ required: true }]}>
			<CheckBoxLocal name={name} {...props}>
				{children}
			</CheckBoxLocal>
		</Field>
	);
};
