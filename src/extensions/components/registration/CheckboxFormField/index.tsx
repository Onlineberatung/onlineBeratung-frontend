import { Field } from 'rc-field-form';
import * as React from 'react';
import {
	Checkbox,
	CheckboxItem
} from '../../../../components/checkbox/Checkbox';

export interface CheckboxFormFieldProps {
	name: string;
	labelClass?: string;
	label: string;
	value?: string;
	localValue: string;
	onChange?: (v: string) => void;
}

const CheckBoxLocal = ({
	value,
	onChange,
	localValue,
	...rest
}: CheckboxFormFieldProps) => {
	const onLocalChange = React.useCallback(
		(v) => {
			onChange(value === localValue ? '' : localValue);
		},
		[onChange, value, localValue]
	);

	const id = `checkbox-${rest.label.replace(/\s/g, '-')}`;
	const item = {
		labelClass: rest.labelClass || '',
		inputId: id,
		name: '',
		labelId: id,
		value: localValue,
		label: rest.label,
		checked: value === localValue
	} as unknown as CheckboxItem;
	return (
		<Checkbox
			item={item}
			checkboxHandle={onLocalChange}
			onKeyPress={(e) => e.key === 'Space' && onLocalChange(e)}
		/>
	);
};

export const CheckboxFormField = (props: CheckboxFormFieldProps) => {
	return (
		<Field name={props.name} rules={[{ required: true }]}>
			<CheckBoxLocal {...props} />
		</Field>
	);
};
