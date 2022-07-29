import React from 'react';
import { Field } from 'rc-field-form';
import { RadioButton, RadioButtonItem } from '../../radioButton/RadioButton';
import { NamePath } from 'rc-field-form/es/interface';

interface RadioBoxGroupProps {
	name: string | number | any;
	options: Array<{ label: string; value: string }>;
}

const RadioBox = ({
	value,
	onChange,
	valueRadio,
	...item
}: {
	value?: string;
	onChange?: (value: string) => void;
	valueRadio: string;
} & Omit<
	RadioButtonItem,
	'handleRadioButton' | 'checked' | 'type' | 'value' | 'inputId'
>) => {
	const inputId = `radio-${valueRadio}`;
	return (
		<RadioButton
			checked={!!value}
			{...item}
			inputId={inputId}
			value={valueRadio}
			handleRadioButton={onChange}
			type="default"
		/>
	);
};

const LocalRadioBox = ({
	options,
	...rest
}: RadioBoxGroupProps & {
	value?: string;
	onChange?: (value: string) => void;
}) => {
	return (
		<>
			{options.map(({ value, label }) => (
				<RadioBox
					label={label}
					valueRadio={value}
					{...rest}
					key={value}
				/>
			))}
		</>
	);
};
export const RadioBoxGroup = ({
	name,
	dependencies,
	...props
}: RadioBoxGroupProps & { dependencies?: NamePath[] }) => {
	return (
		<Field
			name={name}
			rules={[{ required: true }]}
			dependencies={dependencies}
		>
			<LocalRadioBox {...props} name={name} />
		</Field>
	);
};
