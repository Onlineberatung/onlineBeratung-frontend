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
	value?: number[];
	localValue: number;
	onChange?: (v: number[]) => void;
}

const CheckBoxLocal = ({
	value,
	onChange,
	localValue,
	...rest
}: CheckboxFormFieldProps) => {
	const onLocalChange = React.useCallback(() => {
		const alreadyExists = value.indexOf(localValue);
		if (alreadyExists === -1) {
			onChange([...value, localValue]);
		} else {
			onChange(value.filter((v) => v !== localValue));
		}
	}, [value, localValue, onChange]);
	const id = `checkbox-${rest.label.replace(/\s/g, '-')}`;
	const item = {
		labelClass: rest.labelClass || '',
		inputId: id,
		name: '',
		labelId: id,
		value: localValue,
		label: rest.label,
		checked: value.indexOf(localValue) !== -1
	} as unknown as CheckboxItem;
	return (
		<Checkbox
			item={item}
			checkboxHandle={onLocalChange}
			onKeyPress={(e) => e.key === 'Space' && onLocalChange()}
		/>
	);
};

export const CheckboxGroupFormField = (props: CheckboxFormFieldProps) => {
	return (
		<Field name={props.name} rules={[{ type: 'array', required: true }]}>
			<CheckBoxLocal {...props} />
		</Field>
	);
};
